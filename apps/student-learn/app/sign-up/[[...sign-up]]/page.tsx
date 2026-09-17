'use client';

import { SignUp } from '@clerk/nextjs';
import { AuthShell } from '@/components/auth-shell';
import { clerkAppearance } from '@/components/clerk-appearance';

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create an account"
      title="Start your account"
      lede={
        <>
          Notes, explainers and the ink working stay free and need no account. An
          account is for the parts that carry your name to nobody but you — saved
          progress now, marked work later.
        </>
      }
      footer={
        <p>
          We ask for as little as we can get away with. The next screen explains
          every question before you answer it.
        </p>
      }
    >
      <SignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        forceRedirectUrl="/onboarding"
        fallbackRedirectUrl="/onboarding"
      />
    </AuthShell>
  );
}
