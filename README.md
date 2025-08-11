# Jelly Forge — AI 3D Icon & App Icon Generator

Jelly Forge turns logos into stunning 3D jelly icons with glassmorphism effects. Download transparent PNGs ready for iOS, Android, and the web. Built with [Next.js](https://nextjs.org) and [Convex](https://www.convex.dev/), with authentication by [Clerk](https://clerk.com/).

## Getting Started

First, you need to set up your environment variables. Create a `.env.local` file in the root of your project and add the following:

```
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

CLERK_FRONTEND_API_URL=
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Convex Documentation](https://docs.convex.dev/home) - learn about Convex features and API.
- [Clerk Documentation](https://clerk.com/docs) - learn about Clerk for user authentication.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
