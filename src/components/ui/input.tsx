import * as React from 'react';

import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { isMobile?: boolean }
>(({ className, type, ...props }, ref) => {
  const isMobile = useIsMobile();
  const textSize = isMobile ? 'text-sm' : 'text-base';

  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full bg-white rounded-md border border-input px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
        textSize,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
