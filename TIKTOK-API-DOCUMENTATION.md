# TikTok Multilingual Pipeline API Documentation

Complete API reference for the TikTok multilingual video generation pipeline.

## Overview

The TikTok API enables you to:
1. **Analyze** long-form videos to find viral moments
2. **Render** multilingual TikTok videos with voice cloning
3. **Monitor** batch rendering progress
4. **Download** completed videos
5. **Manage** sessions and voice cloning

## Base URL

```
http://localhost:3001/api/tiktok
```

## Authentication

All endpoints require a valid session ID. Voice cloning is required for batch rendering.

---

## Endpoints

### 1. Analyze Video

Find the best viral moments in a long-form video.

**Endpoint:** `POST /api/tiktok/analyze`

**Request Body:**
```typescript
{
  videoPath: string;      // Path to video file
  count?: number;         // Number of moments to find (default: 10, max: 50)
  duration?: number;      // Desired duration per moment in seconds (default: 60, range: 15-180)
}
```

**Response:**
```typescript
{
  moments: Moment[];
  totalDuration: number;
  videoInfo: {
    duration: number;
    resolution: string;
    fps: number;
    codec: string;
    size: number;
  };
  analysisStats: {
    framesAnalyzed: number;
    transcriptLength: number;
    processingTime: number;  // milliseconds
  };
}
```

**Moment Object:**
```typescript
{
  index: number;
  startTime: number;       // seconds
  endTime: number;         // seconds
  duration: number;        // seconds
  hook: string;            // Description of opening hook
  keyMessage: string;      // Main value/insight
  viralPotential: number;  // Score 1-10
  caption: string;         // Suggested TikTok caption with hashtags
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/tiktok/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "count": 5,
    "duration": 60
  }'
```

**Example Response:**
```json
{
  "moments": [
    {
      "index": 1,
      "startTime": 45.2,
      "endTime": 105.2,
      "duration": 60,
      "hook": "Opens with surprising statistic that stops scroll",
      "keyMessage": "How AI is transforming content creation",
      "viralPotential": 9,
      "caption": "This AI hack will change everything! 🤯 #AI #ContentCreation #TikTokTips #Viral #TechTok"
    }
  ],
  "totalDuration": 1800,
  "videoInfo": {
    "duration": 1800,
    "resolution": "1920x1080",
    "fps": 30,
    "codec": "h264",
    "size": 524288000
  },
  "analysisStats": {
    "framesAnalyzed": 900,
    "transcriptLength": 15234,
    "processingTime": 45000
  }
}
```

**Error Codes:**
- `400` - Invalid parameters
- `404` - Video file not found
- `500` - Analysis failed

---

### 2. Batch Render

Render multilingual TikTok videos from selected moments.

**Endpoint:** `POST /api/tiktok/batch-render`

**Request Body:**
```typescript
{
  videoPath: string;           // Path to source video
  momentIndexes: number[];     // Which moments to render (e.g., [1, 3, 5])
  languages: string[];         // Target language codes (e.g., ["en", "es", "fr"])
  sessionId: string;           // Session ID with voice cloning
  captionStyle?: CaptionStyle;
  ctaConfig?: CTAConfig;
}
```

**CaptionStyle Object:**
```typescript
{
  fontFamily?: string;       // Default: "Montserrat"
  fontSize?: number;         // Default: 48
  fontColor?: string;        // Default: "#FFFFFF"
  backgroundColor?: string;  // Default: "rgba(0, 0, 0, 0.7)"
  position?: "top" | "center" | "bottom";  // Default: "bottom"
  animation?: "none" | "fade" | "slide" | "pop";  // Default: "pop"
}
```

**CTAConfig Object:**
```typescript
{
  text: string;              // CTA text (e.g., "Follow for more!")
  position?: "top" | "bottom";  // Default: "bottom"
  duration?: number;         // Seconds to display (default: 2)
  backgroundColor?: string;  // Default: "#FF0050"
  textColor?: string;        // Default: "#FFFFFF"
  fontSize?: number;         // Default: 36
}
```

