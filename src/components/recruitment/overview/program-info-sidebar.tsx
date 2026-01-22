import InputLabel from '@/components/common/label/inputLabel';
import { MarkdownEditor } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, getCurrencyIcon, getInitials, getUserDisplayName, reduceString } from '@/lib/utils';
import type { ProgramV2 } from '@/types/types.generated';
import { ProgramStatusV2 } from '@/types/types.generated';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import StatusBadge from '../statusBadge/statusBadge';

interface ProgramInfoSidebarProps {
  program: ProgramV2;
  isMobile: boolean;
  isOwner: boolean;
  isDraft: boolean;
  isDeadlinePassed: boolean;
  formattedDeadline: string | null;
  formattedPriceValue: string | null;
  status: ProgramStatusV2;
  userId: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  coverLetter: string;
  setCoverLetter: (value: string) => void;
  submitting: boolean;
  handleSubmitApplication: () => void;
  handleStatusChange: (status: ProgramStatusV2) => void;
}

export function ProgramInfoSidebar({
  program,
  isMobile,
  isOwner,
  isDraft,
  isDeadlinePassed,
  formattedDeadline,
  formattedPriceValue,
  status,
  userId,
  isDialogOpen,
  setIsDialogOpen,
  coverLetter,
  setCoverLetter,
  submitting,
  handleSubmitApplication,
  handleStatusChange,
}: ProgramInfoSidebarProps) {
  const renderOwnerActions = () => (
    <div className="flex w-full">
      <div className="flex justify-end gap-2 w-full">
        <Button
          variant="secondary"
          className={cn('h-11 flex-1', isMobile && 'h-9')}
          disabled={!isDraft && isDeadlinePassed}
          size={isMobile ? 'sm' : 'default'}
        >
          <Link
            className="flex items-center justify-center w-full h-full"
            to={`/programs/recruitment/${program.id}/edit`}
          >
            Edit
          </Link>
        </Button>
        {program.status === 'under_review' ? (
          <Button
            disabled
            className={cn('h-11 flex-1', isMobile && 'h-9')}
            size={isMobile ? 'sm' : 'default'}
          >
            Under Review
          </Button>
        ) : isDeadlinePassed || isDraft ? (
          <Button
            variant="outline"
            disabled
            className={cn('border h-11 flex-1 gap-2', isMobile && 'h-9')}
            size={isMobile ? 'sm' : 'default'}
          >
            <StatusBadge status={status} />
            <ChevronDown className="ml-auto h-4 w-4" />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn('border h-11 flex-1 gap-2', isMobile && 'h-9')}
                size={isMobile ? 'sm' : 'default'}
              >
                <StatusBadge status={status} />
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem
                onClick={() => handleStatusChange(ProgramStatusV2.Open)}
                className="cursor-pointer"
              >
                <StatusBadge status="open" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(ProgramStatusV2.Closed)}
                className="cursor-pointer"
              >
                <StatusBadge status="closed" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  const renderApplicationButton = () => (
    <TooltipProvider>
      <Tooltip>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <TooltipTrigger asChild>
            <span className="w-full">
              <DialogTrigger asChild>
                <Button
                  className="w-full"
                  size={isMobile ? 'sm' : 'default'}
                  disabled={
                    program.status !== ProgramStatusV2.Open ||
                    program.hasApplied ||
                    isDeadlinePassed ||
                    false
                  }
                >
                  {program.hasApplied ? 'Applied' : 'Submit application'}
                </Button>
              </DialogTrigger>
            </span>
          </TooltipTrigger>
          {isDeadlinePassed && (
            <TooltipContent>
              <p className="text-black">Deadline has passed</p>
            </TooltipContent>
          )}
          <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle>Add Cover Letter</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <InputLabel
                labelId="coverLetter"
                title="Highlight your skills and explain why you're a great fit for this role."
                isPrimary
                inputClassName="hidden"
              >
                <MarkdownEditor
                  onChange={(value: string) => {
                    setCoverLetter(value);
                  }}
                  content={coverLetter}
                />
              </InputLabel>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitApplication}
                disabled={submitting || !coverLetter.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit application'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Tooltip>
    </TooltipProvider>
  );

  const renderSkills = () => (
    <div className={cn('flex flex-wrap gap-2', isMobile && 'justify-end')}>
      {program.skills?.slice(0, 6).map((skill: string) => (
        <Badge key={skill} variant="secondary" className="text-xs font-semibold">
          {skill.toUpperCase()}
        </Badge>
      ))}
      {program.skills && program.skills.length > 6 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="text-xs font-semibold cursor-pointer">
              +{program.skills.length - 6} more
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[300px] p-3 z-50">
            <div className="flex flex-wrap gap-2">
              {program.skills.slice(6).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs font-semibold">
                  {skill.toUpperCase()}
                </Badge>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-2 border-b border-gray-200 pb-4 text-xs">
        <div className="flex items-center justify-between">
          <div className="text-zinc-500">Price</div>
          <div>
            {!program.price ? (
              <div className="flex items-center gap-2 [&_svg]:w-4 [&_svg]:h-4">
                {getCurrencyIcon(program.token?.tokenName || '')}
                <span>Negotiable</span>
              </div>
            ) : program.price && program.token ? (
              <div className="flex items-center gap-3">
                {formattedPriceValue}{' '}
                <div className="flex items-center gap-2">
                  {getCurrencyIcon(program.token.tokenName || '')}
                  {program.token.tokenName}
                </div>
              </div>
            ) : (
              <div className="font-bold text-lg">-</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-zinc-500">Deadline</div>
          <div>{formattedDeadline}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-zinc-500">Skills</div>
          {renderSkills()}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-zinc-500">Sponsor</div>
          <div>{getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-zinc-500">Applicants</div>
          <div>
            {program.applicationCount && program.applicationCount > 10
              ? '10+'
              : (program.applicationCount ?? 0)}
          </div>
        </div>
        <div>{isOwner ? renderOwnerActions() : userId && renderApplicationButton()}</div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-5 border-b">
          <div className="text-muted-foreground text-sm font-medium">Budget</div>
          <div>
            <div className="text-sm text-right">{program.network?.chainName}</div>
            <div className="font-bold text-xl">
              {!program.price ? (
                <div className="flex items-center gap-2">
                  {getCurrencyIcon(program.token?.tokenName || '')}
                  <span>Negotiable</span>
                </div>
              ) : program.price && program.token ? (
                <div className="flex items-center gap-3">
                  {formattedPriceValue}{' '}
                  <div className="flex items-center gap-2">
                    {getCurrencyIcon(program.token.tokenName || '')}
                    {program.token.tokenName}
                  </div>
                </div>
              ) : (
                <div className="font-bold text-lg">-</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm font-medium">Deadline</div>
          <div>
            <div className="font-bold text-xl">{formattedDeadline}</div>
          </div>
        </div>

        {isOwner ? renderOwnerActions() : userId && renderApplicationButton()}

        <div className="mt-4">
          <div className="mb-2 text-muted-foreground text-sm font-medium">Skills</div>
          <div className="flex flex-wrap gap-3 text-sm">{renderSkills()}</div>
        </div>

        <div>
          <div className="mb-2 text-muted-foreground text-sm font-medium">Sponsor</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="w-6 h-6">
              <AvatarImage src={program.sponsor?.profileImage || ''} />
              <AvatarFallback className="text-xs">
                {getInitials(getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email))}
              </AvatarFallback>
            </Avatar>
            {getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email)}
          </div>
        </div>

        <div className="text-sm font-medium">
          <span className="mr-2 text-muted-foreground">Applicants</span>{' '}
          <span className="text-primary">
            {program.applicationCount && program.applicationCount > 10
              ? '10+'
              : (program.applicationCount ?? 0)}
          </span>
        </div>

        <div>
          <div className="flex items-center mb-2 text-muted-foreground text-sm font-medium">
            Visibility
            <div className="ml-3 font-bold capitalize">
              <Badge variant="purple" className="text-xs font-semibold">
                {program.visibility}
              </Badge>
            </div>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              {program.invitedMembers &&
                program.invitedMembers.map((member: string) => (
                  <Badge key={member} variant="secondary" className="text-xs font-semibold">
                    {reduceString(member, 6, 6)}
                  </Badge>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgramInfoSidebar;
