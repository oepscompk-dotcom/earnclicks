'use client';

import { useState } from 'react';

interface LogoImageProps {
  src: string;
  type: string;
  alt: string;
  className?: string;
  defaultLogo?: React.ReactNode;
}

export function LogoImage({ src, type, alt, className = 'h-10 w-auto', defaultLogo }: LogoImageProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return defaultLogo || null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
    />
  );
}
