'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiEnvelope } from './api';
import { failure, type FormState } from './action-result';
import { setFlash } from './flash';
import { setSession } from './session';
import { idSeg } from '@/lib/api-path';

const pick = (form: FormData, fields: string[]) =>
  Object.fromEntries(fields.map((f) => [f, typeof form.get(f) === 'string' ? form.get(f) : null]));

/** The submitted form without its passwords, for refilling fields after an error. */
function withoutPasswords(form: FormData) {
  const copy = new FormData();
  for (const [k, v] of form.entries()) if (!k.startsWith('password')) copy.append(k, v);
  return copy;
}

const SIGNUP_FIELDS = ['name', 'email', 'phone', 'password', 'password_confirmation', 'syllabus_id', 'plan_key', 'cycle', 'accept'];

/** B2C sign-up (legacy RegisterController::store): signs in, then checkout for a paid plan or the dashboard. */
export async function registerStudent(_: FormState, form: FormData): Promise<FormState> {
  let target: string;
  try {
    const { data, message } = await apiEnvelope<{
      token: string;
      checkout: { subscription_id: number; cycle: string } | null;
    }>('/auth/register/student', { body: pick(form, SIGNUP_FIELDS), token: null });
    await setSession(data.token, 'student');
    await setFlash(message);
    target = data.checkout
      ? `/checkout/${data.checkout.subscription_id}?cycle=${data.checkout.cycle}`
      : '/student';
  } catch (e) {
    return failure(e, 'Could not create your account.', withoutPasswords(form));
  }
  redirect(target);
}

/**
 * Paywall plan choice (legacy PaywallController::checkout). Demo mode activates
 * it and opens the dashboard; with live billing the API sends us to checkout.
 */
export async function paywallCheckout(_: FormState, form: FormData): Promise<FormState> {
  let target = '/student';
  try {
    const { data, message } = await apiEnvelope<{ checkout?: { subscription_id: number; cycle: string } }>(
      '/billing/paywall/checkout',
      { body: pick(form, ['plan', 'cycle']) },
    );
    await setFlash(message);
    if (data.checkout) target = `/checkout/${data.checkout.subscription_id}?cycle=${data.checkout.cycle}`;
  } catch (e) {
    return failure(e, 'Could not start that plan.');
  }
  redirect(target);
}

/** Pay for a subscription (legacy CheckoutController::complete), then the invoice page. */
export async function completeCheckout(subscriptionId: number, _: FormState, form: FormData): Promise<FormState> {
  let invoiceId: number;
  try {
    const { data, message } = await apiEnvelope<{ id: number }>(`/billing/checkout/${idSeg(subscriptionId)}/complete`, {
      body: pick(form, ['cycle', 'demo', 'razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature']),
    });
    await setFlash(message);
    invoiceId = data.id;
  } catch (e) {
    return failure(e, 'Payment could not be completed.');
  }
  redirect(`/checkout/success/${invoiceId}`);
}

export type CheckoutPayload = {
  gateway: 'razorpay' | 'stripe';
  demo?: boolean;
  key_id?: string;
  payment_id: number;
  order_id?: string;
  session_id?: string;
  checkout_url?: string | null;
  amount_paise: number;
  currency: string;
};

export type AdminCheckoutState = (FormState & { payload?: CheckoutPayload }) | undefined;

/**
 * School plan change (legacy BillingController::adminCheckout). Free switches
 * at once; a paid plan returns the gateway checkout to show.
 */
export async function adminCheckout(_: AdminCheckoutState, form: FormData): Promise<AdminCheckoutState> {
  try {
    const { data, message } = await apiEnvelope<CheckoutPayload | { plan: 'free' }>('/admin/billing/checkout', {
      body: pick(form, ['plan', 'gateway']),
    });
    if ('payment_id' in data) return { ok: true, payload: data };
    refresh();
    return { ok: true, message: message ?? 'Switched to Free plan.' };
  } catch (e) {
    return failure(e, 'Checkout failed.');
  }
}

/** Super admin manual grant (legacy BillingController::manualGrant). */
export async function grantPlan(schoolId: number, _: FormState, form: FormData): Promise<FormState> {
  try {
    const { message } = await apiEnvelope(`/super/billing/schools/${idSeg(schoolId)}/grant`, {
      body: pick(form, ['plan', 'days', 'amount_paise', 'note']),
    });
    refresh();
    return { ok: true, message: message ?? 'Plan granted.' };
  } catch (e) {
    return failure(e, 'Could not grant the plan.', form);
  }
}

