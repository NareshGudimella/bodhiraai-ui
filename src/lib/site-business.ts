import 'server-only';
import { settingResolver } from './site';

/**
 * The legacy contact page's published details (contact.blade.php), used when
 * the Web Studio `contact.*` setting is empty. One copy for every page (the
 * about page used to fall back to a placeholder number). not in legacy
 */
export const CONTACT_FALLBACK = {
  phone: '+91 99852 52786',
  email: 'bodhira.ai.pvt.ltd@gmail.com',
};

/**
 * Business and grievance details for the legal pages, footer and contact
 * page (not in legacy, 2026-11-22). Only what the owner has entered in the
 * Web Studio settings: an empty value stays '' and renders as "[to be
 * added]" (`<Tba>`), never an invented name, number or address.
 *
 * Keys: company.legal_name, company.address (registered office),
 * company.cin, company.gstin, grievance.name, grievance.email,
 * grievance.phone, billing.email (refunds and invoices; falls back to
 * contact.email), plus the existing contact.email / contact.phone.
 */
export async function businessDetails() {
  const setting = await settingResolver();
  const email = setting('contact.email', CONTACT_FALLBACK.email);
  return {
    siteName: setting('general.site_name', 'Bodhira.ai'),
    legalName: setting('company.legal_name'),
    address: setting('company.address'),
    cin: setting('company.cin'),
    gstin: setting('company.gstin'),
    email,
    billingEmail: setting('billing.email', email),
    phone: setting('contact.phone', CONTACT_FALLBACK.phone),
    grievanceName: setting('grievance.name'),
    grievanceEmail: setting('grievance.email'),
    grievancePhone: setting('grievance.phone'),
  };
}

export type BusinessDetails = Awaited<ReturnType<typeof businessDetails>>;
