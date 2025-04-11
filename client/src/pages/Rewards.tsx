import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Reward } from "@shared/schema";
import { RewardWithProgress } from "@/lib/types";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RewardCard from "@/components/rewards/RewardCard";
import RedeemedRewards from "@/components/rewards/RedeemedRewards";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Rewards() {
  const [sortBy, setSortBy] = useState("points-low-high");
  
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const { data: rewards, isLoading: isLoadingRewards } = useQuery<Reward[]>({
    queryKey: ['/api/rewards'],
  });
  
  // Process rewards data with user points to show progress
  const processedRewards: RewardWithProgress[] = rewards
    ? rewards.map(reward => {
        const userPoints = user?.points || 0;
        const isRedeemable = userPoints >= reward.pointsCost;
        const progress = Math.min(100, (userPoints / reward.pointsCost) * 100);
        const pointsNeeded = Math.max(0, reward.pointsCost - userPoints);
        
        return {
          ...reward,
          isRedeemable,
          progress,
          pointsNeeded
        };
      })
    : [];
  
  // Sort rewards based on selection
  const sortedRewards = [...processedRewards];
  if (sortBy === "points-low-high") {
    sortedRewards.sort((a, b) => a.pointsCost - b.pointsCost);
  } else if (sortBy === "points-high-low") {
    sortedRewards.sort((a, b) => b.pointsCost - a.pointsCost);
  }

  return (
    <>
      <DashboardSummary />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest">Eco Rewards</h2>
        <div className="flex items-center">
          <span className="text-neutral-dark mr-2">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Points (Low to High)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points-low-high">Points (Low to High)</SelectItem>
              <SelectItem value="points-high-low">Points (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoadingRewards ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-80 animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedRewards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRewards.map((reward) => (
            <RewardCard 
              key={reward.id} 
              reward={reward} 
              userId={user?.id || 1} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <i className="fas fa-gift text-primary text-5xl mb-4"></i>
          <h3 className="font-heading font-bold text-lg mb-2">No Rewards Available</h3>
          <p className="text-neutral-dark">
            There are no rewards available at the moment. Check back soon for exciting eco-friendly rewards!
          </p>
        </div>
      )}
      
      <RedeemedRewards />
    </>
  );
}
