import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { LeaderboardUser } from "@/lib/types";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import TopChampions from "@/components/leaderboard/TopChampions";
import LeaderboardList from "@/components/leaderboard/LeaderboardList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Leaderboard() {
  const [timeRange, setTimeRange] = useState("all-time");
  
  const { data: leaderboardData, isLoading } = useQuery<User[]>({
    queryKey: ['/api/leaderboard'],
  });
  
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  // Process leaderboard data
  const processedLeaderboard: LeaderboardUser[] = leaderboardData
    ? leaderboardData.map((user, index) => ({
        ...user,
        rank: index + 1,
        isCurrentUser: currentUser ? user.id === currentUser.id : false
      }))
    : [];

  // Split leaderboard for top 3 and the rest
  const topUsers = processedLeaderboard.slice(0, 3);
  const restOfUsers = processedLeaderboard.slice(3);
  
  // Find current user if not in top section
  const currentUserRank = processedLeaderboard.findIndex(user => user.isCurrentUser);
  const showCurrentUser = currentUserRank > 2;

  return (
    <>
      <DashboardSummary />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest">Carbon Champions Leaderboard</h2>
        <div className="flex items-center">
          <span className="text-neutral-dark mr-2">View:</span>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-neutral-lightest p-6">
            <div className="flex justify-center gap-4">
              <div className="animate-pulse h-32 w-20 bg-gray-200 rounded-lg"></div>
              <div className="animate-pulse h-40 w-24 bg-gray-200 rounded-lg"></div>
              <div className="animate-pulse h-32 w-20 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Top 3 Champions */}
          <TopChampions leaders={topUsers} />
          
          {/* Rest of Leaderboard */}
          <LeaderboardList users={restOfUsers} startRank={4} />
          
          {/* Show current user's position if not in top display */}
          {showCurrentUser && currentUserRank >= 0 && (
            <div className="p-4 pt-0">
              <div className="border-t border-dashed border-neutral-light my-2"></div>
              <LeaderboardList 
                users={[processedLeaderboard[currentUserRank]]} 
                startRank={currentUserRank + 1} 
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
