import { Achievement } from "@shared/schema";

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export default function AchievementBadge({ achievement, isUnlocked }: AchievementBadgeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-2 ${
        isUnlocked ? 'badge-earned bg-primary-light' : 'badge-locked bg-neutral-light'
      }`}>
        <i className={`fas fa-${achievement.icon} text-white text-2xl`}></i>
      </div>
      <h4 className="font-medium text-center text-sm">{achievement.title}</h4>
      <span className="text-xs text-neutral text-center">{achievement.description}</span>
    </div>
  );
}
