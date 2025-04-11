import { 
  users, type User, type InsertUser,
  activities, type Activity, type InsertActivity,
  userActivities, type UserActivity, type InsertUserActivity,
  rewards, type Reward, type InsertReward,
  userRewards, type UserReward, type InsertUserReward,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, pointsToAdd: number): Promise<User>;
  updateUserCarbonSaved(userId: number, carbonToAdd: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByCategory(category: string): Promise<Activity[]>;
  
  // User Activity operations
  logUserActivity(userActivity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: number): Promise<(UserActivity & { activity: Activity })[]>;
  getRecentUserActivities(userId: number, limit: number): Promise<(UserActivity & { activity: Activity })[]>;
  
  // Reward operations
  getReward(id: number): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
  getAllRewards(): Promise<Reward[]>;
  
  // User Reward operations
  redeemUserReward(userReward: InsertUserReward): Promise<UserReward>;
  getUserRewards(userId: number): Promise<(UserReward & { reward: Reward })[]>;
  
  // Achievement operations
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAllAchievements(): Promise<Achievement[]>;
  getAchievementsByCategory(category: string): Promise<Achievement[]>;
  
  // User Achievement operations
  unlockUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  
  // Leaderboard operations
  getLeaderboard(limit: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activities: Map<number, Activity>;
  private userActivities: UserActivity[];
  private rewards: Map<number, Reward>;
  private userRewards: UserReward[];
  private achievements: Map<number, Achievement>;
  private userAchievements: UserAchievement[];
  
  private currentUserId: number;
  private currentActivityId: number;
  private currentUserActivityId: number;
  private currentRewardId: number;
  private currentUserRewardId: number;
  private currentAchievementId: number;
  private currentUserAchievementId: number;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.userActivities = [];
    this.rewards = new Map();
    this.userRewards = [];
    this.achievements = new Map();
    this.userAchievements = [];
    
    this.currentUserId = 1;
    this.currentActivityId = 1;
    this.currentUserActivityId = 1;
    this.currentRewardId = 1;
    this.currentUserRewardId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create a default user
    this.createUser({ 
      username: "demo", 
      password: "password",
      points: 1250,
      level: 8,
      carbonSaved: 350
    });
    
    // Create activities
    const activities = [
      {
        title: "Cycle to Work",
        description: "Commute by bicycle instead of driving. Track your trips to earn points.",
        points: 50,
        carbonSaved: 3,
        icon: "bicycle",
        category: "Transportation"
      },
      {
        title: "Energy Savings",
        description: "Reduce your home energy usage by 10% compared to last month.",
        points: 30,
        carbonSaved: 45,
        icon: "lightbulb",
        category: "Energy"
      },
      {
        title: "Meatless Monday",
        description: "Skip meat for a day and choose plant-based options instead.",
        points: 25,
        carbonSaved: 8,
        icon: "utensils",
        category: "Food"
      },
      {
        title: "Proper Recycling",
        description: "Correctly sort and recycle your waste for a week.",
        points: 15,
        carbonSaved: 5,
        icon: "recycle",
        category: "Waste"
      },
      {
        title: "Reusable Shopping Bags",
        description: "Use your own bags for shopping instead of plastic bags.",
        points: 10,
        carbonSaved: 1,
        icon: "shopping-bag",
        category: "Waste"
      },
      {
        title: "Plant a Tree",
        description: "Plant a tree or donate to a tree-planting organization.",
        points: 100,
        carbonSaved: 25,
        icon: "seedling",
        category: "Nature"
      }
    ];
    
    activities.forEach(activity => {
      this.createActivity(activity);
    });
    
    // Create rewards
    const rewards = [
      {
        title: "15% Off Eco Products",
        description: "Get 15% off your next purchase at our partner eco-friendly stores.",
        pointsCost: 1500,
        icon: "shopping-bag",
        available: true
      },
      {
        title: "Plant 10 Trees",
        description: "We'll plant 10 trees in your name through our partnership with reforestation projects.",
        pointsCost: 2500,
        icon: "tree",
        available: true
      },
      {
        title: "Solar Power Discount",
        description: "Receive a $100 discount on home solar panel installation from our partner providers.",
        pointsCost: 5000,
        icon: "solar-panel",
        available: true
      },
      {
        title: "Eco-Friendly T-shirt",
        description: "Get a free organic cotton t-shirt made from sustainable materials.",
        pointsCost: 1000,
        icon: "tshirt",
        available: true
      }
    ];
    
    rewards.forEach(reward => {
      this.createReward(reward);
    });
    
    // Create achievements
    const achievements = [
      {
        title: "Cycle Champion",
        description: "Bike 50km in a month",
        icon: "bicycle",
        category: "Transportation",
        requirement: "Cycle 50km"
      },
      {
        title: "Public Transit Pro",
        description: "Use public transit 20 times",
        icon: "bus",
        category: "Transportation",
        requirement: "Use transit 20 times"
      },
      {
        title: "Walking Warrior",
        description: "Walk 100,000 steps",
        icon: "walking",
        category: "Transportation",
        requirement: "Walk 100k steps"
      },
      {
        title: "Light Switch",
        description: "Switch to LED bulbs",
        icon: "lightbulb",
        category: "Energy",
        requirement: "Replace 10 bulbs"
      },
      {
        title: "Solar Pioneer",
        description: "Install solar panels",
        icon: "solar-panel",
        category: "Energy",
        requirement: "Install solar"
      },
      {
        title: "Recycling Rookie",
        description: "Recycle for 1 month straight",
        icon: "recycle",
        category: "Waste",
        requirement: "Recycle for 30 days"
      },
      {
        title: "Plastic Avoider",
        description: "Use reusable bags 10 times",
        icon: "shopping-bag",
        category: "Waste",
        requirement: "Use reusable bags 10x"
      },
      {
        title: "Zero Waste Hero",
        description: "Reduce waste by 80%",
        icon: "trash-alt",
        category: "Waste",
        requirement: "Reduce waste 80%"
      }
    ];
    
    achievements.forEach(achievement => {
      this.createAchievement(achievement);
    });
    
    // Log some user activities for demo user
    this.logUserActivity({ userId: 1, activityId: 1 });
    this.logUserActivity({ userId: 1, activityId: 3 });
    this.logUserActivity({ userId: 1, activityId: 4 });
    
    // Add some user achievements for demo user
    this.unlockUserAchievement({ userId: 1, achievementId: 1 });
    this.unlockUserAchievement({ userId: 1, achievementId: 4 });
    this.unlockUserAchievement({ userId: 1, achievementId: 6 });
    this.unlockUserAchievement({ userId: 1, achievementId: 7 });
    
    // Add more users for the leaderboard
    this.createUser({
      username: "Alex M.",
      password: "password",
      points: 3250,
      level: 12,
      carbonSaved: 450
    });
    
    this.createUser({
      username: "Emma S.",
      password: "password",
      points: 2865,
      level: 11,
      carbonSaved: 380
    });
    
    this.createUser({
      username: "Josh K.",
      password: "password",
      points: 2430,
      level: 10,
      carbonSaved: 320
    });
    
    this.createUser({
      username: "Sarah J.",
      password: "password",
      points: 2180,
      level: 9,
      carbonSaved: 210
    });
    
    this.createUser({
      username: "Mike T.",
      password: "password",
      points: 1970,
      level: 9,
      carbonSaved: 198
    });
    
    this.createUser({
      username: "Ana R.",
      password: "password",
      points: 1170,
      level: 7,
      carbonSaved: 132
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserPoints(userId: number, pointsToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    user.points += pointsToAdd;
    
    // Update level based on points (simple algorithm)
    user.level = Math.floor(user.points / 500) + 1;
    
    this.users.set(userId, user);
    return user;
  }
  
  async updateUserCarbonSaved(userId: number, carbonToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    user.carbonSaved += carbonToAdd;
    this.users.set(userId, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }
  
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }
  
  async getActivitiesByCategory(category: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.category === category
    );
  }
  
  // User Activity operations
  async logUserActivity(userActivity: InsertUserActivity): Promise<UserActivity> {
    const id = this.currentUserActivityId++;
    const now = new Date();
    const newUserActivity: UserActivity = { ...userActivity, id, completedAt: now };
    this.userActivities.push(newUserActivity);
    
    // Update user points and carbon saved
    const activity = await this.getActivity(userActivity.activityId);
    if (activity) {
      await this.updateUserPoints(userActivity.userId, activity.points);
      await this.updateUserCarbonSaved(userActivity.userId, activity.carbonSaved);
    }
    
    return newUserActivity;
  }
  
  async getUserActivities(userId: number): Promise<(UserActivity & { activity: Activity })[]> {
    return this.userActivities
      .filter((ua) => ua.userId === userId)
      .map((ua) => {
        const activity = this.activities.get(ua.activityId);
        if (!activity) {
          throw new Error(`Activity with ID ${ua.activityId} not found`);
        }
        return { ...ua, activity };
      })
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }
  
  async getRecentUserActivities(userId: number, limit: number): Promise<(UserActivity & { activity: Activity })[]> {
    const activities = await this.getUserActivities(userId);
    return activities.slice(0, limit);
  }
  
  // Reward operations
  async getReward(id: number): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }
  
  async createReward(reward: InsertReward): Promise<Reward> {
    const id = this.currentRewardId++;
    const newReward: Reward = { ...reward, id };
    this.rewards.set(id, newReward);
    return newReward;
  }
  
  async getAllRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }
  
  // User Reward operations
  async redeemUserReward(userReward: InsertUserReward): Promise<UserReward> {
    const user = await this.getUser(userReward.userId);
    const reward = await this.getReward(userReward.rewardId);
    
    if (!user) {
      throw new Error(`User with ID ${userReward.userId} not found`);
    }
    
    if (!reward) {
      throw new Error(`Reward with ID ${userReward.rewardId} not found`);
    }
    
    if (user.points < reward.pointsCost) {
      throw new Error(`User does not have enough points to redeem this reward`);
    }
    
    // Deduct points from user
    await this.updateUserPoints(user.id, -reward.pointsCost);
    
    // Record the redemption
    const id = this.currentUserRewardId++;
    const now = new Date();
    const newUserReward: UserReward = { ...userReward, id, redeemedAt: now };
    this.userRewards.push(newUserReward);
    
    return newUserReward;
  }
  
  async getUserRewards(userId: number): Promise<(UserReward & { reward: Reward })[]> {
    return this.userRewards
      .filter((ur) => ur.userId === userId)
      .map((ur) => {
        const reward = this.rewards.get(ur.rewardId);
        if (!reward) {
          throw new Error(`Reward with ID ${ur.rewardId} not found`);
        }
        return { ...ur, reward };
      })
      .sort((a, b) => b.redeemedAt.getTime() - a.redeemedAt.getTime());
  }
  
  // Achievement operations
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }
  
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async getAchievementsByCategory(category: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.category === category
    );
  }
  
  // User Achievement operations
  async unlockUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    // Check if user already has this achievement
    const existingAchievement = this.userAchievements.find(
      (ua) => ua.userId === userAchievement.userId && ua.achievementId === userAchievement.achievementId
    );
    
    if (existingAchievement) {
      return existingAchievement;
    }
    
    const id = this.currentUserAchievementId++;
    const now = new Date();
    const newUserAchievement: UserAchievement = { ...userAchievement, id, earnedAt: now };
    this.userAchievements.push(newUserAchievement);
    
    // Award bonus points for achievements (50 per achievement)
    await this.updateUserPoints(userAchievement.userId, 50);
    
    return newUserAchievement;
  }
  
  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    return this.userAchievements
      .filter((ua) => ua.userId === userId)
      .map((ua) => {
        const achievement = this.achievements.get(ua.achievementId);
        if (!achievement) {
          throw new Error(`Achievement with ID ${ua.achievementId} not found`);
        }
        return { ...ua, achievement };
      })
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  }
  
  // Leaderboard operations
  async getLeaderboard(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
