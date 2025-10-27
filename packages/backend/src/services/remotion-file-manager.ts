/**
 * Remotion File Manager
 *
 * Manages file access for Remotion rendering by copying assets to the public directory
 * and providing relative paths that work with staticFile()
 */

import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RemotionFileManager {
  private publicDir: string;

  constructor() {
    // Public directory for Remotion assets
    this.publicDir = path.join(__dirname, '../remotion/public');
    this.ensurePublicDir();
  }

  /**
   * Ensure public directory exists
   */
  private async ensurePublicDir(): Promise<void> {
    await fs.mkdir(this.publicDir, { recursive: true });
    await fs.mkdir(path.join(this.publicDir, 'videos'), { recursive: true });
    await fs.mkdir(path.join(this.publicDir, 'images'), { recursive: true });
    await fs.mkdir(path.join(this.publicDir, 'audio'), { recursive: true });
  }

  /**
   * Copy a file to Remotion's public directory and return the relative path
   *
   * @param sourcePath - Absolute path to source file
   * @param type - Asset type (video, image, audio)
   * @returns Relative path for use with staticFile()
   */
  async copyAsset(sourcePath: string, type: 'video' | 'image' | 'audio'): Promise<string> {
    const filename = path.basename(sourcePath);
    const destPath = path.join(this.publicDir, type + 's', filename);
    const relativePath = path.join(type + 's', filename);

    try {
      await fs.copyFile(sourcePath, destPath);
      console.log(`[RemotionFileManager] Copied ${type}: ${filename}`);
      return relativePath;
    } catch (error) {
      console.error(`[RemotionFileManager] Failed to copy ${type}:`, error);
      throw new Error(`Failed to copy asset: ${sourcePath}`);
    }
  }

  /**
   * Copy visual asset (auto-detect type from extension)
   */
  async copyVisual(sourcePath: string): Promise<string> {
    const ext = path.extname(sourcePath).toLowerCase();

    if (['.mp4', '.mov', '.webm'].includes(ext)) {
      return this.copyAsset(sourcePath, 'video');
    } else if (['.png', '.jpg', '.jpeg', '.svg'].includes(ext)) {
      return this.copyAsset(sourcePath, 'image');
    } else {
      throw new Error(`Unsupported visual format: ${ext}`);
    }
  }

  /**
   * Copy audio file
   */
  async copyAudio(sourcePath: string): Promise<string> {
    return this.copyAsset(sourcePath, 'audio');
  }

  /**
   * Clear all assets from public directory (cleanup)
   */
  async clearAssets(): Promise<void> {
    try {
      await fs.rm(path.join(this.publicDir, 'videos'), { recursive: true, force: true });
      await fs.rm(path.join(this.publicDir, 'images'), { recursive: true, force: true });
      await fs.rm(path.join(this.publicDir, 'audio'), { recursive: true, force: true });
      await this.ensurePublicDir();
      console.log('[RemotionFileManager] Assets cleared');
    } catch (error) {
      console.error('[RemotionFileManager] Failed to clear assets:', error);
    }
  }
}

/**
 * Singleton instance
 */
export const remotionFileManager = new RemotionFileManager();
