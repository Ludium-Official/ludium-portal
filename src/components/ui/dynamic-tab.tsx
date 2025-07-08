import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { PlusIcon, XIcon } from 'lucide-react';
import * as React from 'react';

// Types for tabs
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  isFixed?: boolean;
}

export interface DynamicTabsProps {
  tabs: TabItem[];
  onTabsChange: (tabs: TabItem[]) => void;
  defaultActiveTab?: string;
  className?: string;
  maxDynamicTabs?: number;
}

// Main component for dynamic tabs
export function DynamicTabs({
  tabs,
  onTabsChange,
  defaultActiveTab,
  className,
  maxDynamicTabs = 10,
}: DynamicTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultActiveTab || tabs[0]?.id || '');

  // Split tabs into fixed and dynamic
  const fixedTabs = tabs.filter(tab => tab.isFixed);
  const dynamicTabs = tabs.filter(tab => !tab.isFixed);

  // Handler for adding a new tab
  const handleAddTab = () => {
    if (dynamicTabs.length >= maxDynamicTabs) return;
    const newTabId = `dynamic-${Date.now()}`;
    const newTab: TabItem = {
      id: newTabId,
      label: `New Tab ${dynamicTabs.length + 1}`,
      content: <div className="p-4">New tab content</div>,
      isFixed: false,
    };
    const updatedTabs = [...tabs, newTab];
    onTabsChange(updatedTabs);
    setActiveTab(newTabId);
  };

  // Handler for removing a tab
  const handleRemoveTab = (tabId: string) => {
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    onTabsChange(updatedTabs);
    // If the removed tab was active, switch to the first available tab
    if (activeTab === tabId) {
      const newActiveTab = updatedTabs[0]?.id || '';
      setActiveTab(newActiveTab);
    }
  };

  // Handler for changing the active tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (tabs.length === 0) {
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">No tabs available</div>
          <button
            type="button"
            onClick={handleAddTab}
            className="ml-2 p-0 bg-transparent border-none hover:text-primary"
            aria-label="Add tab"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn('flex flex-col', className)}
    >
      <div className="flex items-center w-full border-b border-gray-200">
        <TabsPrimitive.List className="flex items-center gap-2 min-w-0">
          {/* Fixed tabs */}
          {fixedTabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'relative px-4 py-2 text-base font-normal bg-transparent border-none outline-none transition-colors',
                'text-black hover:text-primary',
                'data-[state=active]:text-primary',
                'data-[state=active]:font-medium',
                'data-[state=active]:after:absolute data-[state=active]:after:left-2 data-[state=active]:after:right-2 data-[state=active]:after:-bottom-[1px] data-[state=active]:after:h-[2px] data-[state=active]:after:bg-violet-500 data-[state=active]:after:rounded-full data-[state=active]:after:content-[""]',
                'focus-visible:outline-none',
                'min-w-[40px] flex items-center justify-center',
              )}
            >
              {tab.label}
            </TabsPrimitive.Trigger>
          ))}
          {/* Dynamic tabs */}
          {dynamicTabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'relative px-4 py-2 text-base font-normal bg-transparent border-none outline-none transition-colors',
                'text-black hover:text-primary',
                'data-[state=active]:text-primary',
                'data-[state=active]:font-medium',
                'data-[state=active]:after:absolute data-[state=active]:after:left-2 data-[state=active]:after:right-2 data-[state=active]:after:-bottom-[1px] data-[state=active]:after:h-[2px] data-[state=active]:after:bg-violet-500 data-[state=active]:after:rounded-full data-[state=active]:after:content-[""]',
                'focus-visible:outline-none',
                'min-w-[40px] flex items-center justify-center group',
              )}
            >
              <span>{tab.label}</span>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveTab(tab.id);
                }}
                className="ml-1 p-0 bg-transparent border-none focus:outline-none"
                tabIndex={-1}
                aria-label="Remove tab"
              >
                <XIcon className="w-4 h-4 align-middle" />
              </button>
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
        {/* Add button */}
        <button
          type="button"
          onClick={handleAddTab}
          className={cn(
            'ml-2 p-0 bg-transparent border-none text-black hover:text-primary transition-colors',
            dynamicTabs.length >= maxDynamicTabs && 'opacity-50 pointer-events-none'
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
          className="flex-1 outline-none"
        >
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}

// Hook for managing tab state
export function useDynamicTabs(initialTabs: TabItem[] = []) {
  const [tabs, setTabs] = React.useState<TabItem[]>(initialTabs);

  // Add a new tab
  const addTab = React.useCallback((tab: Omit<TabItem, 'id'>) => {
    const newTab: TabItem = {
      ...tab,
      id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTabs(prev => [...prev, newTab]);
    return newTab.id;
  }, []);

  // Remove a tab by id
  const removeTab = React.useCallback((tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  }, []);

  // Update a tab by id
  const updateTab = React.useCallback((tabId: string, updates: Partial<TabItem>) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, ...updates } : tab
    ));
  }, []);

  // Reorder tabs
  const reorderTabs = React.useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prev => {
      const newTabs = [...prev];
      const [removed] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, removed);
      return newTabs;
    });
  }, []);

  return {
    tabs,
    setTabs,
    addTab,
    removeTab,
    updateTab,
    reorderTabs,
  };
}

// Export base tab components for compatibility
export { TabsPrimitive };
