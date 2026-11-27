// not in legacy: provider credentials moved from env vars to /super/integrations. Client-safe (no secrets).
export type IntegrationField = {
  name: string;
  label: string;
  kind?: 'text' | 'int' | 'secret' | 'bool' | 'select' | 'url';
  hint?: string;
  placeholder?: string;
  maxLength?: number;
  /** HTML `pattern` (the API's regex without anchors). */
  pattern?: string;
  min?: number;
  max?: number;
  options?: [string, string][];
  /** payments: shown only for this gateway */
  gateway?: string;
};

/** R2 bucket names (3 to 63 lowercase letters, digits and dashes). */
const BUCKET = '[a-z0-9][a-z0-9\\-]{1,61}[a-z0-9]';

export const PROVIDERS = ['storage', 'sms', 'payments', 'ai'] as const;
export type ProviderKey = (typeof PROVIDERS)[number];

export const INTEGRATIONS: Record<ProviderKey, { title: string; blurb: string; fields: IntegrationField[]; test?: string }> = {
  storage: {
    title: 'Storage (Cloudflare R2)',
    blurb: 'Where uploads and lesson files are kept.',
    fields: [
      { name: 'account_id', label: 'Account ID', maxLength: 64, pattern: '[A-Za-z0-9]+' },
      { name: 'access_key_id', label: 'Access key ID', maxLength: 190 },
      { name: 'secret_access_key', label: 'Secret access key', kind: 'secret', maxLength: 500 },
      { name: 'bucket', label: 'Bucket', maxLength: 63, pattern: BUCKET },
      { name: 'public_url', label: 'Public URL', kind: 'url', maxLength: 190 },
      { name: 'private_bucket', label: 'Private bucket', maxLength: 63, pattern: BUCKET, hint: 'Signed links only: submissions, photos, invoices, lesson files' },
      { name: 'video_bucket', label: 'Video bucket', maxLength: 63, pattern: BUCKET, hint: 'Optional, private: lesson videos waiting to be transcoded (else the private bucket)' },
      { name: 'legacy_bucket', label: 'Legacy bucket', maxLength: 63, pattern: BUCKET },
    ],
    test: 'Test connection',
  },
  sms: {
    title: 'SMS (MSG91)',
    blurb: 'One-time codes and notifications by SMS.',
    fields: [
      { name: 'enabled', label: 'SMS enabled', kind: 'bool' },
      { name: 'auth_key', label: 'Auth key', kind: 'secret', maxLength: 200 },
      { name: 'sender_id', label: 'Sender ID', maxLength: 11, pattern: '[A-Za-z0-9]+', hint: 'Up to 11 letters and digits' },
      { name: 'template_id', label: 'Template ID', maxLength: 64, pattern: '[A-Za-z0-9]+', hint: 'Required when SMS is enabled' },
    ],
    test: 'Send test SMS',
  },
  payments: {
    title: 'Payments',
    blurb: 'The gateway that takes subscription payments.',
    fields: [
      {
        name: 'gateway',
        label: 'Gateway',
        kind: 'select',
        options: [['razorpay', 'Razorpay'], ['stripe', 'Stripe'], ['none', 'None']],
      },
      { name: 'razorpay_key_id', label: 'Razorpay key ID', maxLength: 190, pattern: 'rzp_[A-Za-z0-9_]+', gateway: 'razorpay' },
      { name: 'razorpay_key_secret', label: 'Razorpay key secret', kind: 'secret', maxLength: 500, gateway: 'razorpay' },
      { name: 'razorpay_webhook_secret', label: 'Razorpay webhook secret', kind: 'secret', maxLength: 500, gateway: 'razorpay' },
      { name: 'stripe_secret', label: 'Stripe secret key', kind: 'secret', maxLength: 500, gateway: 'stripe' },
      { name: 'stripe_webhook_secret', label: 'Stripe webhook secret', kind: 'secret', maxLength: 500, gateway: 'stripe' },
      // not in legacy: production refuses demo checkout (no payment) unless this is on.
      { name: 'allow_demo', label: 'Allow demo checkout in production', kind: 'bool', hint: 'Plans activate without payment while no gateway has keys. Leave off in production.' },
    ],
    test: 'Test gateway',
  },
  ai: {
    title: 'AI tutor (Anthropic)',
    blurb: 'Model and limits for the AI tutor.',
    fields: [
      { name: 'api_key', label: 'API key', kind: 'secret', maxLength: 500 },
      { name: 'model', label: 'Model', maxLength: 100, pattern: '[A-Za-z0-9._:@\\-]+', placeholder: 'claude-opus-5-5' },
      { name: 'max_tokens', label: 'Max tokens', kind: 'int', min: 1, max: 64000 },
      { name: 'daily_token_limit', label: 'Daily token limit', kind: 'int', min: 1, max: 100000000 },
    ],
    test: 'Test key',
  },
};
