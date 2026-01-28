import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MobileFullScreenDialogProps {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  actionChildren?: React.ReactNode;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  contentClassName?: string;
}

export function MobileFullScreenDialog({
  open,
  onClose,
  title,
  children,
  footer,
  onAction,
  actionChildren,
  actionLabel = 'Save',
  actionDisabled = false,
  actionLoading = false,
  contentClassName,
}: MobileFullScreenDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      <header className="relative flex items-center justify-center p-4 h-17 border-b border-gray-100">
        <button type="button" onClick={onClose} className="absolute top-4 left-4">
          <X className="w-6 h-9" />
        </button>
        <span className="text-sm font-medium">{title}</span>
        {onAction && (
          <Button
            size="sm"
            variant="outline"
            className="absolute right-4 top-4"
            onClick={onAction}
            disabled={actionDisabled || actionLoading}
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : actionLabel}
          </Button>
        )}
        <div className="absolute right-4 top-4">{actionChildren}</div>
      </header>
      <div className={cn('flex-1 overflow-y-auto p-4', contentClassName)}>{children}</div>
      {footer}
    </div>,
    document.body,
  );
}
