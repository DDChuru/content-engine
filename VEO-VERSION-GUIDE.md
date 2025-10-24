# Veo 3.0 vs 3.1 - Which Should You Use?

## Quick Answer

**Use Veo 3.0** - It's configured by default and more widely available.

## Version Comparison

### Veo 3.0 (Default - Recommended)

**Availability:** ✅ More widely available
**Access:** Standard Google Cloud Vertex AI access
**Quality:** High-quality AI video generation
**Best For:** Most users starting with AI video generation

**Pros:**
- Easier to get access
- Well-tested and stable
- Good video quality
- Full feature support

**Cons:**
- Slightly older than 3.1
- May have minor quality differences vs 3.1

### Veo 3.1 (Preview)

**Availability:** ⚠️ Limited preview access
**Access:** Requires special request to Google
**Quality:** Latest and potentially improved
**Best For:** Users who need cutting-edge features or already have preview access

**Pros:**
- Latest model version
- Potential quality improvements
- Future-proof choice

**Cons:**
- Requires preview access request
- May take days to get approved
- Could have API changes during preview

## How to Switch Between Versions

### Option 1: Environment Variable (Recommended)

Edit your `.env` file:

```bash
# For Veo 3.0 (default, more widely available)
VEO_MODEL_VERSION=3.0

# For Veo 3.1 (preview access required)
VEO_MODEL_VERSION=3.1
```

### Option 2: In Code

```typescript
import { UnifiedTikTokGenerator } from './services/tiktok/unified-tiktok-generator.js';

// Use Veo 3.0 (default)
const generator30 = new UnifiedTikTokGenerator('3.0');

// Use Veo 3.1
const generator31 = new UnifiedTikTokGenerator('3.1');
```

### Option 3: Per Video Generation

```typescript
// Generate specific video with Veo 3.0
await generator.veoGenerator.generateVideo({
  prompt: 'Your video description',
  duration: 30,
  aspectRatio: '9:16',
  modelVersion: '3.0'  // Explicitly use 3.0
});

// Generate specific video with Veo 3.1
await generator.veoGenerator.generateVideo({
  prompt: 'Your video description',
  duration: 30,
  aspectRatio: '9:16',
  modelVersion: '3.1'  // Explicitly use 3.1
});
```

## Getting Access

### Veo 3.0 Access

1. **Enable Vertex AI:**
   - Go to https://console.cloud.google.com
   - Enable "Vertex AI API"

2. **Get API Key:**
   - Go to APIs & Services → Credentials
   - Create API key
   - Add to `.env`: `GOOGLE_CLOUD_API_KEY=your_key`

3. **Test:**
   ```bash
   npx tsx src/services/tiktok/test-ai-generation.ts
   ```

### Veo 3.1 Preview Access

1. **Complete Veo 3.0 setup first** (above)

2. **Request Preview Access:**
   - Visit: https://cloud.google.com/vertex-ai/generative-ai/docs/video/overview
   - Fill out access request form
   - Mention your use case
   - Wait for approval (typically 3-7 days)

3. **Switch to 3.1:**
   ```bash
   # In .env
   VEO_MODEL_VERSION=3.1
   ```

4. **Test:**
   ```bash
   npx tsx src/services/tiktok/test-ai-generation.ts
   ```

## Current Configuration

Your system is currently configured to use **Veo 3.0** by default.

To check which version you're using:

```bash
# Check your .env file
cat packages/backend/.env | grep VEO_MODEL_VERSION

# Expected output:
# VEO_MODEL_VERSION=3.0
```

## API Endpoints

The system automatically uses the correct endpoint based on version:

**Veo 3.0 Endpoint:**
```
https://us-central1-aiplatform.googleapis.com/v1/projects/
  {PROJECT_ID}/locations/us-central1/publishers/google/models/veo-3:generateVideo
```

**Veo 3.1 Endpoint:**
```
https://us-central1-aiplatform.googleapis.com/v1/projects/
  {PROJECT_ID}/locations/us-central1/publishers/google/models/veo-3.1:generateVideo
```

## Testing Both Versions

You can test both versions side-by-side:

```typescript
import { VeoVideoGenerator } from './services/tiktok/veo-video-generator.js';

// Create generators for both versions
const veo30 = new VeoVideoGenerator(undefined, undefined, '3.0');
const veo31 = new VeoVideoGenerator(undefined, undefined, '3.1');

const prompt = 'Victoria Falls waterfall, dramatic aerial view';

// Generate with both
const result30 = await veo30.generateVideo({ prompt, duration: 30 });
const result31 = await veo31.generateVideo({ prompt, duration: 30 });

console.log('Veo 3.0:', result30.metadata.model); // "veo-3"
console.log('Veo 3.1:', result31.metadata.model); // "veo-3.1"
```

## Pricing

Both versions use similar pricing:
- **~$0.15-0.30 per second** of generated video
- **30-second video ≈ $6.00**
- **Same for both 3.0 and 3.1**

The system estimates **$0.20/second** for cost calculations.

## Recommendations

### For Most Users (Starting Out)
✅ **Use Veo 3.0**
- Easier to access
- Stable and reliable
- Same pricing
- Great quality

### For Advanced Users (Preview Access)
Consider Veo 3.1 if:
- You already have preview access
- You need cutting-edge features
- You're experimenting with latest tech
- Quality differences matter for your use case

### For Production
- **Start with Veo 3.0** for stability
- **Monitor Veo 3.1** for GA (General Availability) announcement
- **Switch when 3.1 becomes generally available**

## Troubleshooting

### "Model veo-3 not found"
- Your API key might not have Veo access
- Check Vertex AI API is enabled
- Verify billing is enabled on your Google Cloud project

### "Model veo-3.1 not found"
- You likely don't have preview access yet
- Switch to `VEO_MODEL_VERSION=3.0`
- Or request preview access (see above)

### "Permission denied"
- Enable Vertex AI API in Google Cloud Console
- Check your API key has proper permissions
- Verify billing account is active

## Summary

**Current Setup:** ✅ Veo 3.0 (default)

**To Use Veo 3.1:**
1. Request preview access from Google
2. Change `.env`: `VEO_MODEL_VERSION=3.1`
3. Test: `npx tsx src/services/tiktok/test-ai-generation.ts`

**Recommendation:** Stick with Veo 3.0 unless you have specific need for 3.1 or already have preview access.

---

For more information:
- Google Veo Documentation: https://cloud.google.com/vertex-ai/generative-ai/docs/video
- System Documentation: `MULTILINGUAL-TIKTOK-SYSTEM.md`
- Quick Start: `QUICK-START.md`
