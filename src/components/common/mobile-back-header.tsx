import { useIsMobile } from '@/lib/hooks/use-mobile';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

interface MobileBackHeaderProps {
  title: string;
  backLink: string;
}

export function MobileBackHeader({ title, backLink }: MobileBackHeaderProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <header className="relative flex items-center justify-center w-full bg-white px-4 py-4 h-17 border-b border-gray-100">
      <Link to={backLink} className="absolute top-4 left-4">
        <ChevronLeft className="w-6 h-9" />
      </Link>
      <span className="text-sm font-medium">{title}</span>
    </header>
  );
}

export default MobileBackHeader;
