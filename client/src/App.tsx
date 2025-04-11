import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Activities from "@/pages/Activities";
import Leaderboard from "@/pages/Leaderboard";
import Rewards from "@/pages/Rewards";
import Achievements from "@/pages/Achievements";
import Header from "@/components/layouts/Header";
import NavigationTabs from "@/components/layouts/NavigationTabs";
import Footer from "@/components/layouts/Footer";
import { TabType } from "@/lib/types";

function Router() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>(
    (location === '/' || location === '/activities') ? 'activities' :
    location === '/leaderboard' ? 'leaderboard' :
    location === '/rewards' ? 'rewards' :
    location === '/achievements' ? 'achievements' : 'activities'
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    
    // Update URL based on tab
    switch (tab) {
      case 'activities':
        setLocation('/activities');
        break;
      case 'leaderboard':
        setLocation('/leaderboard');
        break;
      case 'rewards':
        setLocation('/rewards');
        break;
      case 'achievements':
        setLocation('/achievements');
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Switch>
          <Route path="/" component={Activities} />
          <Route path="/activities" component={Activities} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/rewards" component={Rewards} />
          <Route path="/achievements" component={Achievements} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
