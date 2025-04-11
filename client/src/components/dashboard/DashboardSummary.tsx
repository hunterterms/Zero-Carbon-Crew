import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card } from "@/components/ui/card";

export default function DashboardSummary() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <Card className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 animate-pulse bg-gray-200 rounded"></div>
            <div className="h-24 animate-pulse bg-gray-200 rounded"></div>
            <div className="h-24 animate-pulse bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate level progression
  const currentLevelPoints = (user.level - 1) * 500;
  const nextLevelPoints = user.level * 500;
  const pointsForNextLevel = nextLevelPoints - user.points;
  const levelProgress = ((user.points - currentLevelPoints) / 500) * 100;

  // Calculate carbon impact progress (assuming monthly goal of 1000kg)
  const carbonGoal = 1000;
  const carbonProgress = (user.carbonSaved / carbonGoal) * 100;

  // Calculate next reward progress
  const nextRewardPoints = 1500;
  const pointsToNextReward = Math.max(0, nextRewardPoints - user.points);
  const rewardProgress = (user.points / nextRewardPoints) * 100;

  // Determine user level title
  const levelTitle = getLevelTitle(user.level);

  return (
    <div className="mb-8">
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-neutral-dark text-sm font-medium">Current Level</span>
            <div className="flex items-center mt-1">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mr-2">
                <span className="font-bold">{user.level}</span>
              </div>
              <span className="font-heading font-bold text-lg">{levelTitle}</span>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-neutral-light rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full progress-animation" 
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral mt-1">
                <span>Level {user.level}</span>
                <span>{user.points.toLocaleString()} / {nextLevelPoints.toLocaleString()} to Level {user.level + 1}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-neutral-dark text-sm font-medium">Carbon Impact</span>
            <div className="flex items-center mt-1">
              <i className="fas fa-cannabis text-success text-2xl mr-2"></i>
              <span className="font-heading font-bold text-lg">{user.carbonSaved} kg</span>
              <span className="text-neutral ml-1">CO₂ saved</span>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-neutral-light rounded-full">
                <div 
                  className="h-2 bg-success rounded-full progress-animation" 
                  style={{ width: `${carbonProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral mt-1">
                <span>This month</span>
                <span>Goal: 1,000 kg</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-neutral-dark text-sm font-medium">Next Reward</span>
            <div className="flex items-center mt-1">
              <i className="fas fa-gift text-accent text-2xl mr-2"></i>
              <span className="font-heading font-bold text-lg">
                {pointsToNextReward > 0 
                  ? `${pointsToNextReward} points needed` 
                  : "Ready to redeem!"}
              </span>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-neutral-light rounded-full">
                <div 
                  className="h-2 bg-accent rounded-full progress-animation" 
                  style={{ width: `${rewardProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral mt-1">
                <span>{user.points.toLocaleString()} points</span>
                <span>{nextRewardPoints.toLocaleString()} points: 15% off eco products</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function getLevelTitle(level: number): string {
  if (level <= 3) return "Eco Starter";
  if (level <= 6) return "Eco Enthusiast";
  if (level <= 9) return "Eco Guardian";
  if (level <= 12) return "Eco Champion";
  if (level <= 15) return "Eco Master";
  return "Eco Legend";
}
