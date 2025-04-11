import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ActivityWithStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ActivityCardProps {
  activity: Activity;
  userId: number;
}

export default function ActivityCard({ activity, userId }: ActivityCardProps) {
  const [status, setStatus] = useState<ActivityWithStatus>({ ...activity });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logActivityMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/activities/log", {
        userId,
        activityId: activity.id,
      });
    },
    onMutate: () => {
      setStatus(prev => ({ ...prev, isLogging: true }));
    },
    onSuccess: async (response) => {
      const data = await response.json();
      
      setStatus(prev => ({ 
        ...prev, 
        isLogging: false, 
        isLogged: true 
      }));
      
      toast({
        title: "Activity Logged!",
        description: `You earned ${activity.points} points and saved ${activity.carbonSaved} kg of CO₂`,
      });
      
      // If new achievements were unlocked
      if (data.newAchievements && data.newAchievements.length > 0) {
        setTimeout(() => {
          toast({
            title: "New Achievement Unlocked!",
            description: "Check your achievements page to see what you earned!",
          });
        }, 1000);
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements/user'] });
    },
    onError: (error) => {
      setStatus(prev => ({ ...prev, isLogging: false }));
      toast({
        title: "Failed to log activity",
        description: "Please try again later",
        variant: "destructive",
      });
      console.error("Log activity error:", error);
    },
    onSettled: () => {
      // After 3 seconds, reset the logged state
      setTimeout(() => {
        setStatus(prev => ({ ...prev, isLogged: false }));
      }, 3000);
    }
  });

  const handleLogActivity = () => {
    if (!status.isLogging && !status.isLogged) {
      logActivityMutation.mutate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden card-hover">
      <div className="bg-primary-light p-3 text-white flex justify-between items-center">
        <div className="flex items-center">
          <i className={`fas fa-${activity.icon} text-2xl`}></i>
          <h3 className="font-heading font-semibold ml-2">{activity.title}</h3>
        </div>
        <div className="bg-white text-primary-dark font-bold rounded-full px-2 py-1 text-sm">
          +{activity.points} pts
        </div>
      </div>
      <div className="p-4">
        <p className="text-neutral-dark mb-3">{activity.description}</p>
        <div className="flex items-center text-sm text-neutral">
          <i className="fas fa-cannabis mr-1 text-success"></i>
          <span>Saves ~{activity.carbonSaved} kg CO₂</span>
        </div>
        <button 
          className={`mt-3 w-full py-2 rounded-md font-medium transition-colors ${
            status.isLogged 
              ? "bg-success text-white" 
              : status.isLogging 
                ? "bg-primary-light text-white" 
                : "bg-primary text-white hover:bg-primary-dark"
          }`}
          onClick={handleLogActivity}
          disabled={status.isLogging || status.isLogged}
        >
          {status.isLogged ? "Logged!" : status.isLogging ? "Logging..." : 
           activity.icon === "seedling" ? "Upload Proof" : 
           activity.icon === "lightbulb" ? "Submit Energy Bill" : 
           "Log Activity"}
        </button>
      </div>
    </div>
  );
}
