'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function Avatar({ className, src, alt, fallback, size = 'md', ...props }: AvatarProps) {
  const initials = fallback || (alt ? alt.charAt(0).toUpperCase() : '?');

  return (
    <div className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizeClasses[size], className)} {...props}>
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium">
          {initials}
        </div>
      )}
    </div>
  );
}

export { Avatar };
