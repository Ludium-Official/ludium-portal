import notify from '@/lib/notify';
import { cn } from '@/lib/utils';
import { Share2Icon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { Label } from './label';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { RadioGroup, RadioGroupItem } from './radio-group';

interface ShareButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  onShare?: (type: 'link' | 'farcaster') => void;
}

export function ShareButton({
  className,
  variant = 'ghost',
  size = 'default',
  children,
  onShare,
}: ShareButtonProps) {
  const [shareType, setShareType] = useState<'link' | 'farcaster'>('link');

  const handleShare = () => {
    onShare?.(shareType);

    window.navigator.clipboard.writeText(window.location.href);
    notify('Link copied to clipboard', 'success');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size} className={cn('flex gap-2 items-center', className)}>
          {children || 'Share'}
          <Share2Icon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-6 min-w-[400px]" align="end">
        <div className="space-y-4">
          <div className="text-center font-semibold text-lg">Share</div>

          <RadioGroup
            value={shareType}
            onValueChange={(value) => setShareType(value as 'link' | 'farcaster')}
            className="gap-4"
          >
            <div className="flex items-start gap-2">
              <RadioGroupItem value="link" id="link" />
              <Label
                htmlFor="link"
                className="flex-1 cursor-pointer flex flex-col items-start gap-1.5"
              >
                <div className="font-medium">Share with link</div>
                <p className="text-sm text-muted-foreground truncate max-w-[342px]">
                  {window.location.href}
                </p>
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="farcaster" id="farcaster" />
              <Label htmlFor="farcaster" className="flex-1 cursor-pointer">
                <div className="font-medium">Farcaster</div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex justify-center">
            <Button
              onClick={handleShare}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              Share
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
