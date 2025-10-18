/**
 * GitHub Service
 * Handles repository cloning and management
 */

import { Octokit } from '@octokit/rest';
import simpleGit, { SimpleGit } from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitHubService {
  private octokit?: Octokit;
  private git: SimpleGit;
  private tempDir: string = '/tmp/repos';

  constructor(token?: string) {
    if (token) {
      this.octokit = new Octokit({ auth: token });
    }
    this.git = simpleGit();
  }

  /**
   * Clone a repository
   */
  async cloneRepository(repoUrl: string): Promise<string> {
    // Create temp directory if it doesn't exist
    await fs.mkdir(this.tempDir, { recursive: true });

    // Generate unique directory name
    const repoName = this.extractRepoName(repoUrl);
    const timestamp = Date.now();
    const clonePath = path.join(this.tempDir, `${repoName}-${timestamp}`);

    console.log(`Cloning ${repoUrl} to ${clonePath}...`);

    try {
      // Clone with depth 1 for faster cloning
      await this.git.clone(repoUrl, clonePath, ['--depth', '1']);
      console.log(`Successfully cloned to ${clonePath}`);
      return clonePath;
    } catch (error: any) {
      console.error(`Failed to clone repository: ${error.message}`);
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  /**
   * Clone using GitHub API (for private repos)
   */
  async cloneWithAPI(owner: string, repo: string): Promise<string> {
    if (!this.octokit) {
      throw new Error('GitHub token required for API access');
    }

    // Create temp directory
    const clonePath = path.join(this.tempDir, `${repo}-${Date.now()}`);
    await fs.mkdir(clonePath, { recursive: true });

    try {
      // Download repository archive
      const { data } = await this.octokit.repos.downloadArchive({
        owner,
        repo,
        archive_format: 'zipball',
        ref: 'main'
      });

      // Save archive
      const archivePath = path.join(this.tempDir, `${repo}.zip`);
      await fs.writeFile(archivePath, Buffer.from(data as any));

      // Extract archive
      await execAsync(`unzip -q ${archivePath} -d ${clonePath}`);

      // Find extracted directory (GitHub adds a prefix)
      const entries = await fs.readdir(clonePath);
      const extractedDir = entries.find(e => e.startsWith(`${owner}-${repo}`));

      if (extractedDir) {
        const fullPath = path.join(clonePath, extractedDir);
        return fullPath;
      }

      return clonePath;
    } catch (error: any) {
      console.error(`Failed to clone via API: ${error.message}`);
      throw new Error(`Failed to clone repository via API: ${error.message}`);
    }
  }

  /**
   * Get repository info
   */
  async getRepoInfo(owner: string, repo: string): Promise<any> {
    if (!this.octokit) {
      throw new Error('GitHub token required for API access');
    }

    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo
      });

      return {
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        language: data.language,
        size: data.size,
        defaultBranch: data.default_branch,
        private: data.private,
        stars: data.stargazers_count,
        forks: data.forks_count,
        topics: data.topics,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error: any) {
      console.error(`Failed to get repo info: ${error.message}`);
      throw new Error(`Failed to get repository info: ${error.message}`);
    }
  }

  /**
   * List user repositories
   */
  async listUserRepos(username?: string): Promise<any[]> {
    if (!this.octokit) {
      throw new Error('GitHub token required for API access');
    }

    try {
      let repos;

      if (username) {
        // Get repos for specific user
        const { data } = await this.octokit.repos.listForUser({
          username,
          per_page: 100,
          sort: 'updated'
        });
        repos = data;
      } else {
        // Get authenticated user's repos
        const { data } = await this.octokit.repos.listForAuthenticatedUser({
          per_page: 100,
          sort: 'updated'
        });
        repos = data;
      }

      return repos.map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        cloneUrl: repo.clone_url,
        language: repo.language,
        private: repo.private,
        updatedAt: repo.updated_at
      }));
    } catch (error: any) {
      console.error(`Failed to list repositories: ${error.message}`);
      throw new Error(`Failed to list repositories: ${error.message}`);
    }
  }

  /**
   * Clean up cloned repositories
   */
  async cleanupRepos(olderThanMinutes: number = 60): Promise<void> {
    try {
      const entries = await fs.readdir(this.tempDir);
      const now = Date.now();
      const maxAge = olderThanMinutes * 60 * 1000;

      for (const entry of entries) {
        const fullPath = path.join(this.tempDir, entry);
        const stats = await fs.stat(fullPath);

        if (now - stats.mtimeMs > maxAge) {
          console.log(`Cleaning up old repository: ${entry}`);
          await fs.rm(fullPath, { recursive: true, force: true });
        }
      }
    } catch (error: any) {
      console.error(`Cleanup error: ${error.message}`);
    }
  }

  /**
   * Extract repository name from URL
   */
  private extractRepoName(repoUrl: string): string {
    const match = repoUrl.match(/\/([^\/]+)\.git$/);
    if (match) {
      return match[1];
    }

    const pathMatch = repoUrl.match(/\/([^\/]+)$/);
    if (pathMatch) {
      return pathMatch[1];
    }

    return 'repo';
  }

  /**
   * Parse GitHub URL to get owner and repo
   */
  parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    // Handle various GitHub URL formats
    const patterns = [
      /github\.com[\/:]([^\/]+)\/([^\/\.]+)/,
      /^([^\/]+)\/([^\/]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, '')
        };
      }
    }

    return null;
  }
}

export default GitHubService;