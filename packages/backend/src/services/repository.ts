/**
 * Repository Service
 * Handles cloning and caching GitHub repositories
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export interface CloneOptions {
  depth?: number;
  branch?: string;
  force?: boolean;
}

export interface RepositoryInfo {
  path: string;
  url: string;
  lastUpdated: Date;
  size?: number;
}

// Cache of cloned repositories
const repositoryCache = new Map<string, RepositoryInfo>();

/**
 * Get the base directory for cloned repositories
 */
function getRepoBaseDir(): string {
  return path.join(os.tmpdir(), 'content-engine-repos');
}

/**
 * Get the local path for a repository based on its URL
 */
function getRepoLocalPath(repoUrl: string): string {
  // Extract repo name from URL (e.g., "iclean-app" from "https://github.com/user/iclean-app.git")
  const repoName = repoUrl
    .split('/')
    .pop()
    ?.replace('.git', '') || 'repo';

  return path.join(getRepoBaseDir(), repoName);
}

/**
 * Ensure the repository base directory exists
 */
async function ensureRepoBaseDir(): Promise<void> {
  const baseDir = getRepoBaseDir();
  if (!existsSync(baseDir)) {
    await mkdir(baseDir, { recursive: true });
  }
}

/**
 * Clone or update a repository
 * Uses shallow clone (--depth 1) for efficiency
 * Also supports local file paths
 */
export async function cloneRepository(
  repoUrl: string,
  options: CloneOptions = {}
): Promise<string> {
  const {
    depth = 1,
    branch = 'main',
    force = false
  } = options;

  // Check if this is a local path (not a URL)
  if (repoUrl.startsWith('/') || repoUrl.startsWith('~')) {
    const expandedPath = repoUrl.replace(/^~/, process.env.HOME || '');

    if (existsSync(expandedPath)) {
      console.log(`Using local repository: ${expandedPath}`);

      // Cache local path
      repositoryCache.set(repoUrl, {
        path: expandedPath,
        url: repoUrl,
        lastUpdated: new Date()
      });

      return expandedPath;
    } else {
      throw new Error(`Local repository path does not exist: ${expandedPath}`);
    }
  }

  await ensureRepoBaseDir();

  const localPath = getRepoLocalPath(repoUrl);
  const cacheKey = repoUrl;

  // Check if already cloned
  if (!force && existsSync(localPath)) {
    console.log(`Repository already cloned: ${localPath}`);

    // Try to pull latest changes
    try {
      await execAsync('git pull', { cwd: localPath });
      console.log(`Updated repository: ${localPath}`);
    } catch (error) {
      console.warn(`Failed to update repository, using cached version:`, error);
    }

    // Update cache
    repositoryCache.set(cacheKey, {
      path: localPath,
      url: repoUrl,
      lastUpdated: new Date()
    });

    return localPath;
  }

  // Clone repository with shallow clone for efficiency
  console.log(`Cloning repository: ${repoUrl} (depth: ${depth})...`);

  try {
    const cloneCommand = `git clone --depth ${depth} --branch ${branch} ${repoUrl} ${localPath}`;
    await execAsync(cloneCommand);

    console.log(`✓ Repository cloned: ${localPath}`);

    // Cache repository info
    repositoryCache.set(cacheKey, {
      path: localPath,
      url: repoUrl,
      lastUpdated: new Date()
    });

    return localPath;
  } catch (error: any) {
    console.error(`Failed to clone repository:`, error);
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
}

/**
 * Get cached repository path if available
 */
export function getCachedRepoPath(repoUrl: string): string | undefined {
  const cached = repositoryCache.get(repoUrl);
  if (cached && existsSync(cached.path)) {
    return cached.path;
  }
  return undefined;
}

/**
 * Clear repository cache and optionally delete cloned files
 */
export async function clearRepositoryCache(deleteFiles: boolean = false): Promise<void> {
  if (deleteFiles) {
    const baseDir = getRepoBaseDir();
    try {
      await execAsync(`rm -rf ${baseDir}`);
      console.log('Repository cache cleared');
    } catch (error) {
      console.error('Failed to clear repository cache:', error);
    }
  }
  repositoryCache.clear();
}

/**
 * Get all cached repositories
 */
export function getCachedRepositories(): RepositoryInfo[] {
  return Array.from(repositoryCache.values());
}

export default {
  cloneRepository,
  getCachedRepoPath,
  clearRepositoryCache,
  getCachedRepositories
};
