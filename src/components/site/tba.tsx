import type { ReactNode } from "react";

/** Placeholder text for a business detail the owner hasn't entered yet. */
export const TBA_TEXT = "[to be added]";

/**
 * A setting's value, or a visible "[to be added]" marker when it is empty
 * (not in legacy). `render` formats a present value (e.g. a mailto link).
 * `dark`: the marker on a maroon background (footer).
 */
export function Tba({ value, render, dark }: { value: string; render?: (v: string) => ReactNode; dark?: boolean }) {
  if (value.trim()) return <>{render ? render(value) : value}</>;
  return (
    <span className={`inline-block rounded-[6px] px-1.5 text-[.92em] font-semibold ${dark ? "bg-[rgba(242,201,135,.16)] text-gold-bright" : "bg-[#FFF1D6] text-[#7A4A00]"}`}>
      {TBA_TEXT}
    </span>
  );
}

/** `mailto:` link for a present email, else the marker. */
export function TbaEmail({ value }: { value: string }) {
  return <Tba value={value} render={(v) => <a href={`mailto:${v}`}>{v}</a>} />;
}

/**
 * Settings rows on the legal pages (company details, grievance officer; was `.bh-legal-facts`
 * in site-compliance.css, Tailwind since the migration's phase 2): two columns, one on phones.
 */
const FACTS =
  "m-0 mb-[1.25em] grid grid-cols-[max-content_1fr] gap-x-5 gap-y-1.5 rounded-[14px] border border-line bg-cream px-5 py-4 max-sm:grid-cols-1 " +
  "[&>dt]:font-bold [&>dt]:text-ink [&>dd]:m-0 [&>dd]:whitespace-pre-line [&>dd]:wrap-anywhere max-sm:[&>dd+dt]:mt-2";

type Facts = {
  siteName: string; legalName: string; address: string; cin: string; gstin: string; email: string; phone: string;
  grievanceName: string; grievanceEmail: string; grievancePhone: string;
};

/** "Who we are" on the legal pages: company name, registered office, CIN, GSTIN, contact. */
export function CompanyFacts({ b }: { b: Facts }) {
  return (
    <dl className={FACTS}>
      <dt>Company</dt><dd><Tba value={b.legalName} /> (operating {b.siteName})</dd>
      <dt>Registered office</dt><dd><Tba value={b.address} /></dd>
      <dt>CIN</dt><dd><Tba value={b.cin} /></dd>
      <dt>GSTIN</dt><dd><Tba value={b.gstin} /></dd>
      <dt>Email</dt><dd><TbaEmail value={b.email} /></dd>
      <dt>Phone</dt><dd><Tba value={b.phone} render={(v) => <a href={`tel:${v.replace(/[^0-9+]/g, "")}`}>{v}</a>} /></dd>
    </dl>
  );
}

/** The Grievance Officer's contact (DPDP Act 2023 s.8(9), s.13). */
export function GrievanceFacts({ b }: { b: Facts }) {
  return (
    <dl className={FACTS}>
      <dt>Grievance Officer</dt><dd><Tba value={b.grievanceName} /></dd>
      <dt>Email</dt><dd><TbaEmail value={b.grievanceEmail} /></dd>
      {b.grievancePhone && (<><dt>Phone</dt><dd>{b.grievancePhone}</dd></>)}
      <dt>Post</dt><dd>Grievance Officer, <Tba value={b.legalName} />, <Tba value={b.address} /></dd>
    </dl>
  );
}
