/**
 * Content generation routes
 */

import { Router, Request, Response } from 'express';
import { ContentGenerator } from '../services/content-generator.js';
import {
  uploadToFirebaseStorage,
  saveToFirestore
} from '../services/firebase.js';
import multer from 'multer';
import fs from 'fs/promises';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Generate user manual
 */
router.post('/user-manual', async (req: Request, res: Response) => {
  try {
    const { repoUrl, projectPath, features, title, subtitle, targetProject } = req.body;
    const contentGenerator: ContentGenerator = req.app.locals.contentGenerator;

    // Validate input
    if (!features || !title) {
      return res.status(400).json({
        error: 'Features and title are required'
      });
    }

    // Generate user manual
    const result = await contentGenerator.generate({
      type: 'user-manual',
      repoUrl,
      projectPath,
      parameters: {
        features,
        title,
        subtitle
      },
      targetProject
    });

    // If target project specified, save to Firebase
    if (targetProject && result.success) {
      try {
        const timestamp = Date.now();

        // Upload HTML to Firebase Storage
        let htmlUrl: string | undefined;
        if (result.html) {
          const htmlBuffer = Buffer.from(result.html, 'utf-8');
          htmlUrl = await uploadToFirebaseStorage(
            targetProject,
            htmlBuffer,
            `content/user-manual-${timestamp}.html`,
            'text/html'
          );
          result.htmlUrl = htmlUrl;
        }

        // Upload thumbnail to Firebase Storage
        if (result.content?.mockups?.paths?.[0]) {
          const thumbnailPath = result.content.mockups.paths[0];
          const thumbnailBuffer = await fs.readFile(thumbnailPath);

          const thumbnailUrl = await uploadToFirebaseStorage(
            targetProject,
            thumbnailBuffer,
            `thumbnails/user-manual-${timestamp}.png`,
            'image/png'
          );
          result.thumbnailUrl = thumbnailUrl;
        }

        // Save to Firestore (filter out undefined values)
        const firestoreData: any = {
          type: 'user-manual',
          features: features || [],
          metadata: result.metadata,
          createdAt: new Date().toISOString()
        };

        // Only add defined fields
        if (title) firestoreData.title = title;
        if (subtitle) firestoreData.subtitle = subtitle;
        if (htmlUrl) firestoreData.htmlUrl = htmlUrl;
        if (result.thumbnailUrl) firestoreData.thumbnailUrl = result.thumbnailUrl;

        const docId = await saveToFirestore(
          targetProject,
          'generated_content',
          firestoreData
        );

        result.firebaseDocId = docId;
      } catch (firebaseError: any) {
        console.error('Firebase save error:', firebaseError);
        // Continue even if Firebase save fails
      }
    }

    res.json(result);
  } catch (error: any) {
    console.error('User manual generation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Generate SOP
 */
router.post('/sop', async (req: Request, res: Response) => {
  try {
    const { task, category, industry, frequency, targetProject } = req.body;
    const contentGenerator: ContentGenerator = req.app.locals.contentGenerator;

    if (!task || !category) {
      return res.status(400).json({
        error: 'Task and category are required'
      });
    }

    const result = await contentGenerator.generate({
      type: 'sop',
      parameters: {
        task,
        category,
        industry,
        frequency
      },
      targetProject
    });

    // Save to Firebase if target project specified
    if (targetProject && result.success) {
      try {
        const timestamp = Date.now();

        // Upload HTML to Firebase Storage
        let htmlUrl: string | undefined;
        if (result.html) {
          const htmlBuffer = Buffer.from(result.html, 'utf-8');
          htmlUrl = await uploadToFirebaseStorage(
            targetProject,
            htmlBuffer,
            `content/sop-${timestamp}.html`,
            'text/html'
          );
          result.htmlUrl = htmlUrl;
        }

        const firestoreData: any = {
          task,
          category,
          industry,
          frequency,
          content: result.content,
          metadata: result.metadata,
          createdAt: new Date().toISOString()
        };

        if (htmlUrl) firestoreData.htmlUrl = htmlUrl;

        const docId = await saveToFirestore(
          targetProject,
          'sops',
          firestoreData
        );
        result.firebaseDocId = docId;
      } catch (firebaseError: any) {
        console.error('Firebase save error:', firebaseError);
      }
    }

    res.json(result);
  } catch (error: any) {
    console.error('SOP generation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Generate lesson
 */
router.post('/lesson', async (req: Request, res: Response) => {
  try {
    const { topic, syllabus, difficulty, includeExercises, includeVisuals, targetProject } = req.body;
    const contentGenerator: ContentGenerator = req.app.locals.contentGenerator;

    if (!topic || !syllabus) {
      return res.status(400).json({
        error: 'Topic and syllabus are required'
      });
    }

    const result = await contentGenerator.generate({
      type: 'lesson',
      parameters: {
        topic,
        syllabus,
        difficulty,
        includeExercises,
        includeVisuals
      },
      targetProject
    });

    // Save to Firebase if target project specified
    if (targetProject && result.success) {
      try {
        const timestamp = Date.now();

        // Upload HTML to Firebase Storage
        let htmlUrl: string | undefined;
        if (result.html) {
          const htmlBuffer = Buffer.from(result.html, 'utf-8');
          htmlUrl = await uploadToFirebaseStorage(
            targetProject,
            htmlBuffer,
            `content/lesson-${timestamp}.html`,
            'text/html'
          );
          result.htmlUrl = htmlUrl;
        }

        const firestoreData: any = {
          topic,
          syllabus,
          difficulty,
          content: result.content,
          metadata: result.metadata,
          createdAt: new Date().toISOString()
        };

        if (htmlUrl) firestoreData.htmlUrl = htmlUrl;

        const docId = await saveToFirestore(
          targetProject,
          'lessons',
          firestoreData
        );
        result.firebaseDocId = docId;
      } catch (firebaseError: any) {
        console.error('Firebase save error:', firebaseError);
      }
    }

    res.json(result);
  } catch (error: any) {
    console.error('Lesson generation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Generate training material
 */
router.post('/training', async (req: Request, res: Response) => {
  try {
    const { topic, audience, duration, format, targetProject } = req.body;
    const contentGenerator: ContentGenerator = req.app.locals.contentGenerator;

    if (!topic || !audience) {
      return res.status(400).json({
        error: 'Topic and audience are required'
      });
    }

    const result = await contentGenerator.generate({
      type: 'training',
      parameters: {
        topic,
        audience,
        duration,
        format
      },
      targetProject
    });

    // Save to Firebase if target project specified
    if (targetProject && result.success) {
      try {
        const timestamp = Date.now();

        // Upload HTML to Firebase Storage
        let htmlUrl: string | undefined;
        if (result.html) {
          const htmlBuffer = Buffer.from(result.html, 'utf-8');
          htmlUrl = await uploadToFirebaseStorage(
            targetProject,
            htmlBuffer,
            `content/training-${timestamp}.html`,
            'text/html'
          );
          result.htmlUrl = htmlUrl;
        }

        const firestoreData: any = {
          topic,
          audience,
          duration,
          format,
          content: result.content,
          metadata: result.metadata,
          createdAt: new Date().toISOString()
        };

        if (htmlUrl) firestoreData.htmlUrl = htmlUrl;

        const docId = await saveToFirestore(
          targetProject,
          'training_materials',
          firestoreData
        );
        result.firebaseDocId = docId;
      } catch (firebaseError: any) {
        console.error('Firebase save error:', firebaseError);
      }
    }

    res.json(result);
  } catch (error: any) {
    console.error('Training generation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * Generate thumbnail
 */
router.post('/thumbnail', async (req: Request, res: Response) => {
  try {
    const { title, subtitle, theme, style } = req.body;
    const contentGenerator: ContentGenerator = req.app.locals.contentGenerator;

    if (!title) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    const result = await contentGenerator.generate({
      type: 'thumbnail',
      parameters: {
        title,
        subtitle,
        theme,
        style
      }
    });

    if (result.success && result.content) {
      // Send image as response
      res.set('Content-Type', 'image/png');
      res.send(result.content);
    } else {
      res.status(500).json({
        error: result.error || 'Failed to generate thumbnail'
      });
    }
  } catch (error: any) {
    console.error('Thumbnail generation error:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;