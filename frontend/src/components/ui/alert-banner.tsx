'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  'flex items-center gap-2 rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        success: 'bg-green-50 text-green-800 border-green-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        destructive: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertBannerProps extends VariantProps<typeof alertVariants> {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function AlertBanner({ variant, title, children, className }: AlertBannerProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)}>
      <div className="flex-1">
        {title && <h4 className="font-medium">{title}</h4>}
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
}

export { AlertBanner, alertVariants };
