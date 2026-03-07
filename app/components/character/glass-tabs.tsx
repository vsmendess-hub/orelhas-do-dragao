'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface GlassTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  renderContent: (activeTab: string) => ReactNode;
}

export function GlassTabs({ tabs, defaultTab, renderContent }: GlassTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
              activeTab === tab.id
                ? 'tab-purple scale-105'
                : 'tab-purple-inactive bg-white/5 backdrop-blur-sm hover:bg-white/10'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {renderContent(activeTab)}
      </div>
    </div>
  );
}
