/**
 * Education Firestore Service
 *
 * Comprehensive service for managing IGCSE Mathematics education content.
 * Supports Core/Extended topic differentiation and multi-agent content generation.
 *
 * Structure:
 *   syllabi/{syllabusId}
 *     /units/{unitId}
 *       /topics/{topicId}
 *         - lesson content
 *         - generation status
 *         - assets
 *   students/{studentId}
 *     /progress/{topicId}
 *   generation-queue/{taskId}
 */

import { getFirebaseProject } from './firebase.js';
import { Firestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

// ============================================================================
// TYPES
// ============================================================================

export type TopicLevel = 'Core' | 'Extended';
export type ContentStatus = 'not_started' | 'generating' | 'review' | 'approved' | 'published';
export type AssetType = 'video' | 'audio' | 'image' | 'svg' | 'interactive';

export interface SyllabusMetadata {
  id: string;
  code: string;                    // e.g., "0580"
  title: string;                   // e.g., "Cambridge IGCSE Mathematics"
  examBoard: string;               // e.g., "Cambridge International"
  years: number[];                 // e.g., [2025, 2026, 2027]
  version: string;
  lastUpdated: string;

  // Coverage stats
  totalUnits: number;
  totalTopics: number;
  coreTopics: number;
  extendedTopics: number;

  // Generation progress
  topicsGenerated: number;
  topicsPublished: number;
}

export interface Unit {
  id: string;
  code: string;                    // e.g., "C1" or "E1"
  title: string;                   // e.g., "Number"
  level: TopicLevel;
  sequenceOrder: number;
  icon?: string;
  color?: string;

  // Stats
  topicCount: number;
  generatedCount: number;
  publishedCount: number;
  estimatedDuration: number;       // minutes
}

export interface Topic {
  id: string;
  code: string;                    // e.g., "C1.2" or "E4.7"
  title: string;                   // e.g., "Sets"
  level: TopicLevel;
  unitId: string;
  sequenceOrder: number;

  // Syllabus content
  syllabusContent: string[];       // What the syllabus says to cover
  syllabusExamples?: string[];
  syllabusNotes?: string[];
  syllabusNotation?: string[];

  // Generation status
  status: ContentStatus;
  generatedAt?: string;
  generatedBy?: string;            // Agent/user who generated
  reviewedAt?: string;
  reviewedBy?: string;
  publishedAt?: string;

  // Lesson content (once generated)
  lesson?: LessonContent;

  // Assets
  assets: TopicAsset[];

  // Social media hooks (for later)
  socialHooks?: {
    tiktok?: string;
    instagram?: string;
    youtube?: string;
  };

  // Metadata
  estimatedDuration: number;       // minutes
  difficulty: 'foundation' | 'core' | 'extended' | 'challenge';
  tags: string[];
}

export interface LessonContent {
  // Opening
  hook: string;
  realWorldConnection: string;

  // Prerequisites
  priorKnowledge: {
    topicCode: string;
    topicTitle: string;
    concepts: string[];
    checkQuestion?: string;
  }[];

  // Objectives
  objectives: {
    id: string;
    verb: string;                  // Bloom's taxonomy
    description: string;
    examWeight: string;
  }[];

  // Theory sections
  theorySections: {
    id: string;
    title: string;
    order: number;
    introduction: string;
    keyQuestion?: string;
    content: ContentBlock[];
    keyFormulas?: Formula[];
    keyDefinitions?: Definition[];
    keyPoints: string[];
  }[];

  // Misconceptions
  misconceptions: {
    id: string;
    wrongIdea: string;
    whyWrong: string;
    correctUnderstanding: string;
    exampleOfMistake: string;
    correctExample: string;
  }[];

  // Worked examples
  workedExamples: {
    id: string;
    difficulty: string;
    question: string;
    marks: number;
    steps: {
      stepNumber: number;
      instruction: string;
      working: string;
      explanation: string;
      commonError?: string;
    }[];
    answer: string;
    examTip: string;
    marksBreakdown: string;
  }[];

  // Practice questions
  practiceQuestions: {
    id: string;
    difficulty: string;
    questionType: string;
    question: string;
    options?: { label: string; value: string; isCorrect: boolean }[];
    correctAnswer: string;
    hint?: string;
    solutionSteps?: string[];
    feedbackCorrect: string;
    feedbackIncorrect: string;
  }[];

  // Summary
  summary: {
    keyTakeaways: string[];
    formulaSheet?: string[];
    examTips: string[];
    nextTopics: string[];
  };
}

export interface ContentBlock {
  id: string;
  type: 'video' | 'svg-animation' | 'gemini-diagram' | 'manim-animation' |
        'latex-formula' | 'interactive' | 'text';
  title?: string;
  description?: string;

  // For different types
  geminiPrompt?: string;
  animationDescription?: string;
  latex?: string;
  narrationText?: string;

  // Asset reference (once generated)
  assetId?: string;
  assetUrl?: string;
}

export interface Formula {
  name: string;
  latex: string;
  explanation: string;
  whenToUse: string;
}

export interface Definition {
  term: string;
  definition: string;
  example?: string;
}

export interface TopicAsset {
  id: string;
  type: AssetType;
  name: string;
  url: string;
  storagePath: string;
  mimeType: string;
  size: number;
  duration?: number;               // for video/audio
  createdAt: string;
}

export interface StudentProgress {
  topicId: string;
  status: 'not_started' | 'in_progress' | 'completed';

  // Time tracking
  firstAccessedAt?: string;
  lastAccessedAt?: string;
  totalTimeSpent: number;          // seconds

  // Section progress
  theorySectionsViewed: string[];
  examplesCompleted: string[];
  practiceCompleted: string[];

  // Quiz results
  quizAttempts: {
    attemptNumber: number;
    score: number;
    maxScore: number;
    percentage: number;
    completedAt: string;
    answers: { questionId: string; correct: boolean }[];
  }[];

  // Best score
  bestQuizScore?: number;
  passed: boolean;                 // >= 80%
}

export interface GenerationTask {
  id: string;
  topicCode: string;
  topicTitle: string;
  level: TopicLevel;

  status: 'queued' | 'in_progress' | 'completed' | 'failed';
  priority: number;                // 1 = highest

  // Assignment
  assignedTo?: string;             // Agent ID or "claude-code"
  assignedAt?: string;

  // Progress
  steps: {
    structure: 'pending' | 'complete';
    theory: 'pending' | 'complete';
    examples: 'pending' | 'complete';
    visuals: 'pending' | 'complete';
    narration: 'pending' | 'complete';
    review: 'pending' | 'complete';
  };
  currentStep: string;

  // Results
  completedAt?: string;
  error?: string;
  lessonId?: string;

  createdAt: string;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class EducationFirestoreService {
  private db: Firestore;
  private syllabusId: string = 'cambridge-igcse-0580';

  constructor() {
    const project = getFirebaseProject('education');
    if (!project) {
      throw new Error('Education Firebase project not initialized');
    }
    this.db = project.db;
  }

  // ==========================================================================
  // SYLLABUS MANAGEMENT
  // ==========================================================================

  /**
   * Initialize syllabus from JSON data
   */
  async initializeSyllabus(syllabusData: any): Promise<void> {
    const syllabusRef = this.db.collection('syllabi').doc(this.syllabusId);

    // Count topics
    let coreTopics = 0;
    let extendedTopics = 0;

    for (const topic of syllabusData.topics || []) {
      coreTopics += topic.subtopics?.length || 0;
    }
    for (const topic of syllabusData.extendedTopics || []) {
      extendedTopics += topic.subtopics?.length || 0;
    }

    // Create syllabus document
    const metadata: SyllabusMetadata = {
      id: this.syllabusId,
      code: syllabusData.metadata.code,
      title: syllabusData.metadata.title,
      examBoard: syllabusData.metadata.examBoard,
      years: syllabusData.metadata.years,
      version: syllabusData.metadata.version,
      lastUpdated: new Date().toISOString(),
      totalUnits: (syllabusData.topics?.length || 0) + (syllabusData.extendedTopics?.length || 0),
      totalTopics: coreTopics + extendedTopics,
      coreTopics,
      extendedTopics,
      topicsGenerated: 0,
      topicsPublished: 0,
    };

    await syllabusRef.set(metadata);

    // Import Core units and topics
    for (const unit of syllabusData.topics || []) {
      await this.importUnit(unit, 'Core');
    }

    // Import Extended units and topics
    for (const unit of syllabusData.extendedTopics || []) {
      await this.importUnit(unit, 'Extended');
    }

    console.log(`✅ Imported syllabus: ${coreTopics} Core + ${extendedTopics} Extended topics`);
  }

  private async importUnit(unitData: any, level: TopicLevel): Promise<void> {
    const unitId = unitData.code.toLowerCase().replace('.', '-');
    const unitRef = this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .doc(unitId);

    const unit: Unit = {
      id: unitId,
      code: unitData.code,
      title: unitData.title,
      level,
      sequenceOrder: parseInt(unitData.code.replace(/[CE]/i, '')) || 0,
      icon: unitData.icon,
      color: unitData.color,
      topicCount: unitData.subtopics?.length || 0,
      generatedCount: 0,
      publishedCount: 0,
      estimatedDuration: (unitData.subtopics?.length || 0) * 45,
    };

    await unitRef.set(unit);

    // Import topics
    for (let i = 0; i < (unitData.subtopics || []).length; i++) {
      const subtopic = unitData.subtopics[i];
      await this.importTopic(unitId, subtopic, level, i + 1);
    }
  }

  private async importTopic(
    unitId: string,
    topicData: any,
    level: TopicLevel,
    order: number
  ): Promise<void> {
    const topicId = topicData.code.toLowerCase().replace('.', '-');
    const topicRef = this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .doc(unitId)
      .collection('topics')
      .doc(topicId);

    // Ensure no undefined values - Firestore doesn't allow them
    const topic: Topic = {
      id: topicId,
      code: topicData.code,
      title: topicData.title,
      level,
      unitId,
      sequenceOrder: order,

      syllabusContent: topicData.content || [],
      syllabusExamples: topicData.examples || [],
      syllabusNotes: topicData.notes || [],
      syllabusNotation: topicData.notation || [],

      status: 'not_started',
      assets: [],

      estimatedDuration: 45,
      difficulty: level === 'Core' ? 'core' : 'extended',
      tags: [level.toLowerCase(), unitId],
    };

    await topicRef.set(topic);
  }

  /**
   * Get syllabus overview with coverage stats
   */
  async getSyllabusOverview(): Promise<{
    metadata: SyllabusMetadata;
    units: Unit[];
    coverage: {
      total: number;
      generated: number;
      published: number;
      percentage: number;
    };
  }> {
    const syllabusRef = this.db.collection('syllabi').doc(this.syllabusId);
    const syllabusDoc = await syllabusRef.get();

    if (!syllabusDoc.exists) {
      throw new Error('Syllabus not found');
    }

    const metadata = syllabusDoc.data() as SyllabusMetadata;

    // Get units
    const unitsSnap = await syllabusRef.collection('units').orderBy('sequenceOrder').get();
    const units = unitsSnap.docs.map(doc => doc.data() as Unit);

    return {
      metadata,
      units,
      coverage: {
        total: metadata.totalTopics,
        generated: metadata.topicsGenerated,
        published: metadata.topicsPublished,
        percentage: Math.round((metadata.topicsPublished / metadata.totalTopics) * 100),
      },
    };
  }

  /**
   * Get all topics for a unit
   */
  async getUnitTopics(unitId: string): Promise<Topic[]> {
    const topicsSnap = await this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .doc(unitId)
      .collection('topics')
      .orderBy('sequenceOrder')
      .get();

    return topicsSnap.docs.map(doc => doc.data() as Topic);
  }

  /**
   * Get topics by status (for content generation pipeline)
   */
  async getTopicsByStatus(status: ContentStatus, level?: TopicLevel): Promise<Topic[]> {
    const topics: Topic[] = [];

    // Get all units
    const unitsSnap = await this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .get();

    for (const unitDoc of unitsSnap.docs) {
      let query = unitDoc.ref.collection('topics').where('status', '==', status);

      if (level) {
        query = query.where('level', '==', level);
      }

      const topicsSnap = await query.get();
      topics.push(...topicsSnap.docs.map(doc => doc.data() as Topic));
    }

    return topics;
  }

  /**
   * Get next topics to generate (prioritized)
   */
  async getNextTopicsToGenerate(count: number = 5): Promise<Topic[]> {
    const notStarted = await this.getTopicsByStatus('not_started');

    // Sort: Core first, then by sequence order
    notStarted.sort((a, b) => {
      if (a.level !== b.level) {
        return a.level === 'Core' ? -1 : 1;
      }
      return a.sequenceOrder - b.sequenceOrder;
    });

    return notStarted.slice(0, count);
  }

  // ==========================================================================
  // TOPIC & LESSON MANAGEMENT
  // ==========================================================================

  /**
   * Get a specific topic
   */
  async getTopic(topicCode: string): Promise<Topic | null> {
    // Find the topic across all units
    const unitsSnap = await this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .get();

    for (const unitDoc of unitsSnap.docs) {
      const topicId = topicCode.toLowerCase().replace('.', '-');
      const topicDoc = await unitDoc.ref.collection('topics').doc(topicId).get();

      if (topicDoc.exists) {
        return topicDoc.data() as Topic;
      }
    }

    return null;
  }

  /**
   * Save generated lesson content
   */
  async saveLessonContent(
    topicCode: string,
    lesson: LessonContent,
    generatedBy: string = 'claude-code'
  ): Promise<void> {
    const topic = await this.getTopic(topicCode);
    if (!topic) {
      throw new Error(`Topic not found: ${topicCode}`);
    }

    const topicId = topicCode.toLowerCase().replace('.', '-');
    const topicRef = this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .doc(topic.unitId)
      .collection('topics')
      .doc(topicId);

    await topicRef.update({
      lesson,
      status: 'review',
      generatedAt: new Date().toISOString(),
      generatedBy,
    });

    // Update unit stats
    await this.updateUnitStats(topic.unitId);

    // Update syllabus stats
    await this.updateSyllabusStats();
  }

  /**
   * Update topic status
   */
  async updateTopicStatus(
    topicCode: string,
    status: ContentStatus,
    additionalData?: Partial<Topic>
  ): Promise<void> {
    const topic = await this.getTopic(topicCode);
    if (!topic) {
      throw new Error(`Topic not found: ${topicCode}`);
    }

    const topicId = topicCode.toLowerCase().replace('.', '-');
    const topicRef = this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .doc(topic.unitId)
      .collection('topics')
      .doc(topicId);

    const updateData: any = { status, ...additionalData };

    if (status === 'approved') {
      updateData.reviewedAt = new Date().toISOString();
    }
    if (status === 'published') {
      updateData.publishedAt = new Date().toISOString();
    }

    await topicRef.update(updateData);
    await this.updateUnitStats(topic.unitId);
    await this.updateSyllabusStats();
  }

  /**
   * Add asset to topic
   */
  async addTopicAsset(topicCode: string, asset: Omit<TopicAsset, 'id' | 'createdAt'>): Promise<string> {
    const topic = await this.getTopic(topicCode);
    if (!topic) {
      throw new Error(`Topic not found: ${topicCode}`);
    }

    const topicId = topicCode.toLowerCase().replace('.', '-');
    const topicRef = this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .doc(topic.unitId)
      .collection('topics')
      .doc(topicId);

    const assetId = `asset-${Date.now()}`;
    const fullAsset: TopicAsset = {
      ...asset,
      id: assetId,
      createdAt: new Date().toISOString(),
    };

    await topicRef.update({
      assets: FieldValue.arrayUnion(fullAsset),
    });

    return assetId;
  }

  private async updateUnitStats(unitId: string): Promise<void> {
    const unitRef = this.db
      .collection('syllabi')
      .doc(this.syllabusId)
      .collection('units')
      .doc(unitId);

    const topicsSnap = await unitRef.collection('topics').get();

    let generatedCount = 0;
    let publishedCount = 0;

    for (const doc of topicsSnap.docs) {
      const topic = doc.data() as Topic;
      if (topic.status !== 'not_started') generatedCount++;
      if (topic.status === 'published') publishedCount++;
    }

    await unitRef.update({ generatedCount, publishedCount });
  }

  private async updateSyllabusStats(): Promise<void> {
    const syllabusRef = this.db.collection('syllabi').doc(this.syllabusId);
    const unitsSnap = await syllabusRef.collection('units').get();

    let topicsGenerated = 0;
    let topicsPublished = 0;

    for (const unitDoc of unitsSnap.docs) {
      const unit = unitDoc.data() as Unit;
      topicsGenerated += unit.generatedCount || 0;
      topicsPublished += unit.publishedCount || 0;
    }

    await syllabusRef.update({
      topicsGenerated,
      topicsPublished,
      lastUpdated: new Date().toISOString(),
    });
  }

  // ==========================================================================
  // STUDENT PROGRESS
  // ==========================================================================

  /**
   * Get or create student progress for a topic
   */
  async getStudentProgress(studentId: string, topicCode: string): Promise<StudentProgress> {
    const topicId = topicCode.toLowerCase().replace('.', '-');
    const progressRef = this.db
      .collection('students')
      .doc(studentId)
      .collection('progress')
      .doc(topicId);

    const doc = await progressRef.get();

    if (doc.exists) {
      return doc.data() as StudentProgress;
    }

    // Create new progress record
    const newProgress: StudentProgress = {
      topicId,
      status: 'not_started',
      totalTimeSpent: 0,
      theorySectionsViewed: [],
      examplesCompleted: [],
      practiceCompleted: [],
      quizAttempts: [],
      passed: false,
    };

    await progressRef.set(newProgress);
    return newProgress;
  }

  /**
   * Update student progress
   */
  async updateStudentProgress(
    studentId: string,
    topicCode: string,
    updates: Partial<StudentProgress>
  ): Promise<void> {
    const topicId = topicCode.toLowerCase().replace('.', '-');
    const progressRef = this.db
      .collection('students')
      .doc(studentId)
      .collection('progress')
      .doc(topicId);

    await progressRef.update({
      ...updates,
      lastAccessedAt: new Date().toISOString(),
    });
  }

  /**
   * Record quiz attempt
   */
  async recordQuizAttempt(
    studentId: string,
    topicCode: string,
    score: number,
    maxScore: number,
    answers: { questionId: string; correct: boolean }[]
  ): Promise<void> {
    const topicId = topicCode.toLowerCase().replace('.', '-');
    const progressRef = this.db
      .collection('students')
      .doc(studentId)
      .collection('progress')
      .doc(topicId);

    const doc = await progressRef.get();
    const progress = doc.data() as StudentProgress;

    const percentage = Math.round((score / maxScore) * 100);
    const attempt = {
      attemptNumber: (progress.quizAttempts?.length || 0) + 1,
      score,
      maxScore,
      percentage,
      completedAt: new Date().toISOString(),
      answers,
    };

    const bestScore = Math.max(progress.bestQuizScore || 0, percentage);
    const passed = bestScore >= 80;

    await progressRef.update({
      quizAttempts: FieldValue.arrayUnion(attempt),
      bestQuizScore: bestScore,
      passed,
      status: passed ? 'completed' : 'in_progress',
    });
  }

  /**
   * Get student dashboard data
   */
  async getStudentDashboard(studentId: string): Promise<{
    totalTopics: number;
    completed: number;
    inProgress: number;
    averageScore: number;
    recentActivity: StudentProgress[];
  }> {
    const progressSnap = await this.db
      .collection('students')
      .doc(studentId)
      .collection('progress')
      .orderBy('lastAccessedAt', 'desc')
      .limit(10)
      .get();

    const progressList = progressSnap.docs.map(doc => doc.data() as StudentProgress);

    const completed = progressList.filter(p => p.status === 'completed').length;
    const inProgress = progressList.filter(p => p.status === 'in_progress').length;

    const scoresWithAttempts = progressList
      .filter(p => p.bestQuizScore !== undefined)
      .map(p => p.bestQuizScore!);

    const averageScore = scoresWithAttempts.length > 0
      ? Math.round(scoresWithAttempts.reduce((a, b) => a + b, 0) / scoresWithAttempts.length)
      : 0;

    // Get total topics from syllabus
    const overview = await this.getSyllabusOverview();

    return {
      totalTopics: overview.metadata.totalTopics,
      completed,
      inProgress,
      averageScore,
      recentActivity: progressList.slice(0, 5),
    };
  }

  // ==========================================================================
  // GENERATION QUEUE (for multi-agent work)
  // ==========================================================================

  /**
   * Queue topics for generation
   */
  async queueTopicsForGeneration(topicCodes: string[], priority: number = 5): Promise<string[]> {
    const taskIds: string[] = [];

    for (const code of topicCodes) {
      const topic = await this.getTopic(code);
      if (!topic) continue;

      const taskId = `task-${code.replace('.', '-')}-${Date.now()}`;
      const task: GenerationTask = {
        id: taskId,
        topicCode: code,
        topicTitle: topic.title,
        level: topic.level,
        status: 'queued',
        priority,
        steps: {
          structure: 'pending',
          theory: 'pending',
          examples: 'pending',
          visuals: 'pending',
          narration: 'pending',
          review: 'pending',
        },
        currentStep: 'structure',
        createdAt: new Date().toISOString(),
      };

      await this.db.collection('generation-queue').doc(taskId).set(task);
      taskIds.push(taskId);
    }

    return taskIds;
  }

  /**
   * Get next task for an agent
   */
  async claimNextTask(agentId: string): Promise<GenerationTask | null> {
    const tasksSnap = await this.db
      .collection('generation-queue')
      .where('status', '==', 'queued')
      .orderBy('priority')
      .orderBy('createdAt')
      .limit(1)
      .get();

    if (tasksSnap.empty) {
      return null;
    }

    const taskDoc = tasksSnap.docs[0];
    const task = taskDoc.data() as GenerationTask;

    // Claim the task
    await taskDoc.ref.update({
      status: 'in_progress',
      assignedTo: agentId,
      assignedAt: new Date().toISOString(),
    });

    return { ...task, status: 'in_progress', assignedTo: agentId };
  }

  /**
   * Update task progress
   */
  async updateTaskProgress(
    taskId: string,
    step: keyof GenerationTask['steps'],
    status: 'pending' | 'complete'
  ): Promise<void> {
    await this.db.collection('generation-queue').doc(taskId).update({
      [`steps.${step}`]: status,
      currentStep: step,
    });
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: string, lessonId?: string): Promise<void> {
    await this.db.collection('generation-queue').doc(taskId).update({
      status: 'completed',
      completedAt: new Date().toISOString(),
      lessonId,
    });
  }

  /**
   * Fail a task
   */
  async failTask(taskId: string, error: string): Promise<void> {
    await this.db.collection('generation-queue').doc(taskId).update({
      status: 'failed',
      error,
      completedAt: new Date().toISOString(),
    });
  }

  /**
   * Get generation queue status
   */
  async getQueueStatus(): Promise<{
    queued: number;
    inProgress: number;
    completed: number;
    failed: number;
    tasks: GenerationTask[];
  }> {
    const tasksSnap = await this.db
      .collection('generation-queue')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const tasks = tasksSnap.docs.map(doc => doc.data() as GenerationTask);

    return {
      queued: tasks.filter(t => t.status === 'queued').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
      tasks,
    };
  }
}

// Export singleton instance
let serviceInstance: EducationFirestoreService | null = null;

export function getEducationService(): EducationFirestoreService {
  if (!serviceInstance) {
    serviceInstance = new EducationFirestoreService();
  }
  return serviceInstance;
}

export default EducationFirestoreService;
