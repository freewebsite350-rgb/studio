# AI Business Assistant Platform

This project is a multi-tenant AI automation platform that allows business owners to:
- Sign up and manage their profiles
- Configure their business context
- Connect their Facebook Page / WhatsApp
- Use AI to automatically reply to customer messages
- Access a secure dashboard to manage AI settings

---

## 🚀 Tech Stack & Standards

### *Frontend*
- Framework: *Next.js 14+ (App Router)*
- UI: *shadcn/ui*, TailwindCSS
- Auth Guard: Custom withAuth HOC (client & server-safe)
- State: Minimal client state, rely on server components

### *Backend*
- Database: *Supabase* for:
  - Authentication
  - User profiles
  - Business context
  - Facebook page IDs
  - Logging (messages, AI usage)
- Firebase is being phased out. No new features must use Firebase.

### *AI*
- Uses an internal flow: getPolicyAnswer()
- Input:
  - customer_question
  - business_context
  - userId
- Output must be { answer: string }

### *Integrations*
- *Facebook Messenger Webhook*
  - GET → Verify webhook
  - POST → Receive Messages
  - Use PAGE_ACCESS_TOKEN to reply

### *Hosting / Environments*
- Dev: GitHub Codespaces / Next.js dev
- Prod: Vercel or Netlify

---

## 📁 Standard Folder Structure (Manus must enforce this)

src/ ├── app/ │    ├── (auth)/ │    │      ├── login/page.tsx │    │      ├── register/page.tsx │    ├── dashboard/ │    │      ├── page.tsx │    │      ├── ai-settings/page.tsx │    ├── api/ │    │      ├── webhook/ │    │      │        ├── route.ts        # Messenger webhook handler │    │      ├── auth/ │    │      │        ├── route.ts        # Supabase RLS auth endpoints │    ├── page.tsx                         # Landing Page │ ├── components/ │    ├── landing-page.tsx │    ├── ui/ (shadcn components) │ ├── lib/ │    ├── supabase.ts                      # Supabase client (server & client versions) │    ├── auth.ts                          # withAuth helper │ ├── ai/ │    ├── flows/ │    │      ├── policy-qa-flow.ts │ ├── hooks/ │     ├── withAuth.ts │ ├── env │    ├── .env.local.example

