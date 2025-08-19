import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { useProgramQuery } from '@/apollo/queries/program.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import { MarkdownPreviewer } from '@/components/markdown';
import { ProgramStatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs } from '@/components/ui/tabs';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn, getCurrencyIcon, getInitials, getUserName } from '@/lib/utils';
import { TierBadge, type TierType } from '@/pages/investments/_components/tier-badge';
import ProjectCard from '@/pages/investments/details/_components/project-card';
import { format } from 'date-fns';
import { ChevronDown, Settings, Share2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

const InvestmentDetailsPage: React.FC = () => {
  const { userId, isAdmin } = useAuth();
  const { id } = useParams();

  const [isSupportersModalOpen, setIsSupportersModalOpen] = useState(false);
  const [supportersTab, setSupportersTab] = useState<'invite' | 'supporters'>('invite');

  const [selectedSupporter, setSelectedSupporter] = useState<string[]>([]);
  const [selectedSupporterItems, setSelectedSupporterItems] = useState<{ label: string; value: string }[]>([]);
  const [supporterInput, setSupporterInput] = useState<string>();
  const [debouncedSupporterInput, setDebouncedSupporterInput] = useState<string>();
  const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);
  const [storedSupporters, setStoredSupporters] = useState<Array<{
    id: string;
    name: string;
    email: string;
    tier: string;
  }>>([]);

  const { data, refetch } = useProgramQuery({
    variables: {
      id: id ?? '',
    },
  });

  const [inviteUserToProgram] = useInviteUserToProgramMutation();

  // Debounce supporter input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupporterInput(supporterInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [supporterInput]);

  // Query for supporters/users
  const { data: supportersData, loading: supportersLoading } = useUsersQuery({
    variables: {
      input: {
        limit: 5,
        offset: 0,
        filter: [
          {
            field: 'search',
            value: debouncedSupporterInput ?? '',
          },
        ],
      },
    },
    skip: !supporterInput,
  });

  const supporterOptions = supportersData?.users?.data?.map((v) => ({
    value: v.id ?? '',
    label: `${v.email} ${v.organizationName ? `(${v.organizationName})` : ''}`,
  }));

  const program = data?.program;

  // Set initial tier when tierSettings are available
  useEffect(() => {
    if (program?.tierSettings && !selectedTier) {
      const enabledTiers = Object.entries(program.tierSettings).filter(([_, value]) =>
        (value as { enabled: boolean })?.enabled
      );
      if (enabledTiers.length > 0) {
        setSelectedTier(enabledTiers[0][0]);
      }
    }
  }, [program?.tierSettings, selectedTier]);

  const handleInviteSupporter = () => {
    if (!selectedSupporter.length) {
      console.error('Please select a supporter');
      return;
    }

    const supporterId = selectedSupporter[0];
    const supporterItem = selectedSupporterItems[0];

    // Check if supporter is already in the list
    const isAlreadyAdded = storedSupporters.some(supporter => supporter.id === supporterId);
    if (isAlreadyAdded) {
      console.error('Supporter is already in the list');
      return;
    }

    // Add supporter to stored list
    const newSupporter = {
      id: supporterId,
      name: supporterItem?.label || 'Unknown User',
      email: supporterItem?.label.split(' ')[0] || 'unknown@email.com', // Extract email from label
      tier: selectedTier || 'gold',
    };

    setStoredSupporters(prev => [...prev, newSupporter]);

    // Reset selection
    setSelectedSupporter([]);
    setSelectedSupporterItems([]);
    setSupporterInput('');
  };

  const removeSupporter = (supporterId: string) => {
    setStoredSupporters(prev => prev.filter(supporter => supporter.id !== supporterId));
  };

  const handleSendInvitation = async () => {
    try {
      if (!storedSupporters.length || !id) {
        console.error('Please add at least one supporter');
        return;
      }

      // Send invitations to all stored supporters
      for (const supporter of storedSupporters) {
        await inviteUserToProgram({
          variables: {
            programId: id,
            userId: supporter.id,
          },
          onError: (error) => {
            console.error(`Failed to invite ${supporter.name}:`, error.message);
          }
        });
      }

      console.log('All invitations sent successfully');
      setStoredSupporters([]);
      refetch();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  // const acceptedPrice = useMemo(
  //   () =>
  //     program?.applications
  //       ?.filter(
  //         (a) =>
  //           a.status === ApplicationStatus.Accepted || a.status === ApplicationStatus.Completed,
  //       )
  //       .reduce(
  //         (mlPrev, mlCurr) => {
  //           const mlPrice = mlCurr?.milestones?.reduce(
  //             (prev, curr) => prev.plus(BigNumber(curr?.price ?? 0)),
  //             BigNumber(0, 10),
  //           );
  //           return mlPrev.plus(BigNumber(mlPrice ?? 0));
  //         },
  //         BigNumber(0, 10),
  //       )
  //       .toFixed() || '0',
  //   [program],
  // );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="bg-[#F7F7F7]">
      <div className="bg-white p-10 rounded-2xl">

        <section className="max-w-[1440px] mx-auto">
          <ProgramStatusBadge program={program} className='inline-flex mb-2' />

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">{program?.name}</h1>
            <div className="flex justify-between items-center mb-2 gap-2">
              {(program?.creator?.id === userId || isAdmin) && (
                <Dialog open={isSupportersModalOpen} onOpenChange={setIsSupportersModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex gap-2 items-center bg-primary hover:bg-primary/90 text-white">
                      {/* <Users className="w-4 h-4" /> */}
                      Manage Supporters
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <DialogTitle className="text-2xl font-semibold">Invite Supporter</DialogTitle>

                    {/* Tabs */}
                    <div className="flex border-b mb-6">
                      <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium border-b transition-colors ${supportersTab === 'invite'
                          ? 'border-primary text-primary'
                          : 'border- text-muted-foreground hover:text-foreground'
                          }`}
                        onClick={() => setSupportersTab('invite')}
                      >
                        Invite supporter
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${supportersTab === 'supporters'
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        onClick={() => setSupportersTab('supporters')}
                      >
                        Supporters
                      </button>
                    </div>

                    {/* Invite Tab */}
                    {supportersTab === 'invite' && (
                      <div className="space-y-6">
                        {/* Supporter Tier Management */}
                        <div>
                          <h3 className="text-sm font-medium mb-3">Supporter Tier Management</h3>
                          <div className="space-y-3 bg-secondary rounded-md p-3">
                            <div className={cn("flex items-center justify-between", !!program?.tierSettings && "border-b pb-3")}>
                              <span className="text-sm text-muted-foreground font-bold">Program Tier Condition</span>
                              {program?.tierSettings ? (
                                <div className="flex gap-2">
                                  {Object.entries(program.tierSettings).map(([key, value]) => {
                                    if (!(value as { enabled: boolean })?.enabled) return null;
                                    return (
                                      <TierBadge key={key} tier={key as TierType} />
                                    );
                                  })}
                                </div>
                              ) : (
                                <Badge className="font-semibold text-gray-600 bg-gray-200">
                                  Open
                                </Badge>
                              )}
                            </div>
                            <div className="space-y-2">
                              {program?.tierSettings && Object.entries(program.tierSettings).map(([key, value]) => {
                                if (!(value as { enabled: boolean })?.enabled) return null;

                                return (
                                  <div key={key} className="flex items-center justify-end gap-2 text-muted-foreground">
                                    <span className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                    <span className="text-sm font-bold">
                                      {(value as { maxAmount?: number })?.maxAmount?.toLocaleString() || 'N/A'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Invite Supporter Input */}
                        <div className=''>
                          <div className="flex items-center gap-2 mt-2">
                            <MultiSelect
                              options={supporterOptions ?? []}
                              value={selectedSupporter}
                              onValueChange={setSelectedSupporter}
                              placeholder="Select supporter"
                              animation={2}
                              maxCount={1}
                              inputValue={supporterInput}
                              setInputValue={setSupporterInput}
                              selectedItems={selectedSupporterItems}
                              setSelectedItems={setSelectedSupporterItems}
                              emptyText="Enter supporter email or organization name"
                              loading={supportersLoading}
                              singleSelect={true}
                              className="flex-1"
                            />
                            {program?.tierSettings ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="h-10 px-3 justify-between min-w-[120px]"
                                  >
                                    {selectedTier ? (
                                      <TierBadge tier={selectedTier as TierType} />
                                    ) : (
                                      <span className="text-sm text-muted-foreground">Select tier</span>
                                    )}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[120px] p-1" align="end">
                                  <div className="space-y-1">
                                    {Object.entries(program.tierSettings).map(([key, value]) => {
                                      if (!(value as { enabled: boolean })?.enabled) return null;

                                      return (
                                        <Button
                                          key={key}
                                          variant="ghost"
                                          className="w-full justify-start h-8 px-2"
                                          onClick={() => setSelectedTier(key)}
                                        >
                                          <TierBadge tier={key as TierType} />
                                        </Button>
                                      );
                                    })}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <div className="h-10 px-3 flex items-center text-sm text-muted-foreground">
                                Open
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleInviteSupporter}
                              disabled={!selectedSupporter.length}
                            >
                              OK
                            </Button>
                          </div>
                        </div>

                        <div className='min-h-[200px]'>

                          {/* Stored Supporters List */}
                          {storedSupporters.length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-sm font-semibold mb-3">Added Supporters</h3>
                              <div className="">
                                <div className="grid grid-cols-3 gap-4 p-3 border-b text-sm font-medium">
                                  <div className='text-muted-foreground'>Tier</div>
                                  <div className='text-muted-foreground'>User name</div>
                                  <div />
                                </div>
                                <div className='max-h-[200px] overflow-y-auto'>

                                  {storedSupporters.map((supporter) => (
                                    <div key={supporter.id} className="grid grid-cols-3 gap-4 p-3 border-b last:border-b-0 items-center hover:bg-muted">
                                      <div>
                                        <TierBadge tier={supporter.tier as TierType} />
                                      </div>
                                      <div className="text-sm">{supporter.name}</div>
                                      <div className="flex justify-end">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => removeSupporter(supporter.id)}
                                          className="h-6 w-6 p-0"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Summary Section */}
                        {storedSupporters.length > 0 && (
                          <div className="mt-6 flex justify-between items-center bg-muted p-4">
                            <div className="text-sm flex items-center gap-8">
                              <span className="">Total</span> <span className='font-bold text-lg'>{storedSupporters.length}</span>
                            </div>
                            <div className="text-sm font-medium flex items-center gap-2">
                              <span className='font-bold text-lg'>{storedSupporters.reduce((total, supporter) => {
                                const tierSettings = program?.tierSettings;
                                if (!tierSettings) return total;

                                const tierValue = (tierSettings as Record<string, { maxAmount?: number }>)[supporter.tier];
                                const amount = Number(tierValue?.maxAmount) || 0;
                                return total + amount;
                              }, 0).toLocaleString()}</span>
                              <span>{getCurrencyIcon(program?.currency)}</span>
                              <span>{program?.currency}</span>
                            </div>
                          </div>
                        )}

                        {/* Send Invitation Button */}
                        <div className="flex justify-end mt-6">
                          <Button
                            onClick={handleSendInvitation}
                            disabled={!storedSupporters.length}
                            className="bg-foreground text-white"
                          >
                            Send Invitation
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* <div className="mt-6">
                      <h3 className="text-sm font-semibold mb-3">Added Supporters</h3>
                      <div className="">
                        <div className="grid grid-cols-3 gap-4 p-3 border-b text-sm font-medium">
                          <div className='text-muted-foreground'>Tier</div>
                          <div className='text-muted-foreground'>User name</div>
                          <div />
                        </div>
                        <div className='max-h-[200px] overflow-y-auto'>

                          {storedSupporters.map((supporter) => (
                            <div key={supporter.id} className="grid grid-cols-3 gap-4 p-3 border-b last:border-b-0 items-center hover:bg-muted">
                              <div>
                                <TierBadge tier={supporter.tier as TierType} />
                              </div>
                              <div className="text-sm">{supporter.name}</div>
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeSupporter(supporter.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div> */}
                    {/* Supporters Tab */}
                    {supportersTab === 'supporters' && (
                      <div className="space-y-4">
                        {/* <h3 className="text-sm font-semibold">Current Supporters</h3> */}
                        <div className="grid grid-cols-3 gap-4 p-3 border-b text-sm font-medium">
                          <div className='text-muted-foreground'>Tier</div>
                          <div className='text-muted-foreground'>User name</div>
                          <div />
                        </div>
                        {program?.invitedBuilders && program.invitedBuilders.length > 0 ? (
                          <div className="space-y-3">
                            {program.invitedBuilders.map((supporter) => (
                              <div key={supporter.id} className="grid grid-cols-3 gap-4 p-3 border-b last:border-b-0 items-center hover:bg-muted">
                                <div>
                                  <TierBadge tier={'gold' as TierType} />
                                </div>
                                <div className="text-sm">{supporter.firstName} {supporter.lastName}</div>
                                <div className="flex justify-end">
                                  {/* <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeSupporter(supporter.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button> */}
                                </div>
                              </div>


                              // <div
                              //   key={supporter.email || index}
                              //   className="flex items-center justify-between p-3 border rounded-lg"
                              // >
                              //   <div className="flex items-center gap-3">
                              //     <div className="w-8 h-8 bg-gray-200 rounded-full" />
                              //     <div>
                              //       <p className="text-sm font-medium">
                              //         {supporter.firstName} {supporter.lastName}
                              //       </p>
                              //       <p className="text-xs text-muted-foreground">{supporter.email}</p>
                              //     </div>
                              //   </div>
                              //   <Badge variant="secondary">Invited</Badge>
                              // </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No supporters invited yet
                          </p>
                        )}

                        <div className="mt-6 flex justify-between items-center bg-muted p-4">
                          <div className="text-sm flex items-center gap-8">
                            <span className="">Total</span> <span className='font-bold text-lg'>{program?.invitedBuilders?.length}</span>
                          </div>
                          <div className="text-sm font-medium flex items-center gap-2">
                            <span className='font-bold text-lg'>{program?.invitedBuilders?.reduce((total) => {
                              const tierSettings = program?.tierSettings;
                              if (!tierSettings) return total;

                              // hardcoded, dont forget to change
                              const tierValue = (tierSettings as Record<string, { maxAmount?: number }>).gold;
                              const amount = Number(tierValue?.maxAmount) || 0;
                              return total + amount;
                            }, 0).toLocaleString()}</span>
                            <span>{getCurrencyIcon(program?.currency)}</span>
                            <span>{program?.currency}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}


              {(program?.creator?.id === userId || isAdmin) && (
                <Link to={`/programs/${program?.id}/edit`}>
                  <Button variant="ghost" className="flex gap-2 items-center">
                    Edit <Settings className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              <Button variant="ghost" className="flex gap-2 items-center">
                Share <Share2 />
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Overview */}
            <div className="w-full max-w-[360px]">
              <h3 className="flex items-end mb-3">
                <span className="p-2 border-b border-b-primary font-medium text-sm">Overview</span>
                <span className="block border-b w-full" />
              </h3>

              {/* Temporary image placeholder until the actual image is added */}
              {/* <div className='bg-[#eaeaea] w-full rounded-xl aspect-square mb-6' /> */}
              {program?.image ? (
                <img src={program?.image} alt="program" className="w-full aspect-square rounded-xl" />
              ) : (
                <div className="bg-[#eaeaea] w-full rounded-xl aspect-square mb-6" />
              )}

              {/* <div className="flex justify-end text-sm font-bold text-muted-foreground">
              {getCurrency(program?.network)?.display}
            </div>
            <div className="flex justify-between items-center font-bold mb-6">
              <p className="text-muted-foreground text-sm">PRICE</p>

              <div className="flex gap-2 items-center">
                <span>{getCurrency(program?.network)?.icon}</span>
                <p>
                  <span className="text-xl">{acceptedPrice}</span>{' '}
                  <span className="text-muted-foreground text-xs mr-1.5">
                    {acceptedPrice && ' / '}
                    {program?.price}
                  </span>
                  {program?.currency}
                </p>
              </div>
            </div>

            <div className="w-full border-b mb-6" />

            <div className="flex justify-between items-center font-bold ">
              <p className="text-muted-foreground text-sm">DEADLINE</p>

              <p className="text-xl leading-7">
                {format(new Date(program?.deadline ?? new Date()), 'dd.MMM.yyyy').toUpperCase()}
              </p>
            </div> */}

              {/* {
              isLoggedIn &&
              program?.status === 'published' &&
              program.creator?.id !== userId &&
              program?.validators?.every((validator) => validator.id !== userId) &&
              (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={(e) => {
                        if (!isAuthed) {
                          notify('Please add your email', 'success');
                          navigate('/profile/edit');
                          return;
                        }

                        e.stopPropagation();
                      }}
                      className="mt-6 mb-3 text-sm w-full h-11 font-medium bg-black hover:bg-black/85 rounded-[6px] ml-auto block py-2.5 px-[66px]"
                    >
                      Submit application
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[800px] min-h-[760px] z-50 w-full max-w-[1440px] p-6 max-h-screen overflow-y-auto">
                    <CreateApplicationForm program={program} />
                  </DialogContent>
                </Dialog>
              )} */}

              <div className="mt-6">
                <div className="space-y-3">
                  {/* Application Step - Active */}
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <div className="flex items-center justify-between gap-4 flex-1">
                      <span className="font-bold text-gray-900 text-sm">APPLICATION</span>
                      <span className="font-bold text-gray-900 text-sm">
                        {program?.applicationStartDate && program?.applicationEndDate
                          ? `${format(new Date(program.applicationStartDate), 'dd. MMM. yyyy').toUpperCase()} – ${format(new Date(program.applicationEndDate), 'dd. MMM. yyyy').toUpperCase()}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Funding Step - Inactive */}
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0" />
                    <div className="flex items-center  justify-between gap-4 flex-1">
                      <span className="font-bold text-gray-400 text-sm">FUNDING</span>
                      <span className="font-bold text-gray-400 text-sm">
                        {program?.fundingStartDate && program?.fundingEndDate
                          ? `${format(new Date(program.fundingStartDate), 'dd. MMM. yyyy').toUpperCase()} – ${format(new Date(program.fundingEndDate), 'dd. MMM. yyyy').toUpperCase()}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">KEYWORDS</p>

                <div className="flex gap-2 flex-wrap">
                  {program?.keywords?.map((k) => (
                    <Badge key={k.id} variant="secondary">
                      {k.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">SUMMARY</p>

                <p className="text-slate-600 text-sm whitespace-pre-wrap">{program?.summary}</p>
              </div>

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM LINKS</p>
                {program?.links?.map((l) => (
                  <a
                    href={l?.url ?? ''}
                    key={l.url}
                    className="block hover:underline text-slate-600 text-sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l?.url}
                  </a>
                ))}
              </div>

              <Link to={`/investments/${program?.id}/create-project`}>
                <Button size="lg" className="w-full mt-6">
                  Create Project
                </Button>
              </Link>

              <div className="mt-6">
                <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM HOST</p>
                <div className="border rounded-xl w-full p-6 mb-6">
                  <Link
                    to={`/users/${program?.creator?.id}`}
                    className="flex gap-4 items-center text-lg font-bold mb-5"
                  >
                    {/* <div className="w-10 h-10 bg-gray-200 rounded-full" /> */}

                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={program?.creator?.image || ''}
                        alt={`${program?.creator?.firstName} ${program?.creator?.lastName}`}
                      />
                      <AvatarFallback>
                        {getInitials(
                          `${program?.creator?.firstName || ''} ${program?.creator?.lastName || ''}`,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {getUserName(program?.creator)}
                  </Link>

                  <div className="flex gap-3 mb-4">
                    <p className="text-xs font-bold w-[57px]">Summary</p>
                    <p className="text-xs">{program?.creator?.summary}</p>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <p className="text-xs font-bold w-[57px]">Email</p>
                    <p className="text-xs">{program?.creator?.email}</p>
                  </div>
                </div>
              </div>

              {!!program?.validators?.length && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">PROGRAM VALIDATOR</p>

                  {program.validators.map((validator) => (
                    <div className="border rounded-xl w-full p-6 mb-6" key={validator.id}>
                      <Link
                        to={`/users/${program?.creator?.id}`}
                        className="flex gap-4 items-center text-lg font-bold mb-5"
                      >
                        {/* <div className="w-10 h-10 bg-gray-200 rounded-full" /> */}

                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={validator?.image || ''}
                            alt={`${validator?.firstName} ${validator?.lastName}`}
                          />
                          <AvatarFallback>
                            {getInitials(
                              `${validator?.firstName || ''} ${validator?.lastName || ''}`,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {getUserName(validator)}
                      </Link>

                      <div className="flex gap-3 mb-4">
                        <p className="text-xs font-bold w-[57px]">Summary</p>
                        <p className="text-xs">{validator?.summary}</p>
                      </div>

                      <div className="flex gap-3 mb-4">
                        <p className="text-xs font-bold w-[57px]">Email</p>
                        <p className="text-xs">{validator?.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Funding Condition */}
              {program?.fundingCondition && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">FUNDING CONDITION</p>
                  <p className="text-slate-600 text-sm capitalize">
                    {program.fundingCondition === 'tier' ? 'Tier-based' : program.fundingCondition}
                  </p>
                </div>
              )}

              {/* Tier Settings */}
              {program?.fundingCondition === 'tier' && program?.tierSettings && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">TIER SETTINGS</p>
                  <div className="space-y-2">
                    {program.tierSettings.bronze?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Bronze</span>
                        <span className="text-sm text-gray-600">
                          Max: ${program.tierSettings.bronze.maxAmount}
                        </span>
                      </div>
                    )}
                    {program.tierSettings.silver?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Silver</span>
                        <span className="text-sm text-gray-600">
                          Max: ${program.tierSettings.silver.maxAmount}
                        </span>
                      </div>
                    )}
                    {program.tierSettings.gold?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Gold</span>
                        <span className="text-sm text-gray-600">
                          Max: ${program.tierSettings.gold.maxAmount}
                        </span>
                      </div>
                    )}
                    {program.tierSettings.platinum?.enabled && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Platinum</span>
                        <span className="text-sm text-gray-600">
                          Max: ${program.tierSettings.platinum.maxAmount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fee Information */}
              {(program?.feePercentage || program?.customFeePercentage) && (
                <div className="mt-6">
                  <p className="text-muted-foreground text-sm font-bold mb-3">PLATFORM FEE</p>
                  <p className="text-slate-600 text-sm">
                    {program.feePercentage
                      ? `${(program.feePercentage / 100).toFixed(1)}% (Default)`
                      : program.customFeePercentage
                        ? `${(program.customFeePercentage / 100).toFixed(1)}% (Custom)`
                        : 'Not Set'}
                  </p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="w-full">
              <h3 className="flex items-end">
                <span className="p-2 border-b border-b-primary font-medium text-sm">Details</span>
                <span className="block border-b w-full" />
              </h3>

              <div className="mt-3">
                {program?.description && <MarkdownPreviewer value={program?.description} />}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* <MainSection program={program} refetch={() => refetch} /> */}

      <div className='bg-white rounded-2xl p-10 mt-3'>

        <Tabs className="mt-3 max-w-[1440px] mx-auto" id="applications">
          <h2 className="text-xl font-bold mb-4">Projects</h2>
          <section className="" />

          <section className="grid grid-cols-3 gap-5">
            {!data?.program?.applications?.length && (
              <div className="text-slate-600 text-sm">No applications yet.</div>
            )}
            {data?.program?.applications?.map((a) => (
              <ProjectCard
                key={a.id}
                application={a}
              />
            ))}
          </section>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestmentDetailsPage;
