import logo from '@/assets/logo.svg';
import { MarkdownPreviewer } from '@/components/markdown';
import { Separator } from '@/components/ui/separator';
import { useNetworks } from '@/contexts/networks-context';
import { useContract } from '@/lib/hooks/use-contract';
import { addDaysToDate, formatUTCDateLocal, getUserDisplayName } from '@/lib/utils';
import type { ContractFormProps } from '@/types/recruitment';
import { MilestoneStatusV2 } from '@/types/types.generated';
import { useEffect, useState } from 'react';

export function ContractForm({
  contractJson,
  isSponsor = false,
  onchainContractId,
  networkId,
  readOnly = false,
}: {
  contractJson: ContractFormProps;
  isSponsor?: boolean;
  onchainContractId?: number | string;
  networkId?: number | null;
  readOnly?: boolean;
}) {
  const { getTokenById, networks: networksWithTokens, getContractByNetworkId } = useNetworks();

  const [contractData, setContractData] = useState<any>(null);

  const token = getTokenById(contractJson.tokenId);

  const currentNetwork = networksWithTokens.find((network) => Number(network.id) === networkId);
  const currentContract = getContractByNetworkId(Number(currentNetwork?.id));
  const contract = useContract(currentNetwork?.chainName || 'educhain', currentContract?.address);

  useEffect(() => {
    const fetchContractAmounts = async () => {
      if (onchainContractId && contract && currentContract?.address) {
        try {
          const onchainContractData = await contract.getContract(onchainContractId);
          setContractData(onchainContractData);
        } catch (error) {
          console.error('Failed to fetch contract amounts:', error);
        }
      }
    };

    fetchContractAmounts();
  }, [onchainContractId, currentContract?.address]);

  return (
    <>
      <div>
        <div className="flex items-center justify-between text-3xl font-bold">
          Employment Contract
          <img src={logo} alt="BAS" className="h-8" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="text-lg font-bold mb-2">{contractJson.programTitle}</div>
        <Separator className="my-4" />
        <div className="flex-1 overflow-y-auto px-2">
          <div className="space-y-6 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-bold mb-2">1. Contract Overview</h3>
              <p className="mb-2">
                This contract (hereinafter referred to as the &ldquo;Contract&rdquo;) is a project
                execution agreement between the Sponsor and the Builder through Bas.
              </p>
              <p>
                Both parties agree to faithfully perform the project in accordance with the terms
                specified below.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">2. Project Details</h3>
              <div className="space-y-4">
                {[...contractJson.milestones]
                  .sort((a, b) => {
                    if (a.deadline && b.deadline) {
                      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                    }
                    return 0;
                  })
                  .map((milestone, index) => {
                    return (
                      <div
                        key={milestone.id || index}
                        className="border border-border rounded-lg p-4 bg-muted/30 space-y-3"
                      >
                        <div className="space-y-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                              Milestone Title
                              {milestone.status === MilestoneStatusV2.InProgress ? (
                                <span className="bg-[#60A5FA] px-2 py-[1px] rounded-full text-white">
                                  In Progress
                                </span>
                              ) : (
                                <span className="bg-[#4ADE80] px-2 py-[1px] rounded-full text-white">
                                  New
                                </span>
                              )}
                            </div>
                            <div>{milestone.title || ''}</div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold text-muted-foreground">
                              Description
                            </div>
                            <MarkdownPreviewer
                              value={milestone.description || ''}
                              className="mb-0!"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold text-muted-foreground">
                              Submission Date
                            </div>
                            <div>{formatUTCDateLocal(milestone.deadline)}</div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold text-muted-foreground">
                              Payment Date
                            </div>
                            <div>{addDaysToDate(milestone.deadline, 2)}</div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="text-sm font-semibold text-muted-foreground">
                              Payment Amount
                            </div>
                            <div>
                              {milestone.payout} {token?.tokenName}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">3. Builder&apos;s Obligations</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  The Builder shall complete the work within the submission deadline according to
                  the agreed scope and quality standards.
                </li>
                <li>
                  All deliverables must be the Builder&apos;s original work and shall not infringe
                  upon any third-party copyrights.
                </li>
                <li>
                  The Builder shall faithfully share progress updates during the project and respond
                  promptly to the Sponsor&apos;s feedback.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">4. Sponsor&apos;s Obligations</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>The Sponsor shall review submitted deliverables fairly and promptly.</li>
                <li>
                  The Sponsor shall not request additional work without reasonable cause. If
                  additional work is desired, a new milestone must be added.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">
                5. Mutual Good Faith Performance and Breach Actions
              </h3>

              <div className="mt-2">
                <h4 className="font-semibold mb-1">5-1. Mutual Good Faith Performance</h4>
                <p className="mb-2">
                  The Sponsor and Builder shall cooperate based on mutual{' '}
                  <strong>trust and good faith</strong>,
                </p>
                <p className="mb-2">
                  and faithfully perform their respective roles and obligations.
                </p>
                <p>
                  Intentional delays, unfaithful communication, or unauthorized absence of contact
                  shall be considered breach of contract.
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">5-2. Breach and Termination</h4>

                <div className="mb-3">
                  <strong>① Builder&apos;s Breach</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li>
                      If the Builder is out of contact for an extended period, neglects
                      communication, or the quality of deliverables is significantly substandard,
                      the Sponsor may request contract termination.
                    </li>
                    <li>
                      When the Sponsor files a report, a notification is automatically sent to the
                      Builder.
                    </li>
                    <li>
                      If the Builder immediately expresses intention to faithfully re-perform and
                      the Sponsor accepts, the Sponsor may cancel the report.
                    </li>
                    <li>
                      If a subsequent report is filed for the same reason, the platform shall
                      immediately terminate the contract without further mediation.
                    </li>
                  </ul>
                </div>

                <div>
                  <strong>② Sponsor&apos;s Breach</strong>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                    <li className="mb-2">
                      <strong>Requesting Work Outside Agreed Scope</strong>
                      <br />
                      The Sponsor shall not unilaterally change the work scope specified in the
                      contract or request additional work. If additional work is required, a
                      separate contract or milestone must be established with the Builder&apos;s
                      consent.
                    </li>
                    <li className="mb-2">
                      <strong>False Reporting</strong>
                      <br />
                      The Sponsor shall not make false or malicious reports without objective
                      grounds. If the Builder suffers disadvantage due to an unfair report, the
                      platform may invalidate the report and impose sanctions on the Sponsor.
                    </li>
                    <li>
                      <strong>Unfair Contract Termination</strong>
                      <br />
                      The Sponsor shall not unilaterally suspend or terminate the project without
                      just cause. If project suspension is necessary, Bas&apos;s mediation procedure
                      must be followed, and contracts terminated without platform approval shall be
                      invalid.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">
                6. On-Platform Transaction Policy (Off-Platform Transactions Prohibited)
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  After contract execution, the Sponsor and Builder shall communicate only through
                  Bas&apos;s chat system.
                </li>
                <li>
                  Sharing personal contact information (email, SNS, phone numbers, etc.) to induce
                  or conduct <strong>off-platform transactions</strong> is prohibited.
                </li>
                <li>
                  Direct transactions outside Bas are excluded from Bas&apos;s guarantee, escrow,
                  and dispute mediation, and detection may result in immediate account suspension or
                  permanent ban.
                </li>
                <li>All transactions are guaranteed only through Bas.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">7. Dispute Resolution</h3>
              <p>
                In case of contract-related disputes, both parties shall first attempt resolution
                through the platform&apos;s internal dispute mediation system.
              </p>
              <p className="mt-2">
                If unresolved, smart contract records and on-chain transactions shall be used as
                final evidence and handled according to platform regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col! gap-4 border-t pt-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-muted-foreground">Sponsor</div>
            <div className="text-sm">
              {getUserDisplayName(contractJson.sponsor?.nickname, contractJson.sponsor?.email)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-muted-foreground">Builder</div>
            <div className="text-sm">
              {getUserDisplayName(contractJson.applicant?.nickname, contractJson.applicant?.email)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-muted-foreground">Total price</div>
            <div className="text-sm">
              {(() => {
                const newTotalPrice = contractJson.milestones.reduce(
                  (acc: number, milestone: any) => acc + Number(milestone.payout),
                  0,
                );
                const totalPrice = contractData?.totalAmount;

                if (newTotalPrice?.toString() !== totalPrice?.toString()) {
                  const actualPaymentAmount = newTotalPrice - totalPrice;

                  if (actualPaymentAmount > 0) {
                    return (
                      <>
                        {isSponsor && !readOnly && (
                          <span className="mr-2 text-gray-400">
                            {`* You will pay only ${actualPaymentAmount
                              .toFixed(6)
                              .replace(/\.?0+$/, '')} ${token?.tokenName}`}
                          </span>
                        )}
                        {Number.parseFloat(newTotalPrice.toString())
                          .toFixed(6)
                          .replace(/\.?0+$/, '')}{' '}
                        {token?.tokenName}
                      </>
                    );
                  } else if (actualPaymentAmount < 0) {
                    return (
                      <>
                        {isSponsor && !readOnly && (
                          <span className="mr-2 text-gray-400">
                            {`* ${Math.abs(actualPaymentAmount)
                              .toFixed(6)
                              .replace(/\.?0+$/, '')} ${token?.tokenName} will be refund`}
                          </span>
                        )}
                        {Number.parseFloat(newTotalPrice.toString())
                          .toFixed(6)
                          .replace(/\.?0+$/, '')}{' '}
                        {token?.tokenName}
                      </>
                    );
                  }
                }

                return `${Number.parseFloat(newTotalPrice.toString())
                  .toFixed(6)
                  .replace(/\.?0+$/, '')} ${token?.tokenName}`;
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
