'use client';

import { SignIn } from '@clerk/nextjs';
import { AuthShell } from '@/components/auth-shell';
import { clerkAppearance } from '@/components/clerk-appearance';

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      lede="Pick up where your working left off."
    >
      <SignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        forceRedirectUrl="/onboarding"
        fallbackRedirectUrl="/onboarding"
      />
    </AuthShell>
  );
}