**Response:**
```typescript
{
  operationId: string;       // Use this to poll progress
  status: "pending";
  message: string;
  totalOperations: number;
  estimatedTime: string;     // e.g., "15 minutes"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/tiktok/batch-render \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/video.mp4",
    "momentIndexes": [1, 2, 3],
    "languages": ["en", "es", "fr", "de"],
    "sessionId": "user_123",
    "captionStyle": {
      "position": "bottom",
      "animation": "pop",
      "fontSize": 52
    },
    "ctaConfig": {
      "text": "Follow @myhandle for more!",
      "position": "bottom",
      "duration": 3
    }
  }'
```

**Example Response:**
```json
{
  "operationId": "batch_1698765432_abc123def",
  "status": "pending",
  "message": "Batch rendering started",
  "totalOperations": 12,
  "estimatedTime": "6 minutes"
}
```

**Error Codes:**
- `400` - Invalid parameters or missing voice cloning
- `404` - Video file not found
- `500` - Failed to start rendering

**Important Notes:**
- Voice cloning is **required** - session must have a `voiceId`
- Each moment × language combination creates one video
- 3 moments × 4 languages = 12 videos
- Rendering happens **asynchronously** - use status endpoint to poll

---

### 3. Check Status

Poll the progress of a batch rendering operation.

**Endpoint:** `GET /api/tiktok/status/:operationId`

**Parameters:**
- `operationId` - Operation ID returned from batch-render

**Response:**
```typescript
{
  status: "pending" | "processing" | "completed" | "failed";
  progress: {
    current: number;
    total: number;
    percentage: number;
    currentTask?: string;
  };
  result?: TikTokBatch;     // Only when status is "completed"
  error?: string;           // Only when status is "failed"
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

**TikTokBatch Object (in result):**
```typescript
{
  videos: TikTokVideo[];
  totalCount: number;
  totalCost: number;        // Estimated cost in USD
  costPerVideo: number;
  processingTime: number;   // seconds
  errors?: BatchError[];
}
```

**TikTokVideo Object:**
```typescript
{
  momentIndex: number;
  language: string;
  path: string;             // Full path to video file
  caption: string;          // Translated caption
  duration: number;
  size: number;             // File size in bytes
}
```

**Example Request:**
```bash
curl http://localhost:3001/api/tiktok/status/batch_1698765432_abc123def
```

**Example Response (Processing):**
```json
{
  "status": "processing",
  "progress": {
    "current": 5,
    "total": 12,
    "percentage": 42,
    "currentTask": "Rendering moment 2 in es"
  },
  "createdAt": "2024-10-24T10:30:00.000Z",
  "updatedAt": "2024-10-24T10:32:15.000Z"
}
```

**Example Response (Completed):**
```json
{
  "status": "completed",
  "progress": {
    "current": 12,
    "total": 12,
    "percentage": 100
  },
  "result": {
    "videos": [
      {
        "momentIndex": 1,
        "language": "en",
        "path": "/output/tiktok/moment_1_en.mp4",
        "caption": "This AI hack will change everything! 🤯 #AI",
        "duration": 60,
        "size": 8388608
      }
    ],
    "totalCount": 12,
    "totalCost": 1.80,
    "costPerVideo": 0.15,
    "processingTime": 360
  },
  "createdAt": "2024-10-24T10:30:00.000Z",
  "updatedAt": "2024-10-24T10:36:00.000Z",
  "completedAt": "2024-10-24T10:36:00.000Z"
}
```

**Polling Recommendations:**
- Poll every 5-10 seconds
- Stop polling when status is "completed" or "failed"
- Show progress percentage to user

---

### 4. Download Video

Download a rendered TikTok video.

**Endpoint:** `GET /api/tiktok/download/:filename`

**Parameters:**
- `filename` - Video filename (format: `moment_1_en.mp4`)

**Response:**
- Content-Type: `video/mp4`
- Content-Disposition: `attachment; filename="moment_1_en.mp4"`
- Binary video data

**Example Request:**
```bash
curl http://localhost:3001/api/tiktok/download/moment_1_en.mp4 \
  --output moment_1_en.mp4
