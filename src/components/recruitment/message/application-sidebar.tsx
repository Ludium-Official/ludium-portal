import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatUTCDateLocal } from '@/lib/utils';
import { FileText, Folder, Image as ImageIcon } from 'lucide-react';
import { MilestoneAccordion } from './milestone-accordion';
import type { ApplicationSidebarProps } from '@/types/recruitment';

export function ApplicationSidebar({
  activeMilestones,
  completedMilestones,
  files,
  contracts,
  isSponsor,
  isHandleMakeNewMilestone,
  onMilestoneClick,
  onNewMilestoneClick,
  onContractClick,
}: ApplicationSidebarProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="h-full p-4 bg-[#FBF5FF] overflow-y-auto rounded-r-xl space-y-3 relative z-0">
      <MilestoneAccordion
        activeMilestones={activeMilestones}
        completedMilestones={completedMilestones}
        onMilestoneClick={onMilestoneClick}
        onNewMilestoneClick={onNewMilestoneClick}
        isSponsor={isSponsor}
        isHandleMakeNewMilestone={isHandleMakeNewMilestone}
      />

      <Accordion type="multiple" className="bg-white rounded-lg">
        <AccordionItem value="file" className="px-3 border-none">
          <AccordionTrigger className="hover:no-underline py-3">
            <span className="font-medium text-base">File</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 pb-3">
            {files.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">No files yet</div>
            ) : (
              files.map((file, index) => {
                const isImage = file.type.startsWith('image/');

                return (
                  <a
                    key={index}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:bg-slate-50 transition-colors"
                  >
                    {isImage ? (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Folder className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="w-[200px] text-sm font-semibold text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </a>
                );
              })
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contract" className="px-3 border-none">
          <AccordionTrigger className="hover:no-underline py-3">
            <span className="font-medium text-base">Contract</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 pb-3">
            {contracts.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">No contracts yet</div>
            ) : (
              contracts.map((contract, idx) => (
                <button
                  key={contract.id}
                  onClick={() => onContractClick(contract)}
                  className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors text-left w-full"
                >
                  <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      Contract #{idx + 1}
                      {contracts.length === idx + 1 && (
                        <span className="text-xs text-green-500 ml-2">(Latest)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400">
                      {contract.createdAt ? formatUTCDateLocal(contract.createdAt) : 'No date'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
