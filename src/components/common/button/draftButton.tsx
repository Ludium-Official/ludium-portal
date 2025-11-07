import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DraftButtonProps {
  loading?: boolean;
  saveFunc: () => void;
  tooltipDescription?: string;
}

const DraftButton: React.FC<DraftButtonProps> = ({
  loading,
  saveFunc,
  tooltipDescription = 'Image file will not be saved in the draft.',
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="lg"
          disabled={loading}
          aria-label="Save draft"
          onClick={saveFunc}
        >
          Save
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="bg-white text-foreground border shadow-[0px_4px_6px_-1px_#0000001A]"
        sideOffset={8}
      >
        {tooltipDescription}
      </TooltipContent>
    </Tooltip>
  );
};

export default DraftButton;
