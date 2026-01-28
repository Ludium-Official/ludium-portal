import { useCreateApplicationV2Mutation } from '@/apollo/mutation/create-application-v2.generated';
import LudiumBadgeLogo from '@/assets/icons/profile/ludium-badge.svg';
import { useUpdateProgramV2Mutation } from '@/apollo/mutation/update-program-v2.generated';
import { useMyPortfoliosV2Query } from '@/apollo/queries/my-portfolios-v2.generated';
import { useGetProgramV2Query } from '@/apollo/queries/program-v2.generated';
import { GetProgramsV2Document } from '@/apollo/queries/programs-v2.generated';
import InputLabel from '@/components/common/label/inputLabel';
import { MarkdownPreviewer } from '@/components/markdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MobileFullScreenDialog } from '@/components/ui/mobile-full-screen-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ShareButton } from '@/components/ui/share-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/hooks/use-auth';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import notify from '@/lib/notify';
import {
  cn,
  formatDate,
  formatPrice,
  getCurrencyIcon,
  getInitials,
  getUserDisplayName,
} from '@/lib/utils';
import { ProgramStatusV2, ProgramVisibilityV2 } from '@/types/types.generated';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import StatusBadge from '../statusBadge/statusBadge';
import { Textarea } from '@/components/ui/textarea';

interface ProgramDetailPanelProps {
  id?: string;
  className?: string;
}

