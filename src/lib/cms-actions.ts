'use server';

import { refresh, updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { api, apiEnvelope, ApiError } from './api';
import { failure, type FormState } from './action-result';
import { setFlash } from './flash';
import { clearSession, setSession } from './session';
import { idSeg, seg } from '@/lib/api-path';

const pick = (form: FormData, fields: string[]) =>
  Object.fromEntries(fields.map((f) => [f, typeof form.getAll(f).at(-1) === 'string' ? form.getAll(f).at(-1) : null]));

/**
 * Present form fields only. A repeated name keeps its last value, as PHP
 * does: the forms pair each checkbox with a hidden "0" (legacy markup).
 */
function present(form: FormData, fields: string[]) {
  const out: Record<string, string> = {};
  for (const f of fields) {
    const v = form.getAll(f).at(-1);
    if (typeof v === 'string') out[f] = v;
  }
  return out;
}

/** Multipart copy of the form: the listed fields plus each chosen file. */
function multipart(form: FormData, fields: string[], fileFields: string[]) {
  const out = new FormData();
  for (const [k, v] of Object.entries(present(form, fields))) out.set(k, v);
  for (const name of fileFields) {
    for (const f of form.getAll(name)) {
      if (f instanceof File && f.size > 0 && f.name) out.append(name, f, f.name);
    }
  }
  return out;
}

/** Call the API, flash its status message, then go to `to` (or refresh the page). */
/**
 * Every Web Studio change can show on the public site, whose data is cached
 * under the `site` tag (lib/site-api.ts): each successful save expires it.
 */
async function act(path: string, init: { method?: string; body?: unknown }, to?: string) {
  const { message } = await apiEnvelope(path, { method: init.method ?? 'POST', body: init.body });
  await setFlash(message);
  updateTag('site');
  if (to) redirect(to);
  refresh();
}

// ---- CMS login (legacy /web-admin/login) ------------------------------

const CMS_ROLES = ['super_admin', 'web_admin', 'content_manager'];

export async function cmsLogin(_: FormState, form: FormData): Promise<FormState> {
  const identifier = String(form.get('identifier') ?? '').trim();
  let role: string;
  try {
    const data = await api<{ token: string; user: { role: string } }>('/auth/login', {
      body: { identifier, password: String(form.get('password') ?? ''), device: 'web' },
      token: null,
    });
    if (!CMS_ROLES.includes(data.user.role)) {
      await api('/auth/logout', { method: 'POST', token: data.token }).catch(() => undefined);
      await clearSession();
      return {
        ok: false,
        errors: { identifier: ['This account does not have access to the admin panel.'] },
        values: { identifier },
      };
    }
    await setSession(data.token, data.user.role);
    role = data.user.role;
  } catch (e) {
    if (e instanceof ApiError) return { ok: false, message: e.message, errors: e.errors, values: { identifier } };
    return { ok: false, message: 'Could not reach the server. Try again.', values: { identifier } };
  }
  // Cms\AuthController::home(): content managers to the site images, everyone else to the studio.
  redirect(role === 'content_manager' ? '/cms/images' : '/cms');
}

// ---- Collections -------------------------------------------------------

export async function saveResource(
  slug: string,
  id: number | null,
  fields: string[],
  imageFields: string[],
  _: FormState,
  form: FormData,
): Promise<FormState> {
  try {
    const body = multipart(form, fields, imageFields.map((f) => `${f}_file`));
    const { message } = await apiEnvelope(id ? `/cms/${seg(slug)}/${idSeg(id)}` : `/cms/${seg(slug)}`, {
      method: id ? 'PATCH' : 'POST',
      body,
    });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Could not save.', form);
  }
  redirect(`/cms/${slug}`);
}

export async function toggleResource(slug: string, id: number) {
  await act(`/cms/${seg(slug)}/${idSeg(id)}/toggle`, {});
}

export async function deleteResource(slug: string, id: number) {
  await act(`/cms/${seg(slug)}/${idSeg(id)}`, { method: 'DELETE' });
}

// ---- Pages and sections ------------------------------------------------

const PAGE_FIELDS = ['name', 'slug', 'template', 'status', 'meta_title', 'meta_description', 'meta_keywords', 'og_image', 'schema', 'noindex', 'sort_order'];
const SECTION_FIELDS = ['type', 'key', 'eyebrow', 'heading', 'subheading', 'body', 'media_url', 'data', 'is_active'];

export async function savePage(slug: string | null, _: FormState, form: FormData): Promise<FormState> {
  let target: string;
  try {
    const { data, message } = await apiEnvelope<{ slug: string }>(slug ? `/cms/pages/${seg(slug)}` : '/cms/pages', {
      method: slug ? 'PATCH' : 'POST',
      body: present(form, PAGE_FIELDS),
    });
    await setFlash(message);
  updateTag('site');
    target = `/cms/pages/${data.slug}`;
  } catch (e) {
    return failure(e, 'Could not save the page.', form);
  }
  redirect(target);
}

export async function deletePage(slug: string) {
  const { data, message } = await apiEnvelope<{ deleted: boolean }>(`/cms/pages/${seg(slug)}`, { method: 'DELETE' });
  await setFlash(message);
  updateTag('site');
  if (data.deleted) redirect('/cms/pages');
  refresh();
}

export async function saveSection(pageSlug: string, id: number | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope(id ? `/cms/sections/${idSeg(id)}` : `/cms/pages/${seg(pageSlug)}/sections`, {
      method: id ? 'PATCH' : 'POST',
      body: multipart(form, SECTION_FIELDS, ['media_file']),
    });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Could not save the section.', form);
  }
  refresh();
  return { ok: true };
}