```

**Security:**
- Filename format is validated (prevents directory traversal)
- Only allows pattern: `moment_\d+_[a-z]{2}\.mp4`

**Error Codes:**
- `400` - Invalid filename format
- `404` - Video file not found
- `500` - Download failed

---

### 5. Get Supported Languages

Get list of all supported languages for translation and voice cloning.

**Endpoint:** `GET /api/tiktok/languages`

**Response:**
```typescript
{
  languages: LanguageConfig[];
  total: number;
}
```

**LanguageConfig Object:**
```typescript
{
  code: string;       // ISO 639-1 code
  name: string;       // English name
  nativeName: string; // Native language name
  rtl: boolean;       // Right-to-left script
}
```

**Example Request:**
```bash
curl http://localhost:3001/api/tiktok/languages
```

**Example Response:**
```json
{
  "languages": [
    {
      "code": "en",
      "name": "English",
      "nativeName": "English",
      "rtl": false
    },
    {
      "code": "es",
      "name": "Spanish",
      "nativeName": "Español",
      "rtl": false
    },
    {
      "code": "ar",
      "name": "Arabic",
      "nativeName": "العربية",
      "rtl": true
    }
  ],
  "total": 18
}
```

**Supported Languages:**
- English (en), Spanish (es), French (fr), German (de)
- Italian (it), Portuguese (pt), Russian (ru)
- Japanese (ja), Korean (ko), Chinese (zh)
- Arabic (ar), Hindi (hi), Dutch (nl)
- Polish (pl), Turkish (tr), Vietnamese (vi)
- Thai (th), Indonesian (id)

---

### 6. Clean Up Operation

Delete rendered videos and free up disk space.

**Endpoint:** `DELETE /api/tiktok/cleanup/:operationId`

**Parameters:**
- `operationId` - Operation ID to clean up

**Response:**
```typescript
{
  deleted: number;    // Number of files deleted
  freed: number;      // Bytes freed
  freedMB: string;    // Megabytes freed (formatted)
  operationId: string;
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3001/api/tiktok/cleanup/batch_1698765432_abc123def
```

**Example Response:**
```json
{
  "deleted": 12,
  "freed": 100663296,
  "freedMB": "96.00",
  "operationId": "batch_1698765432_abc123def"
}
```

**Notes:**
- Can only clean up completed or failed operations
- Deletes all video files associated with the operation
- Removes operation from tracker

---

### 7. Create/Update Session

Create or update a session with voice cloning information.

**Endpoint:** `POST /api/tiktok/session`

**Request Body:**
```typescript
{
  sessionId: string;
  voiceId?: string;
  voiceName?: string;
}
```

**Response:**
```typescript
{
  session: {
    id: string;
    voiceId?: string;
    voiceName?: string;
    createdAt: Date;
    lastActivity: Date;
  };
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/tiktok/session \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user_123",
    "voiceId": "voice_abc123",
    "voiceName": "John Doe"
  }'
```

---

### 8. Get Session

Retrieve session information including voice cloning status.

**Endpoint:** `GET /api/tiktok/session/:sessionId`

**Response:**
```typescript
{
  session: {
    id: string;
    voiceId?: string;
    voiceName?: string;
    hasVoiceCloned: boolean;
    createdAt: Date;
    lastActivity: Date;
    metadata?: object;
  };
}
```

**Example Request:**
```bash
curl http://localhost:3001/api/tiktok/session/user_123
```

---

## Complete Workflow Example

### Step 1: Analyze Video
```bash
# Find viral moments in your video
curl -X POST http://localhost:3001/api/tiktok/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/videos/podcast_episode_42.mp4",
    "count": 10,
    "duration": 60
  }' | jq '.moments[] | {index, viralPotential, caption}'
