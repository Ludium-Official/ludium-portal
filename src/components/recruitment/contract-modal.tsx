import logo from '@/assets/logo.svg';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContractInformation } from '@/types/recruitment';
import { Separator } from '../ui/separator';
import { formatDateKorean, addDaysToDate, getUserDisplayName } from '@/lib/utils';
import { MarkdownPreviewer } from '../markdown';

interface ContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractInformation: ContractInformation;
}

export function ContractModal({ open, onOpenChange, contractInformation }: ContractModalProps) {
  const handleSubmit = () => {
    console.log('Submit contract', { contractInformation });
    // TODO: API 호출로 계약서 생성
    onOpenChange(false);
  };

  let pendingPayout = 0;

  const totalPayout = contractInformation.milestones.reduce((acc, milestone) => {
    if (milestone.status !== 'completed') {
      if (milestone.status === 'pending') {
        pendingPayout += Number(milestone.payout);
      }

      return acc + Number(milestone.payout);
    }

    return acc;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-3xl font-bold">
            Employment Contract
            <img src={logo} alt="LUDIUM" className="h-8" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="text-lg font-bold mb-2">{contractInformation.title}</div>
          <Separator className="my-4" />
          <div className="flex-1 overflow-y-auto px-2">
            <div className="space-y-6 text-sm leading-relaxed">
              <div>
                <h3 className="text-lg font-bold mb-2">1. 계약 개요</h3>
                <p className="mb-2">
                  본 계약서(이하 &ldquo;계약&rdquo;)는 스폰서와 빌더가 [플랫폼명, 이하
                  &ldquo;루디움(Ludium)&rdquo;]을 통해 체결하는 프로젝트 수행 계약임.
                </p>
                <p>양 당사자는 아래 명시된 조건에 따라 프로젝트를 성실히 수행할 것을 약속함.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">2. 프로젝트 상세</h3>
                <div className="space-y-4">
                  {contractInformation.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id || index}
                      className="border border-border rounded-lg p-4 bg-muted/30 space-y-3"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            프로젝트 제목
                            <span className="text-green-500">
                              {milestone.status === 'progress' && 'In Progress'}
                            </span>
                          </div>
                          <div>{milestone.title || ''}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            작업 내용
                          </div>
                          <MarkdownPreviewer
                            value={milestone.description || ''}
                            className="mb-0!"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            작업 제출일
                          </div>
                          <div>{formatDateKorean(milestone.deadline)}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">지급일</div>
                          <div>{addDaysToDate(milestone.deadline, 3)}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-semibold text-muted-foreground">
                            지급 금액
                          </div>
                          <div>{milestone.payout}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">3. 빌더의 의무</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>빌더는 작업 제출일 내에 합의된 범위와 품질 기준에 맞춰 작업을 완료함.</li>
                  <li>모든 작업물은 빌더의 창작물이어야 하며, 제3자의 저작권을 침해하지 않음.</li>
                  <li>
                    빌더는 프로젝트 진행 중 진행 상황을 성실히 공유하고, 스폰서의 피드백에 신속히
                    응답함.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">4. 스폰서의 의무</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>스폰서는 제출된 작업물을 공정하고 신속하게 검토함.</li>
                  <li>스폰서는 합리적인 사유 없이 추가 작업을 요구할수없음+원할시 마일스톤추가</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">5. 상호 성실 이행 및 위반 시 조치</h3>

                <div className="mt-2">
                  <h4 className="font-semibold mb-1">5-1. 상호 성실 이행</h4>
                  <p className="mb-2">
                    스폰서와 빌더는 상호 <strong>신뢰와 성실</strong>을 기반으로 협력하며,
                  </p>
                  <p className="mb-2">각자의 역할과 의무를 충실히 수행함.</p>
                  <p>고의적인 지연, 불성실한 소통, 무단 연락두절 등은 위반 행위로 간주함.</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">5-2. 위반 및 계약 해지</h4>

                  <div className="mb-3">
                    <strong>① 빌더의 위반</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li>
                        빌더가 장기간 연락이 두절되거나, 소통을 게을리하거나, 약속된 결과물의 품질이
                        현저히 미달될 경우, 스폰서는 계약 해지를 요청할 수 있음.
                      </li>
                      <li>스폰서가 신고를 접수하면 빌더에게도 알림이 자동 발송됨.</li>
                      <li>
                        빌더가 즉시 성실히 재수행 의사를 밝히고 스폰서가 이를 수락할 경우, 스폰서는
                        신고를 취소할 수 있음.
                      </li>
                      <li>
                        이후 동일한 사유로 재신고가 접수될 경우, 플랫폼은 별도 조정 없이 해당 계약을
                        즉시 파기함.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <strong>② 스폰서의 위반</strong>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                      <li className="mb-2">
                        <strong>합의 범위 외 작업 요구</strong>
                        <br />
                        스폰서는 계약서에 명시된 작업 범위를 일방적으로 변경하거나 추가 작업을
                        요구하지 않음. 추가 작업이 필요한 경우, 반드시 빌더의 동의와 함께 별도 계약
                        또는 마일스톤을 새로 설정함.
                      </li>
                      <li className="mb-2">
                        <strong>허위 신고</strong>
                        <br />
                        스폰서는 객관적인 근거 없이 허위 또는 악의적인 신고를 하지 않음. 부당한
                        신고로 인해 빌더에게 불이익이 발생할 경우, 플랫폼은 해당 신고를 무효
                        처리하고 스폰서에게 제재를 가할 수 있음.
                      </li>
                      <li>
                        <strong>부당한 계약 해지</strong>
                        <br />
                        스폰서는 정당한 사유 없이 프로젝트를 일방적으로 중단하거나 계약을 해지하지
                        않음. 프로젝트 중단이 필요한 경우, 반드시 루디움의 조정 절차를 거쳐야 하며,
                        플랫폼의 승인 없이 해지된 계약은 효력이 없음.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">
                  6. 플랫폼 내 거래 원칙 (Off-platform 거래 금지)
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>스폰서와 빌더는 계약 체결 이후, 루디움 채팅 시스템을 통해서만 소통함.</li>
                  <li>
                    개인 연락처(이메일, SNS, 전화번호 등)를 공유하여{' '}
                    <strong>플랫폼 외 개인 거래(Off-platform 거래)</strong>를 유도하거나 진행하는
                    행위는 금지됨.
                  </li>
                  <li>
                    루디움 외부에서의 직접 거래는 루디움의 보증, 에스크로, 분쟁 조정 대상에서
                    제외되며, 적발 시 즉시 계정 정지 또는 영구 이용 제한(밴) 조치가 이루어짐.
                  </li>
                  <li>모든 거래는 루디움을 통해서만 보장됨.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">7. 분쟁 해결</h3>
                <p>
                  계약 관련 이견이 발생할 경우, 양 당사자는 먼저 플랫폼의 내부 분쟁 조정 시스템을
                  통해 해결을 시도함.
                </p>
                <p className="mt-2">
                  해결되지 않을 경우, 스마트 컨트랙트 기록 및 온체인 트랜잭션을 최종 증거로 사용하여
                  플랫폼 규정에 따라 처리함.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col! gap-4 border-t pt-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted-foreground">Sponsor</div>
              <div className="text-sm">
                {getUserDisplayName(
                  contractInformation.sponsor?.firstName,
                  contractInformation.sponsor?.lastName,
                  contractInformation.sponsor?.email,
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted-foreground">Builder</div>
              <div className="text-sm">
                {getUserDisplayName(
                  contractInformation.applicant?.firstName,
                  contractInformation.applicant?.lastName,
                  contractInformation.applicant?.email,
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-muted-foreground">Total payout</div>
              <div className="text-sm">
                <span className="text-muted-foreground">
                  {pendingPayout > 0 && `You will pay only ${pendingPayout}`}
                </span>
                {totalPayout - pendingPayout}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="default" onClick={handleSubmit} className="w-fit">
              Continue writing
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
