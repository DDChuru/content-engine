# ACS Credentials Setup

To enable the ACS work-instruction import workflow you need to provide both a Gemini API key and the ACS Firebase service account in the backend environment.

## Environment Variables

Add the following entries to your `.env` file (or the deployment environment):

```bash
# Gemini – reuse the same key you already configured for PeakFlow
GEMINI_API_KEY=your_gemini_api_key_here

# ACS Firebase – full service-account JSON (escaped as a single line)
ACS_FIREBASE_KEY='{"type":"service_account","project_id":"your-acs-project-id","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"firebase-adminsdk@your-acs-project-id.iam.gserviceaccount.com", ... }'
```

**Tips**
- Keep the JSON as a single quoted string (use `\n` for newlines in the private key) just like the existing `ICLEAN_FIREBASE_KEY` entry.
- Make sure the service account has Firestore read/write and Cloud Storage access if you plan to save extracted instructions.
- After updating the environment variables restart the backend (`npm run dev` in `packages/backend`) so the new credentials are picked up.
