# Ed-Bridge

Ed-Bridge is an early-stage student-support initiative exploring how university students can find legitimate education-support opportunities, understand the requirements, and connect with the organisations that provide them.

## Product principles

- Show the official provider and source for every opportunity, with a last-checked date.
- Explain eligibility, deadlines, and application steps in plain language.
- Treat student identity, academic records, and financial information as private.
- Keep access fair and make clear that listing an opportunity does not guarantee selection or funding.
- Describe MUMSA and other organisations as prospective stakeholders unless a collaboration is formally agreed.
- Do not receive or route funds through Ed-Bridge without an agreed, accountable process.

These principles reflect expectations discussed with MUMSA. They do not imply an active partnership or commitment from MUMSA.

## Prototype status

The current web and Android projects are prototypes. People, opportunities, amounts, activity, and verification indicators shown in the interface are illustrative sample data. The web demo does not verify students, send applications, transfer money, or connect to institutional systems. Do not treat a sample listing or profile as a real offer or beneficiary.

The first web MVP is being narrowed to opportunity discovery: browse a listing, understand its eligibility and deadline, see its official source and review date, and continue to the provider's own application channel. Student-support referrals and any financial workflows need separate safeguarding and stakeholder approval before they are enabled.

## Web app: local development

Requirements: Node.js 20+ and npm.

```sh
npm ci
npm run dev
```

The web app uses React, TanStack Start, Vite, and Tailwind CSS. To create a production build locally:

```sh
npm run build
```

## Vercel deployment

The repository is configured for TanStack Start on Vercel through Nitro. Import this repository into a Vercel project and let Vercel use the TanStack Start framework preset. The project currently needs no environment secrets. A Vercel deployment URL is separate from this GitHub source-code URL.

## Android app

The `app/` directory contains a separate native Android prototype using Kotlin and Jetpack Compose. Vercel deploys the web app; it does not publish the Android app to Google Play.