export async function toggleSection(id: number) {
  await act(`/cms/sections/${idSeg(id)}/toggle`, {});
}

export async function deleteSection(id: number) {
  await act(`/cms/sections/${idSeg(id)}`, { method: 'DELETE' });
}

/** Move a section one place (legacy: drag-and-drop posting the new id order). */
export async function reorderSections(pageSlug: string, ids: number[]) {
  await api(`/cms/pages/${seg(pageSlug)}/sections/reorder`, { body: { ids } });
  updateTag('site');
  refresh();
}

// ---- Posts -------------------------------------------------------------

const POST_FIELDS = ['title', 'slug', 'blog_category_id', 'excerpt', 'body', 'cover_image_url', 'status', 'published_at', 'is_featured', 'reading_minutes', 'meta_title', 'meta_description', 'og_image', 'tags'];

export async function savePost(slug: string | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope(slug ? `/cms/posts/${seg(slug)}` : '/cms/posts', {
      method: slug ? 'PATCH' : 'POST',
      body: multipart(form, POST_FIELDS, ['cover_file']),
    });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Could not save the post.', form);
  }
  redirect('/cms/posts');
}

export async function deletePost(slug: string) {
  await act(`/cms/posts/${seg(slug)}`, { method: 'DELETE' });
}

// ---- Menus -------------------------------------------------------------

const ITEM_FIELDS = ['label', 'url', 'target', 'icon', 'parent_id', 'is_active'];

export async function saveMenuItem(menuKey: string, id: number | null, _: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope(id ? `/cms/menu-items/${idSeg(id)}` : `/cms/menus/${seg(menuKey)}/items`, {
      method: id ? 'PATCH' : 'POST',
      body: present(form, ITEM_FIELDS),
    });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Could not save the menu item.', form);
  }
  refresh();
  return { ok: true };
}

export async function deleteMenuItem(id: number) {
  await act(`/cms/menu-items/${idSeg(id)}`, { method: 'DELETE' });
}

export async function reorderMenu(menuKey: string, ids: number[]) {
  await api(`/cms/menus/${seg(menuKey)}/reorder`, { body: { ids } });
  updateTag('site');
  refresh();
}

// ---- Media -------------------------------------------------------------

export async function uploadMedia(_: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope('/cms/media', { body: multipart(form, ['media_folder_id'], ['files[]']) });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Upload failed.');
  }
  refresh();
  return { ok: true };
}

export async function updateMedia(id: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope(`/cms/media/${idSeg(id)}`, { method: 'PATCH', body: pick(form, ['alt', 'title', 'media_folder_id']) });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Could not save.', form);
  }
  refresh();
  return { ok: true };
}

export async function deleteMedia(id: number) {
  await act(`/cms/media/${idSeg(id)}`, { method: 'DELETE' });
}

export async function createFolder(_: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope('/cms/media-folders', { body: present(form, ['name', 'parent_id']) });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Could not create the folder.', form);
  }
  refresh();
  return { ok: true };
}

export async function deleteFolder(id: number) {
  await act(`/cms/media-folders/${idSeg(id)}`, { method: 'DELETE' }, '/cms/media');
}

// ---- Settings ----------------------------------------------------------

export async function saveSettings(group: string, fields: string[], imageFields: string[], _: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope(`/cms/settings/${seg(group)}`, {
      body: multipart(form, fields, imageFields.map((f) => `${f}_file`)),
    });
    await setFlash(message);
  updateTag('site');
  } catch (e) {
    return failure(e, 'Could not save the settings.', form);
  }
  redirect(`/cms/settings?tab=${group}`);
}

// ---- Leads -------------------------------------------------------------

export async function setLeadStatus(kind: 'demos' | 'contacts', id: number, form: FormData) {
  await act(`/cms/${seg(kind)}/${idSeg(id)}`, { method: 'PATCH', body: { status: form.get('status') } });
}

export async function deleteLead(kind: 'demos' | 'contacts' | 'subscribers', id: number) {
  await act(`/cms/${seg(kind)}/${idSeg(id)}`, { method: 'DELETE' });
}

// ---- Site images (Phase 6b) --------------------------------------------

export async function replaceSiteImage(path: string, _: FormState, form: FormData): Promise<FormState> {
  try {
    const body = new FormData();
    body.set('path', path);
    const file = form.get('image');
    if (file instanceof File && file.size > 0 && file.name) body.set('image', file, file.name);
    const { message } = await apiEnvelope('/cms/images/replace', { body });
    await setFlash(message);
    updateTag('site');
  } catch (e) {
    return failure(e, 'Could not replace the image.');
  }
  refresh();
  return { ok: true };
}

export async function restoreSiteImage(path: string) {
  await act('/cms/images/restore', { body: { path } });
}

export async function replaceSiteVideo(path: string, _: FormState, form: FormData): Promise<FormState> {
  try {
    const body = new FormData();
    body.set('path', path);
    const file = form.get('video');
    if (file instanceof File && file.size > 0 && file.name) body.set('video', file, file.name);
    const { message } = await apiEnvelope('/cms/images/video', { body });
    await setFlash(message);
    updateTag('site');
  } catch (e) {
    return failure(e, 'Could not replace the video.');
  }
  refresh();
  return { ok: true };
}
