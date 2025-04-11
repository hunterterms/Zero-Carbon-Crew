import { User, Activity, UserActivity, Reward, UserReward, Achievement, UserAchievement } from "@shared/schema";

export type TabType = 'activities' | 'leaderboard' | 'rewards' | 'achievements';

export type ActivityWithStatus = Activity & {
  isLogging?: boolean;
  isLogged?: boolean;
};

export type RewardWithProgress = Reward & {
  isRedeemable: boolean;
  progress: number;
  pointsNeeded: number;
};

export type AchievementWithStatus = Achievement & {
  isUnlocked: boolean;
};

export type LeaderboardUser = User & {
  rank: number;
  isCurrentUser: boolean;
};

export type RecentActivityItem = UserActivity & {
  activity: Activity;
};

export type RedeemedRewardItem = UserReward & {
  reward: Reward;
};

export type UserAchievementItem = UserAchievement & {
  achievement: Achievement;
};
