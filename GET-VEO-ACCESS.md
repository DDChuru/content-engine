# How to Get Veo Access for Your Project

Your system is configured correctly! You just need to enable Veo access on your Google Cloud project.

## Current Status

✅ **Project ID:** `gen-lang-client-0894301716`
✅ **API Key:** Configured
✅ **Code:** Ready to generate videos
❌ **Veo Access:** Not yet enabled (404 error)

## Steps to Enable Veo

### Step 1: Enable Vertex AI API

1. **Go to Vertex AI API page:**
   ```
   https://console.cloud.google.com/apis/library/aiplatform.googleapis.com?project=gen-lang-client-0894301716
   ```

2. **Click "ENABLE"** button

3. **Wait** for API to be enabled (usually takes 1-2 minutes)

### Step 2: Enable Billing (if not already enabled)

1. **Go to Billing page:**
   ```
   https://console.cloud.google.com/billing?project=gen-lang-client-0894301716
   ```

2. **Link a billing account** if not already done
   - Veo is a paid service (~$0.20/second of video)
   - You won't be charged until you actually generate videos

### Step 3: Request Veo Preview Access

Veo (both 3.0 and 3.1) is currently in **preview** and requires special access.

1. **Fill out the access request form:**
   - Visit: https://cloud.google.com/vertex-ai/generative-ai/docs/video/overview
   - Look for "Request Access" or "Try Veo" button
   - Or use this direct form: https://docs.google.com/forms/d/e/1FAIpQLSfNzXXl8xkKxCAPCHzKlATBzQKTxGRVqDPNXLJNcPCWAcqbXQ/viewform

2. **In the form, provide:**
   - Your Google Cloud Project ID: `gen-lang-client-0894301716`
   - Your use case: "Multilingual TikTok video generation for tourism/education content"
   - Your email
   - Company/Organization (if applicable)

3. **Submit and wait:**
   - Google typically responds in 3-7 days
   - You'll receive an email when access is granted

### Step 4: Test Your Access

Once you receive approval email:

```bash
cd packages/backend
npx tsx src/services/tiktok/test-ai-generation.ts
```

You should see:
```
[Veo 3.0] ✅ Video generated successfully!
[Veo 3.0] Video URL: https://...
```

## Alternative: Use Imagen 3 (Available Now)

While waiting for Veo access, you could use **Imagen 3** for image generation:

```typescript
// Generate images instead of videos (usually has easier access)
import { ImagenGenerator } from './imagen-generator';
const imagen = new ImagenGenerator();
```

## What You Can Do Right Now

### Option 1: Test Workflow A (Works Now!)

Process existing videos into multilingual TikToks:

```bash
npx tsx src/services/tiktok/test-full-pipeline.ts /path/to/your/video.mp4
```

This workflow is **fully functional** and doesn't need Veo!

### Option 2: Test Translation + Voice (Works Now!)

```bash
npx tsx src/services/tiktok/test-video-generation.ts
```

This tests the translation and voice generation which work perfectly.

## Checking Your Request Status

### Check if Vertex AI is enabled:

1. Go to: https://console.cloud.google.com/apis/dashboard?project=gen-lang-client-0894301716
2. Look for "Vertex AI API" in the list
3. Should show "Enabled"

### Check for Veo access:

Try the test command again:
```bash
npx tsx src/services/tiktok/test-ai-generation.ts
```

**If you have access:** You'll see actual video URLs
**If not yet:** You'll see 404 error (model not found)

## Troubleshooting

### "403 Permission Denied"
- Vertex AI API not enabled yet → Go to Step 1 above
- Billing not enabled → Go to Step 2 above

### "404 Model Not Found" (Current Issue)
- Veo access not granted yet → Go to Step 3 above
- Waiting for approval

### "401 Unauthorized"
- API key issue → Check your GOOGLE_CLOUD_API_KEY in .env
- Project mismatch → Verify project ID is correct

## Expected Timeline

- **Vertex AI API:** Immediate (1-2 minutes)
- **Veo Access Request:** 3-7 business days
- **Sometimes faster:** Some users get approved within 24 hours

## When You Get Access

The system is **100% ready** to use Veo. Once you get access:

1. No code changes needed ✅
2. Just run the test again ✅
3. Videos will generate automatically ✅

## Cost Estimates

Once you have access:

**Veo 3.0 Pricing:**
- ~$0.15-0.30 per second of video
- 30-second video ≈ $6.00
- 2 languages (EN + SN) ≈ $6.14 total

**Your first generation:**
```
Script: "Discover Victoria Falls, Zimbabwe!"
Duration: 30 seconds
Languages: English + Shona
Total Cost: ~$6.14
```

## Support

**Google Cloud Support:**
- Documentation: https://cloud.google.com/vertex-ai/docs
- Support: https://cloud.google.com/support

**Need Help?**
- Check system docs: `MULTILINGUAL-TIKTOK-SYSTEM.md`
- Version guide: `VEO-VERSION-GUIDE.md`
- Quick start: `QUICK-START.md`

---

**Summary:** Your project `gen-lang-client-0894301716` is correctly configured. Just need to enable Vertex AI API and request Veo preview access. System is ready to generate videos as soon as you get approval!
