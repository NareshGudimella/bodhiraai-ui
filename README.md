# bodhiraai-ui

Next.js 16 frontend for Bodhira. It replaces the Blade UI of the legacy Laravel app (`../bodhiraai.com`) and calls the NestJS API (`../bodhiraai-api`).

```bash
cp .env.example .env.local   # API_URL=http://localhost:4000/api/v1
npm install
npm run dev                  # http://localhost:3000
```

Demo logins come from the legacy seed data (`student@bodhira.test`, `teacher@…`, `parent@…`, `admin@…`, `super@…`; password `password`).

See [AGENTS.md](AGENTS.md) for the structure and conventions, and [../docs/migration-plan.md](../docs/migration-plan.md) for status.