```

### Step 2: Select Best Moments
```javascript
// From the analysis, select moments with highest viral potential
const selectedMoments = [1, 3, 7];  // indexes of best moments
const targetLanguages = ["en", "es", "fr", "de"];
```

### Step 3: Start Batch Rendering
```bash
# Start rendering selected moments in multiple languages
curl -X POST http://localhost:3001/api/tiktok/batch-render \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/videos/podcast_episode_42.mp4",
    "momentIndexes": [1, 3, 7],
    "languages": ["en", "es", "fr", "de"],
    "sessionId": "user_123",
    "captionStyle": {
      "position": "bottom",
      "fontSize": 52,
      "animation": "pop"
    },
    "ctaConfig": {
      "text": "Follow @mypodcast for more!",
      "duration": 3
    }
  }' | jq '{operationId, totalOperations, estimatedTime}'
```

### Step 4: Poll Progress
```bash
# Check progress every 10 seconds
OPERATION_ID="batch_1698765432_abc123def"

while true; do
  STATUS=$(curl -s http://localhost:3001/api/tiktok/status/$OPERATION_ID | jq -r '.status')
  PROGRESS=$(curl -s http://localhost:3001/api/tiktok/status/$OPERATION_ID | jq -r '.progress.percentage')

  echo "Status: $STATUS - Progress: $PROGRESS%"

  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
    break
  fi

  sleep 10
done
```

### Step 5: Download Videos
```bash
# Download all completed videos
curl http://localhost:3001/api/tiktok/status/$OPERATION_ID | \
  jq -r '.result.videos[].path' | \
  xargs -I {} basename {} | \
  xargs -I {} curl http://localhost:3001/api/tiktok/download/{} --output {}
```

### Step 6: Clean Up
```bash
# Clean up after downloading
curl -X DELETE http://localhost:3001/api/tiktok/cleanup/$OPERATION_ID
```

---

## Cost Estimation

### Rendering Costs (Approximate)

**Per Video:**
- Voice generation (ElevenLabs): ~$0.30 per 1000 characters
- Translation (Google Cloud): ~$0.10 per 1000 characters
- Video processing: Compute costs only
- **Estimated total: $0.15-0.25 per video**

**Example Batch:**
- 3 moments × 4 languages = 12 videos
- Average caption: 100 characters
- **Total cost: ~$1.80-3.00**

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "error": "voiceId is required",
  "sessionId": "user_123"
}
```

**404 Not Found**
```json
{
  "error": "Video file not found",
  "path": "/path/to/video.mp4"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to analyze video",
  "details": "FFmpeg error: ..."  // Only in development
}
```

---

## Rate Limiting

**Recommendations:**
- Max 5 concurrent batch operations per user
- Max 100 moments analyzed per hour
- Max 1000 videos rendered per day

---

## Security Considerations

### Implemented Security Measures

1. **File Path Validation**
   - Prevents directory traversal attacks
   - Validates filename patterns
   - Restricts access to output directory only

2. **Input Validation**
   - Validates all numeric ranges
   - Sanitizes language codes
   - Checks array lengths

3. **Session Management**
   - 24-hour session timeout
   - Automatic cleanup of old sessions
   - Secure session ID generation

4. **Operation Cleanup**
   - 2-hour timeout for completed operations
   - Automatic temp file cleanup
   - Disk space monitoring

### Recommendations for Production

1. **Add Authentication**
   ```typescript
   // Add JWT or API key authentication
   app.use('/api/tiktok', authMiddleware);
   ```

2. **Add Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });

   app.use('/api/tiktok', limiter);
   ```

3. **Add File Size Limits**
   ```typescript
   // Limit video file size to 2GB
   const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024;
   ```

4. **Use Cloud Storage**
   - Store videos in S3/GCS
   - Generate signed URLs for downloads
   - Automatic cleanup after 7 days

---

## Testing Examples

### Using cURL

**Complete Test Suite:**
```bash
#!/bin/bash

