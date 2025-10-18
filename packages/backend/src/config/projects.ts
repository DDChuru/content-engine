/**
 * Project Configuration
 * Maps project IDs to their GitHub repositories and metadata
 */

export interface ProjectConfig {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  branch?: string;
  firebaseProject: string;
}

export const PROJECTS: ProjectConfig[] = [
  {
    id: 'iclean',
    name: 'iClean',
    description: 'Food safety and hygiene management system',
    repoUrl: 'https://github.com/yourusername/iclean-app.git', // Update with actual repo
    branch: 'main',
    firebaseProject: 'iclean'
  },
  {
    id: 'haccp',
    name: 'HACCP Audits',
    description: 'HACCP audit and compliance management',
    repoUrl: 'https://github.com/yourusername/haccp-audits.git', // Update with actual repo
    branch: 'main',
    firebaseProject: 'haccp'
  },
  {
    id: 'math',
    name: 'Math Platform',
    description: 'O-Level/IGCSE Mathematics learning platform',
    repoUrl: 'https://github.com/yourusername/math-platform.git', // Update with actual repo
    branch: 'main',
    firebaseProject: 'math'
  },
  {
    id: 'peakflow',
    name: 'PeakFlow',
    description: 'Peak performance and flow state optimization',
    repoUrl: 'https://github.com/yourusername/peakflow.git', // Update with actual repo
    branch: 'main',
    firebaseProject: 'peakflow'
  }
];

/**
 * Get project configuration by ID
 */
export function getProjectConfig(projectId: string): ProjectConfig | undefined {
  return PROJECTS.find(p => p.id === projectId);
}

/**
 * Get all project configurations
 */
export function getAllProjects(): ProjectConfig[] {
  return PROJECTS;
}
