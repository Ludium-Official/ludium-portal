import { useInviteUserToProgramMutation } from '@/apollo/mutation/invite-user-to-program.generated';
import { useRemoveUserFromProgramMutation } from '@/apollo/mutation/remove-user-from-program.generated';
import { useUsersQuery } from '@/apollo/queries/users.generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import notify from '@/lib/notify';
import { getCurrencyIcon, sortTierSettings } from '@/lib/utils';
import { TierBadge, type TierType } from '@/pages/investments/_components/tier-badge';
import type { InvestmentTier, Program, Supporter } from '@/types/types.generated';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SupportersModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program | null | undefined;
  programId: string;
  onRefetch: () => void;
}

interface StoredSupporter {
  id: string;
  name: string;
  email: string;
  tier: string;
  walletAddress?: string;
}

const SupportersModal: React.FC<SupportersModalProps> = ({
  isOpen,
  onOpenChange,
  program,
  programId,
  onRefetch,
}) => {
  const [supportersTab, setSupportersTab] = useState<'invite' | 'supporters'>('invite');
  const [selectedSupporter, setSelectedSupporter] = useState<string[]>([]);
  const [selectedSupporterItems, setSelectedSupporterItems] = useState<
    { label: string; value: string }[]
  >([]);
  const [supporterInput, setSupporterInput] = useState<string>();
  const [debouncedSupporterInput, setDebouncedSupporterInput] = useState<string>();
  const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);
  const [storedSupporters, setStoredSupporters] = useState<StoredSupporter[]>([]);

  const [inviteUserToProgram] = useInviteUserToProgramMutation();
  const [removeUserFromProgram] = useRemoveUserFromProgramMutation();

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

  // Set initial tier when tierSettings are available
  useEffect(() => {
    if (program?.tierSettings && !selectedTier) {
      const enabledTiers = sortTierSettings(program.tierSettings).filter(
        ([_, value]) => (value as { enabled: boolean })?.enabled,
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
    const isAlreadyAdded = storedSupporters.some((supporter) => supporter.id === supporterId);
    if (isAlreadyAdded) {
      console.error('Supporter is already in the list');
      return;
    }

    // Find the user data to get wallet address
    const userData = supportersData?.users?.data?.find((u) => u.id === supporterId);

    // Add supporter to stored list with wallet address
    const newSupporter = {
      id: supporterId,
      name: supporterItem?.label || 'Unknown User',
      email: supporterItem?.label.split(' ')[0] || 'unknown@email.com', // Extract email from label
      tier: selectedTier || 'gold',
      walletAddress: userData?.walletAddress || undefined, // Store wallet address here!
    };

    if (!userData?.walletAddress) {
      console.warn(
        `⚠️ User ${newSupporter.name} has no wallet address. They will need to connect a wallet before investing.`,
      );
    }

    setStoredSupporters((prev) => [...prev, newSupporter]);

    // Reset selection
    setSelectedSupporter([]);
    setSelectedSupporterItems([]);
    setSupporterInput('');
  };

  const removeSupporter = (supporterId: string) => {
    setStoredSupporters((prev) => prev.filter((supporter) => supporter.id !== supporterId));
  };

  // Helper function to sort supporters by tier (highest to lowest)
  const sortSupportersByTier = (supporters: StoredSupporter[]) => {
    const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];
    return [...supporters].sort((a, b) => {
      const indexA = tierOrder.indexOf(a.tier);
      const indexB = tierOrder.indexOf(b.tier);
      return indexA - indexB;
    });
  };

  // Helper function to sort existing supporters by tier (highest to lowest)
  const sortExistingSupportersByTier = (supporters: Supporter[]) => {
    const tierOrder = ['platinum', 'gold', 'silver', 'bronze'];
    return [...supporters].sort((a, b) => {
      const indexA = tierOrder.indexOf(a.tier ?? '');
      const indexB = tierOrder.indexOf(b.tier ?? '');
      return indexA - indexB;
    });
  };

  // Helper function to calculate total amount for stored supporters
  const calculateStoredSupportersTotal = () => {
    return storedSupporters.reduce((total, supporter) => {
      const tierSettings = program?.tierSettings;
      if (!tierSettings) return total;

      const tierValue = (tierSettings as Record<string, { maxAmount?: number }>)[
        supporter.tier ?? ''
      ];
      const amount = new BigNumber(tierValue?.maxAmount ?? 0);
      return total.plus(amount);
    }, new BigNumber(0));
  };

  // Helper function to calculate total amount for existing supporters
  const calculateExistingSupportersTotal = () => {
    if (!program?.supporters) return new BigNumber(0);

    return program.supporters.reduce((total, supporter) => {
      const tierSettings = program?.tierSettings;
      if (!tierSettings) return total;

      const tierValue = (tierSettings as Record<string, { maxAmount?: number }>)[
        supporter.tier ?? ''
      ];
      const amount = new BigNumber(tierValue?.maxAmount ?? 0);
      return total.plus(amount);
    }, new BigNumber(0));
  };

  // Helper function to check if total amount exceeds program price
  const isAmountExceeded = () => {
    const storedTotal = calculateStoredSupportersTotal();
    const existingTotal = calculateExistingSupportersTotal();
    const totalAmount = storedTotal.plus(existingTotal);
    const programPrice = new BigNumber(program?.price ?? 0);

    return totalAmount.gt(programPrice);
  };

  const handleSendInvitation = async () => {
    try {
      if (!storedSupporters.length || !programId) {
        console.error('Please add at least one supporter');
        return;
      }

      // Get on-chain program ID from the program
      const onChainProgramId = program?.educhainProgramId;
      if (!onChainProgramId) {
        notify('Program not yet deployed on blockchain', 'error');
        return;
      }

      // Use wallet addresses from stored supporters
      console.log('📋 Processing supporters with their wallet addresses...');
      for (const supporter of storedSupporters) {
        if (supporter.walletAddress) {
          console.log(`✅ ${supporter.name} has wallet: ${supporter.walletAddress}`);
        } else {
          console.warn(`⚠️ ${supporter.name} has no wallet address - tier sync will be skipped`);
        }
      }

      // Send invitations to all stored supporters
      const invitedSupporters: Array<{
        supporter: StoredSupporter;
        walletAddress?: string;
      }> = [];
      const syncedCount = 0;
      let failedCount = 0;

      for (const supporter of storedSupporters) {
        try {
          // First, save to database
          await inviteUserToProgram({
            variables: {
              programId: programId,
              userId: supporter.id,
              tier: supporter.tier as InvestmentTier,
              maxInvestmentAmount:
                program?.tierSettings?.[supporter.tier as keyof typeof program.tierSettings]
                  ?.maxAmount,
            },
            onError: (error) => {
              notify(`Failed to invite ${supporter.name}: ${error.message}`, 'error');
              failedCount++;
            },
          });

          const walletAddress = supporter.walletAddress; // Use wallet from stored supporter
          invitedSupporters.push({
            supporter,
            walletAddress,
          });

          // Then sync to blockchain if wallet address is available
          if (walletAddress && program?.fundingCondition === 'tier') {
            try {
              const maxAmount =
                program?.tierSettings?.[supporter.tier as keyof typeof program.tierSettings]
                  ?.maxAmount || '0';

              // Get token decimals based on currency
              const decimals = program?.currency === 'EDU' || program?.currency === 'ETH' ? 18 : 6;
              const maxInvestmentWei = ethers.utils
                .parseUnits(maxAmount.toString(), decimals)
                .toString();

              console.log('🔄 Syncing tier to blockchain:', {
                programId: onChainProgramId,
                user: walletAddress,
                tier: supporter.tier,
                maxInvestment: maxInvestmentWei,
                currency: program?.currency,
                decimals: decimals,
              });

              // const result = await investmentContract.assignUserTierToProgram({
              //   programId: onChainProgramId,
              //   user: walletAddress,
              //   tierName: supporter.tier.toLowerCase(), // Ensure lowercase
              //   maxInvestment: maxInvestmentWei,
              // });

              // console.log(`✅ Tier sync transaction hash: ${result.txHash}`);

              // // Verify the tier was actually synced
              // const verifyTier = await investmentContract.getProgramUserTier(
              //   onChainProgramId,
              //   walletAddress,
              // );

              // if (verifyTier?.isAssigned) {
              //   syncedCount++;
              //   console.log(
              //     `✅ Successfully synced and verified tier for ${supporter.name} (${walletAddress})`,
              //   );
              //   notify(`Tier synced for ${supporter.name}`, 'success');
              // } else {
              //   throw new Error(
              //     'Tier sync verification failed - tier not found on chain after transaction',
              //   );
              // }
            } catch (error) {
              console.error(`❌ Failed to sync tier for ${supporter.name}:`, error);

              // Provide specific error messages
              let errorMsg = 'Failed to sync tier to blockchain. ';
              const errorMessage = error instanceof Error ? error.message : String(error);
              if (errorMessage.includes('Only program creator')) {
                errorMsg += 'Only the program creator can assign tiers.';
              } else if (errorMessage.includes('User rejected')) {
                errorMsg += 'Transaction was cancelled.';
              } else if (errorMessage.includes('insufficient funds')) {
                errorMsg += 'Insufficient funds for gas fees.';
              } else {
                errorMsg +=
                  'The invitation was saved but tier sync failed. Manual sync may be required.';
              }

              notify(errorMsg, 'error');
              console.error('Full error details:', error);

              // Track failed syncs
              failedCount++;
            }
          } else if (!walletAddress) {
            console.warn(
              `⚠️ No wallet address found for ${supporter.name}. Tier will not be synced to blockchain.`,
            );
            notify(
              `Warning: ${supporter.name} has no wallet address. They need to connect a wallet before they can invest.`,
              'error',
            );
          }
        } catch (error) {
          console.error(`Failed to process supporter ${supporter.name}:`, error);
          failedCount++;
        }
      }

      if (syncedCount > 0) {
        notify(
          `Successfully invited supporters and synced ${syncedCount} tiers to blockchain`,
          'success',
        );
      } else if (failedCount === 0) {
        notify('All invitations sent successfully', 'success');
      } else {
        notify(
          `Invited ${storedSupporters.length - failedCount} supporters, ${failedCount} failed`,
          'error',
        );
      }

      setStoredSupporters([]);
      onRefetch();
    } catch (error) {
      console.error((error as Error).message);
      notify('Failed to send invitations', 'error');
    }
  };

  const handleRemoveSupporter = async (userId: string) => {
    try {
      await removeUserFromProgram({
        variables: {
          programId: programId,
          userId: userId,
        },
        onCompleted: () => {
          notify('Supporter removed successfully', 'success');
          onRefetch();
        },
        onError: (error) => {
          notify(`Failed to remove supporter: ${error.message}`, 'error');
        },
      });
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogTitle className="text-2xl font-semibold">Invite Supporter</DialogTitle>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b transition-colors ${
              supportersTab === 'invite'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setSupportersTab('invite')}
          >
            Invite supporter
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              supportersTab === 'supporters'
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
                <div
                  className={`flex items-center justify-between ${
                    !!program?.tierSettings && 'border-b pb-3'
                  }`}
                >
                  <span className="text-sm text-muted-foreground font-bold">
                    Program Tier Condition
                  </span>
                  {program?.tierSettings ? (
                    <div className="flex gap-2">
                      {sortTierSettings(program.tierSettings).map(([key, value]) => {
                        if (!(value as { enabled: boolean })?.enabled) return null;
                        return <TierBadge key={key} tier={key as TierType} />;
                      })}
                    </div>
                  ) : (
                    <Badge className="font-semibold text-gray-600 bg-gray-200">Open</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {program?.tierSettings &&
                    sortTierSettings(program.tierSettings).map(([key, value]) => {
                      if (!(value as { enabled: boolean })?.enabled) return null;

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-end gap-2 text-muted-foreground"
                        >
                          <span className="text-sm">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <span className="text-sm font-bold">
                            {(value as { maxAmount?: number })?.maxAmount?.toLocaleString() ||
                              'N/A'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Invite Supporter Input */}
            <div className="">
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
                      <Button variant="outline" className="h-10 px-3 justify-between min-w-[120px]">
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
                        {sortTierSettings(program.tierSettings).map(([key, value]) => {
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

            <div className="min-h-[200px]">
              {/* Stored Supporters List */}
              {storedSupporters.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3">Added Supporters</h3>
                  <div className="">
                    <div className="grid grid-cols-3 gap-4 p-3 border-b text-sm font-medium">
                      <div className="text-muted-foreground">Tier</div>
                      <div className="text-muted-foreground">User name</div>
                      <div />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {sortSupportersByTier(storedSupporters).map((supporter) => (
                        <div
                          key={supporter.id}
                          className="grid grid-cols-3 gap-4 p-3 border-b last:border-b-0 items-center hover:bg-muted"
                        >
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
                  <span className="">Total</span>{' '}
                  <span className="font-bold text-lg">{storedSupporters.length}</span>
                </div>
                <div className="text-sm font-medium flex items-center gap-2">
                  <span className={`font-bold text-lg ${isAmountExceeded() ? 'text-red-600' : ''}`}>
                    {calculateStoredSupportersTotal().toString()}
                  </span>
                  <span>{getCurrencyIcon(program?.currency)}</span>
                  <span>{program?.currency}</span>
                </div>
              </div>
            )}

            {/* Send Invitation Button */}
            <div className="flex justify-between items-center mt-6 border-t pt-[22px]">
              {isAmountExceeded() && (
                <div className="text-sm bg-red-600 text-white font-medium px-6 py-3 rounded-md">
                  The amount has been exceeded.
                </div>
              )}
              <Button
                onClick={handleSendInvitation}
                disabled={!storedSupporters.length || isAmountExceeded()}
                className="bg-foreground text-white"
              >
                Send Invitation
              </Button>
            </div>
          </div>
        )}

        {/* Supporters Tab */}
        {supportersTab === 'supporters' && (
          <div className="">
            <div className="grid grid-cols-3 gap-4 p-3 border-b text-sm font-medium">
              <div className="text-muted-foreground">Tier</div>
              <div className="text-muted-foreground">User name</div>
              <div />
            </div>
            {program?.supporters && program.supporters.length > 0 ? (
              <div className="">
                {sortExistingSupportersByTier(program.supporters).map((supporter: Supporter) => (
                  <div
                    key={supporter.userId}
                    className="grid grid-cols-3 gap-4 p-3 min-h-[64px] border-b last:border-b-0 items-center hover:bg-muted"
                  >
                    <div>
                      <TierBadge tier={supporter.tier as TierType} />
                    </div>
                    <div className="text-sm">
                      {supporter.firstName} {supporter.lastName} {supporter.email}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => supporter.userId && handleRemoveSupporter(supporter.userId)}
                        className="h-6 w-6 p-0"
                        disabled={!supporter.userId}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No supporters invited yet
              </p>
            )}

            <div className="mt-6 flex justify-between items-center bg-muted p-4">
              <div className="text-sm flex items-center gap-8">
                <span className="">Total</span>{' '}
                <span className="font-bold text-lg">{program?.supporters?.length || 0}</span>
              </div>
              <div className="text-sm font-medium flex items-center gap-2">
                <span className="font-bold text-lg">
                  {calculateExistingSupportersTotal().toString()}
                </span>
                <span>{getCurrencyIcon(program?.currency)}</span>
                <span>{program?.currency}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupportersModal;
