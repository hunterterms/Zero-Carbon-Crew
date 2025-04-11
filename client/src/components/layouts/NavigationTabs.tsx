import { TabType } from "@/lib/types";

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'activities', label: 'Activities', icon: 'tasks' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy' },
    { id: 'rewards', label: 'Rewards', icon: 'gift' },
    { id: 'achievements', label: 'Achievements', icon: 'medal' }
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-4 font-heading font-medium flex items-center whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-dark hover:text-primary'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <i className={`fas fa-${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
