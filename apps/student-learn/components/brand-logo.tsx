import Image from 'next/image';
import styles from './brand-logo.module.css';

const variants = {
  horizontal: { file: 'lockup-horizontal', width: 220, artworkWidth: 660, artworkHeight: 128 },
  stacked: { file: 'lockup-stacked', width: 180, artworkWidth: 560, artworkHeight: 264 },
  wordmark: { file: 'wordmark', width: 168, artworkWidth: 560, artworkHeight: 118 },
} as const;

interface BrandLogoProps {
  variant?: keyof typeof variants;
  theme?: 'auto' | 'light' | 'dark';
  className?: string;
}

/** Auto follows the nearest data-theme, otherwise the OS. Use light on study paper.
 * The SVGs include their clear space. Defaults exceed the approved minimum widths.
 */
export function BrandLogo({
  variant = 'wordmark',
  theme = 'auto',
  className = '',
}: BrandLogoProps) {
  const asset = variants[variant];
  return (
    <span
      className={`${styles.logo} ${className}`}
      style={{ width: asset.width }}
      data-logo-theme={theme}
      role="img"
      aria-label="Stem 4 Life"
    >
      {(['light', 'dark'] as const).map((color) => (
        <Image
          key={color}
          className={styles[color]}
          src={`/brand/${asset.file}-${color}.svg`}
          alt=""
          aria-hidden="true"
          width={asset.artworkWidth}
          height={asset.artworkHeight}
          unoptimized
        />
      ))}
    </span>
  );
}
