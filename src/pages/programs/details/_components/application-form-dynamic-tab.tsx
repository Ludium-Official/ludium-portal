import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { PlusIcon, XIcon } from 'lucide-react';
import * as React from 'react';

export interface ApplicationTabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  isFixed?: boolean;
}

export interface ApplicationDynamicTabsProps {
  tabs: ApplicationTabItem[];
  defaultActiveTab?: string;
  className?: string;
  onAddMilestone: () => void;
  onRemoveMilestone: (idx: number) => void;
}

export function ApplicationDynamicTabs({
  tabs,
  defaultActiveTab,
  className,
  onAddMilestone,
  onRemoveMilestone,
}: ApplicationDynamicTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab || tabs[0]?.id || '');

  React.useEffect(() => {
    if (!tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0]?.id || '');
    }
  }, [tabs, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn('flex flex-col', className)}
    >
      <div className="flex items-center w-full border-b border-gray-200 mb-6">
        <TabsPrimitive.List className="flex items-center gap-2 min-w-0 max-w-[750px]">
          {tabs.map((tab, idx) => (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'relative px-4 py-2 text-base font-normal bg-transparent border-none outline-none transition-colors',
                'text-black hover:text-primary',
                'data-[state=active]:text-primary',
                'data-[state=active]:font-medium',
                'data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:-bottom-[1px] data-[state=active]:after:h-[1px] data-[state=active]:after:bg-primary data-[state=active]:after:content-[""]',
                'focus-visible:outline-none',
                'min-w-[40px] flex items-center justify-center group',
              )}
            >
              <span>{tab.label}</span>
              {!tab.isFixed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMilestone(idx - 2);
                  }}
                  className="ml-1 p-0 bg-transparent border-none focus:outline-none"
                  tabIndex={-1}
                  aria-label="Remove tab"
                >
                  <XIcon className="w-4 h-4 align-middle" />
                </button>
              )}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
        {/* Add button */}
        <button
          type="button"
          onClick={onAddMilestone}
          className={cn(
            'ml-2 p-0 bg-transparent border-none text-black hover:text-primary transition-colors',
          )}
          aria-label="Add tab"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      {/* Tab content */}
      {tabs.map((tab) => (
        <TabsPrimitive.Content
          key={tab.id}
          value={tab.id}
          className="flex-1 outline-none px-4 max-h-[520px] overflow-y-auto"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
