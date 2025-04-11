import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserActivitySchema, insertUserRewardSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get('/api/user', async (req: Request, res: Response) => {
    // In a real app, this would come from auth session
    // Using a default user for demo purposes
    const user = await storage.getUser(1);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(user);
  });
  
  // Activities routes
  app.get('/api/activities', async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    let activities;
    
    if (category) {
      activities = await storage.getActivitiesByCategory(category);
    } else {
      activities = await storage.getAllActivities();
    }
    
    return res.json(activities);
  });
  
  app.post('/api/activities/log', async (req: Request, res: Response) => {
    try {
      const data = insertUserActivitySchema.parse(req.body);
      const userActivity = await storage.logUserActivity(data);
      
      // Check if any achievements should be unlocked
      const userActivities = await storage.getUserActivities(data.userId);
      
      // Get all achievements
      const allAchievements = await storage.getAllAchievements();
      
      // Get user's current achievements
      const userAchievements = await storage.getUserAchievements(data.userId);
      const userAchievementIds = userAchievements.map(ua => ua.achievementId);
      
      // Simple achievement checking logic - this could be more sophisticated in a real app
      const activityCounts = new Map<string, number>();
      userActivities.forEach(ua => {
        const category = ua.activity.category;
        activityCounts.set(category, (activityCounts.get(category) || 0) + 1);
      });
      
      // Check for achievements that should be unlocked
      const newAchievements = [];
      for (const achievement of allAchievements) {
        if (userAchievementIds.includes(achievement.id)) {
          continue; // Already has this achievement
        }
        
        const category = achievement.category;
        const count = activityCounts.get(category) || 0;
        
        // Simple logic - unlock achievement if user has done 3 activities in category
        if (count >= 3) {
          const userAchievement = await storage.unlockUserAchievement({
            userId: data.userId,
            achievementId: achievement.id
          });
          newAchievements.push(userAchievement);
        }
      }
      
      return res.status(201).json({ 
        userActivity,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined 
      });
    } catch (error) {
      return res.status(400).json({ message: 'Invalid data', error });
    }
  });
  
  app.get('/api/activities/user', async (req: Request, res: Response) => {
    // In a real app, this would come from auth session
    // Using a default user for demo purposes
    const userId = 1;
    const userActivities = await storage.getUserActivities(userId);
    return res.json(userActivities);
  });
  
  app.get('/api/activities/recent', async (req: Request, res: Response) => {
    // In a real app, this would come from auth session
    // Using a default user for demo purposes
    const userId = 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const recentActivities = await storage.getRecentUserActivities(userId, limit);
    return res.json(recentActivities);
  });
  
  // Rewards routes
  app.get('/api/rewards', async (req: Request, res: Response) => {
    const rewards = await storage.getAllRewards();
    return res.json(rewards);
  });
  
  app.post('/api/rewards/redeem', async (req: Request, res: Response) => {
    try {
      const data = insertUserRewardSchema.parse(req.body);
      const userReward = await storage.redeemUserReward(data);
      return res.status(201).json(userReward);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(400).json({ message: 'Invalid data' });
    }
  });
  
  app.get('/api/rewards/user', async (req: Request, res: Response) => {
    // In a real app, this would come from auth session
    // Using a default user for demo purposes
    const userId = 1;
    const userRewards = await storage.getUserRewards(userId);
    return res.json(userRewards);
  });
  
  // Achievements routes
  app.get('/api/achievements', async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;
    let achievements;
    
    if (category) {
      achievements = await storage.getAchievementsByCategory(category);
    } else {
      achievements = await storage.getAllAchievements();
    }
    
    return res.json(achievements);
  });
  
  app.get('/api/achievements/user', async (req: Request, res: Response) => {
    // In a real app, this would come from auth session
    // Using a default user for demo purposes
    const userId = 1;
    const userAchievements = await storage.getUserAchievements(userId);
    return res.json(userAchievements);
  });
  
  // Leaderboard route
  app.get('/api/leaderboard', async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await storage.getLeaderboard(limit);
    return res.json(leaderboard);
  });

  const httpServer = createServer(app);
  return httpServer;
}
