# API Keys Setup Guide

**Required for Educational Content Pipeline**

---

## 🔑 Required API Keys

### Priority Order:

1. **ElevenLabs** (Critical) - Voice cloning & narration
2. **Gemini** (Critical) - Background images
3. **Claude** (Nice to have) - Lesson structure generation
4. **Firebase** (Optional) - Storage & deployment
5. **GitHub** (Optional) - Repository analysis

---

## 1. ElevenLabs (REQUIRED) 🎙️

**Cost:** Free tier available
**Purpose:** Clone your voice and generate narration

### Get Your Key:

1. **Sign up:** https://elevenlabs.io
2. **Go to Profile** → API Keys
3. **Click "Generate API Key"**
4. **Copy the key** (starts with `sk_...`)

### Free Tier Includes:
- ✅ 10,000 characters/month (~33 educational modules)
- ✅ Unlimited voice clones
- ✅ Commercial use allowed
- ✅ High quality voices

### Pricing (if you exceed free tier):
- **Starter:** $5/month - 30,000 characters
- **Creator:** $22/month - 100,000 characters
- **Pro:** $99/month - 500,000 characters

### Add to `.env`:
```bash
ELEVENLABS_API_KEY=sk_your_key_here
```

---

## 2. Gemini (REQUIRED) 🖼️

**Cost:** Free tier very generous
**Purpose:** Generate STATIC IMAGES ONLY (not videos!)

**IMPORTANT:** We use Gemini 2.0 Flash for static background images, NOT for video generation. Video animations are handled by Manim (FREE, local).

