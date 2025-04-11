import { useQuery } from "@tanstack/react-query";
import { RecentActivityItem } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<RecentActivityItem[]>({
    queryKey: ['/api/activities/recent'],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest mb-4">Your Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest mb-4">Your Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 text-center text-neutral-dark">
            <p>No activities logged yet. Start tracking your eco-friendly actions!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="font-heading font-bold text-xl text-neutral-darkest mb-4">Your Recent Activity</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col">
            {activities.map((activity) => (
              <div key={activity.id} className="py-3 border-b border-neutral-light last:border-b-0 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white">
                    <i className={`fas fa-${activity.activity.icon}`}></i>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{activity.activity.title}</h4>
                    <span className="text-sm text-neutral">
                      {formatDistanceToNow(new Date(activity.completedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="text-primary font-bold">+{activity.activity.points} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
