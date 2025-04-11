import { useQuery } from "@tanstack/react-query";
import { RedeemedRewardItem } from "@/lib/types";
import { format } from "date-fns";

export default function RedeemedRewards() {
  const { data: redeemedRewards, isLoading } = useQuery<RedeemedRewardItem[]>({
    queryKey: ['/api/rewards/user'],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest mb-4">Your Redeemed Rewards</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!redeemedRewards || redeemedRewards.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest mb-4">Your Redeemed Rewards</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 text-center text-neutral-dark">
            <p>You haven't redeemed any rewards yet. Start earning points to claim rewards!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="font-heading font-bold text-xl text-neutral-darkest mb-4">Your Redeemed Rewards</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col">
            {redeemedRewards.map((redeemedReward) => (
              <div key={redeemedReward.id} className="py-3 border-b border-neutral-light last:border-b-0 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                    <i className={`fas fa-${redeemedReward.reward.icon}`}></i>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{redeemedReward.reward.title}</h4>
                    <span className="text-sm text-neutral">
                      Redeemed on {format(new Date(redeemedReward.redeemedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="text-success font-medium">
                  <i className="fas fa-check-circle mr-1"></i>
                  Claimed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