### What We DON'T Use:
- ❌ **Veo 3.1** (Google's AI video generation) - Not needed, we have Manim!
- ❌ **Imagen** (Google's image model) - Using Gemini 2.0 Flash instead

### What We DO Use:
- ✅ **Gemini 2.0 Flash** (Static images only)
- ✅ Model: `gemini-2.0-flash-exp`
- ✅ Purpose: Background images for intro/context scenes

### Get Your Key:

1. **Go to:** https://aistudio.google.com/app/apikey
2. **Click "Get API key"** or "Create API key"
3. **Select or create a Google Cloud project**
4. **Copy the key** (starts with `AIza...`)

### Free Tier Includes:
- ✅ 1,500 requests/day (plenty for educational content)
- ✅ Gemini 2.0 Flash (latest model)
- ✅ Static image generation

### Pricing (if you exceed free tier):
- **Static images:** ~$0.01 per image
- Very affordable for educational use!

### Add to `.env`:
```bash
# For static background images only (NOT video)
GEMINI_API_KEY=AIza_your_key_here
```

### Why Not Veo?
**We use Manim for animations instead:**
- Manim = FREE, better quality, mathematically precise
- Veo = Expensive, less precise, unnecessary for our use case

---

## 3. Claude (NICE TO HAVE) 🤖

**Cost:** Pay-as-you-go
**Purpose:** Generate lesson structures, scripts, explanations

### Get Your Key:

1. **Sign up:** https://console.anthropic.com
2. **Go to Settings** → API Keys
3. **Click "Create Key"**
4. **Copy the key** (starts with `sk-ant-...`)

### Free Tier:
- ❌ No free tier, but...
- ✅ $5 credit when you sign up
- ✅ Very cheap for educational content

### Pricing:
- **Claude 3.5 Sonnet:** $3 per 1M tokens input, $15 per 1M output
- **For educational content:** ~$0.05 per lesson structure
- **$5 credit = ~100 lessons**

### Add to `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

### Optional (if you don't have Claude):
You can manually write lesson structures and just use Manim + ElevenLabs!

---

## 4. Firebase (OPTIONAL) 🔥

**Cost:** Free tier generous
**Purpose:** Store videos, SCORM packages, user data

### Get Your Service Account:

1. **Go to:** https://console.firebase.google.com
2. **Create or select project**
3. **Go to Project Settings** (gear icon) → Service Accounts
4. **Click "Generate new private key"**
5. **Download JSON file**

### For Multiple Projects:
If you want to support multiple Firebase projects (like iClean, Math, etc.):

```bash
# Example for educational math platform
MATH_FIREBASE_KEY='{"type":"service_account","project_id":"your-project",...}'
```

### Add to `.env`:
```bash
# Store the entire JSON as a string
FIREBASE_KEY='{"type":"service_account","project_id":"...",...}'
```

**Note:** Not needed for basic testing - videos save to local disk

---

## 5. GitHub (OPTIONAL) 🐙

**Cost:** Free
**Purpose:** Analyze code repositories for documentation generation

### Get Your Token:

1. **Go to:** https://github.com/settings/tokens
2. **Click "Generate new token (classic)"**
3. **Select scopes:**
   - ✅ `repo` (full control of private repos)
   - ✅ `read:org` (read org data)
4. **Generate and copy token**

### Add to `.env`:
```bash
GITHUB_TOKEN=ghp_your_token_here
```

**Note:** Only needed if generating content from GitHub repositories

---

## 📄 Complete `.env` File Template

Create `.env` in project root: `/home/dachu/Documents/projects/worktrees/educational-content/.env`

```bash
#############################################
# Educational Content Pipeline - API Keys
#############################################

# === CRITICAL (Required for educational content) ===

# ElevenLabs - Voice cloning & narration
ELEVENLABS_API_KEY=sk_your_elevenlabs_key_here

# Gemini - Image generation
GEMINI_API_KEY=AIza_your_gemini_key_here


# === NICE TO HAVE (Recommended) ===

# Claude - Lesson structure generation
ANTHROPIC_API_KEY=sk-ant-your_claude_key_here


# === OPTIONAL (Advanced features) ===

# Firebase - Storage & deployment
FIREBASE_KEY='{"type":"service_account","project_id":"your-project-id",...}'

# GitHub - Repository analysis
GITHUB_TOKEN=ghp_your_github_token_here

# OpenAI - Alternative TTS (if not using ElevenLabs)
OPENAI_API_KEY=sk-your_openai_key_here


#############################################
# Server Configuration
#############################################

# Backend server port
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## 💰 Cost Calculator

### For 10 Educational Modules (100 minutes content):

| Service | Usage | Cost |
|---------|-------|------|
| **ElevenLabs** | ~30,000 chars | $0 (free tier) or $5/month |
| **Gemini** | ~40 images | $0 (free tier) or $0.40 |
| **Claude** | ~10 lesson structures | $0.50 |
| **Manim** | Unlimited animations | **FREE** ✅ |
| **Firebase** | 1GB storage | $0 (free tier) |
| **TOTAL** | | **$0-$6** |

**Compare to:** Traditional video production = $5,000-$10,000

---

## 🧪 Minimal Setup for Testing

**Just want to test? Only need these 2:**

### 1. ElevenLabs (for voice)
```bash
ELEVENLABS_API_KEY=sk_...
```

### 2. Gemini (for images)
```bash
GEMINI_API_KEY=AIza...
```

**That's it!** You can generate complete educational modules with just these two keys.

---

## ✅ Verification Checklist

After adding keys to `.env`, verify they work:

### Test 1: Check .env file exists
```bash
ls -la /home/dachu/Documents/projects/worktrees/educational-content/.env
```

### Test 2: Verify backend can read keys
```bash
cd packages/backend
npm run dev

# Look for startup logs - should NOT see errors about missing keys
```

### Test 3: Test ElevenLabs connection
```bash
curl http://localhost:3001/api/education/voices
```

**Expected:** Returns list of available voices (may be empty if no voices cloned yet)

### Test 4: Test Gemini connection
```bash
# This will test both Gemini and Manim
curl -X POST http://localhost:3001/api/education/test-manim
```

**Expected:** Returns success with video path

---

## 🚨 Troubleshooting

### Error: "ElevenLabs API key is required"
**Solution:**
1. Check `.env` file is in project root (not in `packages/backend/`)
2. Verify key starts with `sk_`
3. Restart backend server

### Error: "Gemini API key invalid"
**Solution:**
1. Verify key starts with `AIza`
2. Check key hasn't expired
3. Verify API is enabled in Google Cloud Console

### Error: "Cannot find module 'dotenv'"
**Solution:**
```bash
cd packages/backend
npm install dotenv
```

### Backend can't find .env file
**Solution:**
The backend loads from root directory. Check the path:
```typescript
// In packages/backend/src/index.ts
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
```

File should be at: `/home/dachu/Documents/projects/worktrees/educational-content/.env`

---

## 🎯 Recommended Setup Path

### For Quick Testing (5 minutes):
1. ✅ Get ElevenLabs key (free signup)
2. ✅ Get Gemini key (instant)
3. ✅ Add to `.env`
4. ✅ Start testing!

### For Full Features (15 minutes):
1. ✅ Above + Claude key
2. ✅ Record your voice samples
3. ✅ Clone voice
4. ✅ Generate complete lessons

### For Production (30 minutes):
1. ✅ Above + Firebase setup
2. ✅ Configure storage
3. ✅ Set up deployment pipeline

---

## 📊 API Key Priority Matrix

| Key | Required? | Cost | Time to Get | Impact |
|-----|-----------|------|-------------|--------|
| ElevenLabs | ✅ YES | Free tier | 2 min | HIGH - Your voice! |
| Gemini | ✅ YES | Free tier | 1 min | MEDIUM - Images |
| Claude | ⚠️ Nice | $5 credit | 3 min | MEDIUM - Auto lessons |
| Firebase | ❌ Optional | Free tier | 10 min | LOW - Storage only |
| GitHub | ❌ Optional | Free | 2 min | LOW - Repo analysis |

**Start with:** ElevenLabs + Gemini = 3 minutes to working system!

---

## 🎁 Free Tier Summary

**You can generate educational content for FREE with:**

- **ElevenLabs:** 10,000 chars/month = ~33 modules
- **Gemini:** 1,500 requests/day = unlimited for practical use
- **Manim:** Unlimited (local rendering)
- **Total:** ~33 complete educational modules per month, FREE!

**When you upgrade:**
- **ElevenLabs Starter ($5/mo):** ~100 modules/month
- **Cost per module:** $0.05 (narration only, Manim still FREE)

**This is incredibly affordable for world-class educational content!**

---

## 📞 Need Help Getting Keys?

### ElevenLabs Issues:
- Support: https://elevenlabs.io/docs
- Discord: https://discord.gg/elevenlabs

### Gemini Issues:
- Docs: https://ai.google.dev/docs
- Get API key: https://aistudio.google.com/app/apikey

### Claude Issues:
- Docs: https://docs.anthropic.com
- Support: support@anthropic.com

---

## ✅ Quick Setup Script

```bash
#!/bin/bash

echo "🔑 Educational Content Pipeline - API Key Setup"
echo ""
echo "Visit these URLs to get your API keys:"
echo ""
echo "1. ElevenLabs (REQUIRED):"
echo "   https://elevenlabs.io"
echo "   → Profile → API Keys → Generate"
echo ""
echo "2. Gemini (REQUIRED):"
echo "   https://aistudio.google.com/app/apikey"
echo "   → Create API key"
echo ""
echo "3. Claude (NICE TO HAVE):"
echo "   https://console.anthropic.com"
echo "   → Settings → API Keys"
echo ""
echo "After getting keys, create .env file:"
echo ""
echo "cat > .env << 'EOF'
ELEVENLABS_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF"
echo ""
echo "Then test with:"
echo "  cd packages/backend"
echo "  npm run dev"
```

Save as `setup-keys.sh` and run: `./setup-keys.sh`

---

**Ready to set up your keys? Start with ElevenLabs + Gemini! 🚀**
