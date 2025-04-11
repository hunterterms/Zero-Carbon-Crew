import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Reward } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RewardWithProgress } from "@/lib/types";

interface RewardCardProps {
  reward: RewardWithProgress;
  userId: number;
}

export default function RewardCard({ reward, userId }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [showError, setShowError] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const redeemRewardMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/rewards/redeem", {
        userId,
        rewardId: reward.id,
      });
    },
    onMutate: () => {
      setIsRedeeming(true);
    },
    onSuccess: async () => {
      setIsRedeeming(false);
      setIsRedeemed(true);
      
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed: ${reward.title}`,
        variant: "success",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/user'] });
    },
    onError: (error) => {
      setIsRedeeming(false);
      setShowError(true);
      
      toast({
        title: "Failed to redeem reward",
        description: error instanceof Error ? error.message : "You don't have enough points",
        variant: "destructive",
      });
      
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
  });

  const handleRedeemReward = () => {
    if (!isRedeeming && !isRedeemed && reward.isRedeemable) {
      redeemRewardMutation.mutate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden card-hover">
      <div className="h-40 bg-primary-light flex items-center justify-center p-4">
        <i className={`fas fa-${reward.icon} text-white text-5xl`}></i>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-heading font-semibold">{reward.title}</h3>
          <div className="flex items-center">
            <i className="fas fa-star text-accent mr-1"></i>
            <span className="font-bold">{reward.pointsCost.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-neutral-dark text-sm mb-3">{reward.description}</p>
        <div className="mt-2">
          <div className="h-2 bg-neutral-light rounded-full">
            <div 
              className={`h-2 rounded-full progress-animation ${
                showError ? 'bg-destructive' : 
                reward.isRedeemable ? 'bg-success' : 'bg-accent'
              }`} 
              style={{ width: `${reward.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className={reward.isRedeemable ? 'text-success' : 'text-neutral'}>
              You have: {reward.pointsCost - reward.pointsNeeded} points
            </span>
            <span className={reward.isRedeemable ? 'text-success' : 'text-neutral'}>
              {reward.isRedeemable ? 
                `${reward.pointsCost} / ${reward.pointsCost}` : 
                `${reward.pointsNeeded} points needed`}
            </span>
          </div>
        </div>
        <button 
          className={`mt-4 w-full py-2 rounded-md font-medium transition-colors ${
            isRedeemed ? 
              'bg-success text-white' : 
            isRedeeming ? 
              'bg-primary-light text-white' : 
            reward.isRedeemable ? 
              'bg-success text-white hover:bg-green-700' : 
              'border border-primary text-primary hover:bg-primary hover:text-white'
          }`}
          onClick={handleRedeemReward}
          disabled={isRedeeming || isRedeemed || !reward.isRedeemable}
        >
          {isRedeemed ? 'Redeemed!' : 
           isRedeeming ? 'Processing...' : 
           reward.isRedeemable ? 'Redeem Now' : 
           'Claim Reward'}
        </button>
      </div>
    </div>
  );
}
