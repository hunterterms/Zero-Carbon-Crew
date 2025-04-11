import { useQuery } from "@tanstack/react-query";
import { Achievement } from "@shared/schema";
import { UserAchievementItem, AchievementWithStatus } from "@/lib/types";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import AchievementBadge from "@/components/achievements/AchievementBadge";
import { Card } from "@/components/ui/card";

export default function Achievements() {
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });
  
  const { data: userAchievements, isLoading: isLoadingUserAchievements } = useQuery<UserAchievementItem[]>({
    queryKey: ['/api/achievements/user'],
  });
  
  const isLoading = isLoadingAchievements || isLoadingUserAchievements;
  
  // Process achievements to mark unlocked ones
  const processedAchievements: Record<string, AchievementWithStatus[]> = {};
  
  if (achievements && userAchievements) {
    const unlockedIds = userAchievements.map(ua => ua.achievementId);
    
    // Group achievements by category
    achievements.forEach(achievement => {
      const category = achievement.category;
      if (!processedAchievements[category]) {
        processedAchievements[category] = [];
      }
      
      processedAchievements[category].push({
        ...achievement,
        isUnlocked: unlockedIds.includes(achievement.id)
      });
    });
  }
  
  // Get categories in a nice order
  const categories = Object.keys(processedAchievements).sort();

  return (
    <>
      <DashboardSummary />
      
      <div className="mb-4">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest">Your Eco Achievements</h2>
        <p className="text-neutral-dark">Collect badges by completing eco-friendly activities and challenges.</p>
      </div>
      
      {isLoading ? (
        <Card className="p-4 md:p-6">
          <h3 className="font-heading font-semibold text-lg mb-4 animate-pulse bg-gray-200 h-6 w-48 rounded"></h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-4 md:p-6">
          {categories.length > 0 ? (
            categories.map(category => (
              <div key={category}>
                <h3 className="font-heading font-semibold text-lg mb-4 mt-4 first:mt-0">{category} Heroes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {processedAchievements[category].map(achievement => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={achievement.isUnlocked}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8">
              <i className="fas fa-medal text-primary text-5xl mb-4"></i>
              <h3 className="font-heading font-bold text-lg mb-2">No Achievements Available</h3>
              <p className="text-neutral-dark">
                There are no achievements to display at the moment. Start completing activities to earn badges!
              </p>
            </div>
          )}
        </Card>
      )}
    </>
  );
}