# 1. Check supported languages
echo "=== Checking supported languages ==="
curl http://localhost:3001/api/tiktok/languages | jq '.total'

# 2. Create session
echo "\n=== Creating session ==="
curl -X POST http://localhost:3001/api/tiktok/session \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test_user", "voiceId": "test_voice"}' | jq

# 3. Analyze video
echo "\n=== Analyzing video ==="
curl -X POST http://localhost:3001/api/tiktok/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/test.mp4",
    "count": 3,
    "duration": 45
  }' | jq '.moments[0]'

# 4. Start batch render
echo "\n=== Starting batch render ==="
OPERATION=$(curl -s -X POST http://localhost:3001/api/tiktok/batch-render \
  -H "Content-Type: application/json" \
  -d '{
    "videoPath": "/path/to/test.mp4",
    "momentIndexes": [1],
    "languages": ["en", "es"],
    "sessionId": "test_user"
  }')

OPERATION_ID=$(echo $OPERATION | jq -r '.operationId')
echo "Operation ID: $OPERATION_ID"

# 5. Poll status
echo "\n=== Polling status ==="
curl http://localhost:3001/api/tiktok/status/$OPERATION_ID | jq

# 6. Download video (when ready)
echo "\n=== Downloading video ==="
curl http://localhost:3001/api/tiktok/download/moment_1_en.mp4 \
  --output test_video.mp4

# 7. Cleanup
echo "\n=== Cleaning up ==="
curl -X DELETE http://localhost:3001/api/tiktok/cleanup/$OPERATION_ID | jq
```

### Using JavaScript/TypeScript

```typescript
// TikTok API Client Example
class TikTokClient {
  private baseUrl = 'http://localhost:3001/api/tiktok';

  async analyze(videoPath: string, count = 10, duration = 60) {
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoPath, count, duration })
    });
    return response.json();
  }

  async batchRender(config: {
    videoPath: string;
    momentIndexes: number[];
    languages: string[];
    sessionId: string;
  }) {
    const response = await fetch(`${this.baseUrl}/batch-render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.json();
  }

  async checkStatus(operationId: string) {
    const response = await fetch(`${this.baseUrl}/status/${operationId}`);
    return response.json();
  }

  async pollUntilComplete(operationId: string, onProgress?: (progress: number) => void) {
    while (true) {
      const status = await this.checkStatus(operationId);

      if (onProgress) {
        onProgress(status.progress.percentage);
      }

      if (status.status === 'completed') {
        return status.result;
      }

      if (status.status === 'failed') {
        throw new Error(status.error);
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Usage
const client = new TikTokClient();

// Analyze video
const analysis = await client.analyze('/path/to/video.mp4', 5, 60);
console.log('Found moments:', analysis.moments.length);

// Render top 3 moments in 4 languages
const { operationId } = await client.batchRender({
  videoPath: '/path/to/video.mp4',
  momentIndexes: [1, 2, 3],
  languages: ['en', 'es', 'fr', 'de'],
  sessionId: 'user_123'
});

// Poll until complete
const result = await client.pollUntilComplete(operationId, (progress) => {
  console.log(`Progress: ${progress}%`);
});

console.log(`Rendered ${result.totalCount} videos!`);
```

---

## Support

For issues or questions:
- Check logs: `packages/backend/logs/`
- Enable debug mode: `NODE_ENV=development`
- Review error details in development mode

---

## Changelog

### v1.0.0 (2024-10-24)
- Initial release
- Complete multilingual pipeline
- 18 supported languages
- Session management
- Async batch rendering
- Progress tracking
- Automatic cleanup