const ProgramDetailPanel: React.FC<ProgramDetailPanelProps> = ({ id: propId, className }) => {
  const { id: paramId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const id = propId || paramId;

  const { data, loading, error, refetch } = useGetProgramV2Query({
    variables: {
      id: id || '',
    },
    skip: !id,
  });

  const [createApplication, { loading: submitting }] = useCreateApplicationV2Mutation();
  const [updateProgram] = useUpdateProgramV2Mutation();

  const program = data?.programV2;
  const [status, setStatus] = useState<ProgramStatusV2>(program?.status || ProgramStatusV2.Open);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState<number[]>([]);
  const [expandedPortfolioId, setExpandedPortfolioId] = useState<string | null>(null);

  const { data: portfoliosData } = useMyPortfoliosV2Query({
    skip: !userId,
  });
  const portfolios = portfoliosData?.myPortfoliosV2 ?? [];

  useEffect(() => {
    if (program?.status) {
      setStatus(program.status);
    }
  }, [program?.status]);

  const isOwner = program?.sponsor?.id === userId;
  const isDraft = program?.status === ProgramStatusV2.Draft;
  const formattedCreatedAt = program?.createdAt && formatDate(program.createdAt);
  const formattedDeadline = program?.deadline && formatDate(program.deadline, true);
  const formattedPriceValue = program?.price && formatPrice(program.price);
  const isDeadlinePassed = program?.deadline && new Date(program.deadline).getTime() < Date.now();

  const handleSubmitApplication = async () => {
    if (!id || !coverLetter.trim()) {
      notify('Please provide a cover letter', 'error');
      return;
    }

    try {
      const result = await createApplication({
        variables: {
          input: {
            programId: id,
            content: coverLetter,
            portfolioIds: selectedPortfolioIds.length > 0 ? selectedPortfolioIds : undefined,
          },
        },
        refetchQueries: [
          {
            query: GetProgramsV2Document,
            variables: {
              id: id || '',
            },
          },
        ],
      });

      if (result.data?.createApplicationV2) {
        notify('Application submitted successfully!', 'success');
        setCoverLetter('');
        setSelectedPortfolioIds([]);
        setExpandedPortfolioId(null);
        navigate('/dashboard/recruitment/builder');
        return;
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      notify('Failed to submit application. Please try again.', 'error');
    }
  };

  const handleStatusChange = async (newStatus: ProgramStatusV2) => {
    if (!id) {
      toast.error('Missing program ID');
      return;
    }

    try {
      await updateProgram({
        variables: {
          id: id,
          input: {
            status:
              newStatus === ProgramStatusV2.Closed ? ProgramStatusV2.Closed : ProgramStatusV2.Open,
          },
        },
      });

      await refetch();
      toast.success(`Program ${newStatus.toLowerCase()} successfully`);
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to close program:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to close program');
    }
  };

  const renderOwnerActions = () => (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        className={cn('max-w-[174px] h-11 flex-1', isMobile && 'max-w-[157px]')}
        disabled={!isDraft && !!isDeadlinePassed}
        size={isMobile ? 'sm' : 'default'}
      >
        <Link
          className="flex items-center justify-center w-full h-full"
          to={`/programs/recruitment/${program?.id}/edit`}
        >
          Edit
        </Link>
      </Button>
      {program?.status === 'under_review' ? (
        <Button
          disabled
          className={cn('max-w-[174px] h-11 flex-1', isMobile && 'max-w-[157px]')}
          size={isMobile ? 'sm' : 'default'}
        >
          Under Review
        </Button>
      ) : isDeadlinePassed || isDraft ? (
        <Button
          variant="outline"
          disabled
          className={cn('border max-w-[174px] h-11 flex-1 gap-2', isMobile && 'max-w-[157px]')}
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
              className={cn('border max-w-[174px] h-11 flex-1 gap-2', isMobile && 'max-w-[157px]')}
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
  );

  const handlePortfolioToggle = (portfolioId: number) => {
    setSelectedPortfolioIds((prev) => {
      if (prev.includes(portfolioId)) {
        return prev.filter((id) => id !== portfolioId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, portfolioId];
    });
  };

  const renderApplicationButton = () => {
    const formContent = (
      <div className="space-y-6">
        <InputLabel
          labelId="coverLetter"
          title="Highlight your skills and explain why you're a great fit for this role."
          isPrimary
          inputClassName="hidden"
        >
          <Textarea
            id="coverLetter"
            placeholder="Enter your cover letter"
            className={cn('resize-none', isMobile ? 'min-h-[300px] text-sm' : 'min-h-[400px]')}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </InputLabel>

        {portfolios.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-1">Portfolio</p>
            <p className="text-sm text-muted-foreground mb-3">
              Select up to four portfolio items you want to include with this application.
            </p>
            <div className="space-y-2 overflow-y-hidden">
              {portfolios.map((portfolio) => {
                const portfolioId = Number(portfolio.id);
                const isSelected = selectedPortfolioIds.includes(portfolioId);
                const isExpanded = expandedPortfolioId === portfolio.id;

                return (
                  <div key={portfolio.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={isSelected}
                          onCheckedChange={() => handlePortfolioToggle(portfolioId)}
                          disabled={!isSelected && selectedPortfolioIds.length >= 4}
                        />
                        <span className="font-medium">{portfolio.title}</span>
                        {portfolio.isLudiumProject && (
                          <img src={LudiumBadgeLogo} alt="Ludium Badge" className="h-5" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPortfolioId(isExpanded ? null : (portfolio.id ?? null))
                        }
                        className="p-1"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t pt-3">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {portfolio.role}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {portfolio.description}
                        </p>
                        {portfolio.images && portfolio.images.length > 0 && (
                          <Carousel className="w-full">
                            <CarouselContent>
                              {portfolio.images.map((image, index) => (
                                <CarouselItem key={index}>
                                  <img
                                    src={image}
                                    alt={`${portfolio.title ?? ''} ${index + 1}`}
                                    className="w-full object-cover rounded-md"
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            {portfolio.images.length > 1 && (
                              <>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                              </>
                            )}
                          </Carousel>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <TooltipProvider>
        <Tooltip>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <TooltipTrigger asChild>
              <span className="w-full">
                <DialogTrigger asChild>
                  <Button
                    className={cn('max-w-[174px] w-full', isMobile && 'max-w-[157px]')}
                    disabled={
                      program?.status !== ProgramStatusV2.Open ||
                      program?.hasApplied ||
                      !!isDeadlinePassed
                    }
                    size={isMobile ? 'sm' : 'default'}
                  >
                    {program?.hasApplied ? 'Applied' : 'Apply'}
                  </Button>
                </DialogTrigger>
              </span>
            </TooltipTrigger>
            {isDeadlinePassed && (
              <TooltipContent>
                <p className="text-black">Deadline has passed</p>
              </TooltipContent>
            )}
            {isMobile ? (
              <MobileFullScreenDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Add Cover Letter"
                onAction={handleSubmitApplication}
                actionLabel="Submit"
                actionDisabled={!coverLetter.trim()}
                actionLoading={submitting}
              >
                {formContent}
              </MobileFullScreenDialog>
            ) : (
              <DialogContent className="max-w-3xl! max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex-row items-center justify-between space-y-0">
                  <DialogTitle>Add Cover Letter</DialogTitle>
                </DialogHeader>
                <div className="mt-4">{formContent}</div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitApplication}
                    disabled={submitting || !coverLetter.trim()}
                  >
                    {submitting ? 'Submitting...' : 'Submit application'}
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-500">Loading program...</div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-500">
          {error ? 'Error loading program' : 'Program not found'}
        </div>
      </div>
    );
  }

  if (
    program.visibility === ProgramVisibilityV2.Private &&
    !isOwner &&
    !program.invitedMembers?.includes(userId)
  ) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-lg text-gray-700 font-semibold mb-2">Private Program</div>
          <div className="text-sm text-gray-500">
            This program is private. Please log in to view the details.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white', className)}>
      <div className="flex items-center justify-between mb-3">
        <StatusBadge className="text-sm" status={program.status || 'open'} />
        <ShareButton
          linkToCopy={`${window.location.origin}/programs/recruitment/${program.id}`}
          size={isMobile ? 'sm' : 'default'}
        />
      </div>

      <h1 className="text-2xl font-bold mb-3">{program.title}</h1>

      <div
        className={cn(
          'flex items-center mb-5 text-muted-foreground',
          isMobile && 'flex-col items-start gap-[6px]',
        )}
      >
        <div className="flex items-center">
          <Avatar className="w-7 h-7 mr-2">
            <AvatarImage src={program.sponsor?.profileImage || ''} />
            <AvatarFallback className="text-xs">
              {getInitials(getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email))}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm mr-5">
            {getUserDisplayName(program.sponsor?.nickname, program.sponsor?.email)}
          </span>
        </div>
        <div className="text-sm">
          <span className="mr-5">
            Posted <span className="font-bold">{formattedCreatedAt}</span>
          </span>
          <span>
            Applicants{' '}
            <span className="font-bold">
              {program.applicationCount && program.applicationCount > 10
                ? '10+'
                : (program.applicationCount ?? 0)}
            </span>
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-5 mb-5">
        {isOwner ? renderOwnerActions() : userId && renderApplicationButton()}
      </div>

      <div className="flex gap-2 mb-5 text-muted-foreground">
        <div className="flex flex-col gap-[2px] bg-gray-50 rounded-md p-[10px]">
          <div className="text-xs">Price</div>
          <div className="flex flex-col items-end w-40 gap-[2px]">
            <div className="text-xs font-bold uppercase">{program.network?.chainName}</div>
            <div className="font-bold flex items-center gap-2">
              {!program.price ? (
                <>
                  {getCurrencyIcon(program.token?.tokenName || '')}
                  <span>Negotiable</span>
                </>
              ) : program.price && program.token ? (
                <div className="flex items-center gap-1 [&_svg]:size-4 text-foreground">
                  {getCurrencyIcon(program.token.tokenName || '')}
                  {formattedPriceValue} {program.token.tokenName}
                </div>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between bg-gray-50 rounded-md p-[10px]">
          <div className="text-xs">Deadline</div>
          <div className={cn('font-bold text-lg text-foreground', isMobile && 'text-base')}>
            {formattedDeadline}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-5 border-b border-gray-200 pb-5">
        <span className="text-sm text-muted-foreground">Skills</span>
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            {program?.skills?.slice(0, 6).map((skill: string) => (
              <Badge key={skill} variant="secondary" className="text-xs font-semibold">
                {skill.toUpperCase()}
              </Badge>
            ))}
            {program?.skills && program.skills.length > 6 && (
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
        </TooltipProvider>
      </div>

      {program.description && (
        <div className="mt-6">
          <MarkdownPreviewer value={program.description} />
        </div>
      )}
    </div>
  );
};

export default ProgramDetailPanel;
