import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Activity } from "@shared/schema";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import ActivityCard from "@/components/activities/ActivityCard";
import RecentActivity from "@/components/activities/RecentActivity";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Activities() {
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });
  
  // Filter activities by category
  const filteredActivities = activities?.filter(activity => 
    categoryFilter === "All" || activity.category === categoryFilter
  );
  
  // Get unique categories for filter dropdown
  const categories = activities 
    ? ["All", ...new Set(activities.map(activity => activity.category))]
    : ["All"];

  return (
    <>
      <DashboardSummary />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-bold text-xl text-neutral-darkest">Carbon-Reducing Activities</h2>
        <div className="flex items-center">
          <span className="text-neutral-dark mr-2">Filter:</span>
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Activities" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoadingActivities ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-64 animate-pulse">
              <div className="h-16 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredActivities && filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              userId={user?.id || 1} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <i className="fas fa-leaf text-primary text-5xl mb-4"></i>
          <h3 className="font-heading font-bold text-lg mb-2">No Activities Found</h3>
          <p className="text-neutral-dark">
            {categoryFilter !== "All" 
              ? `No activities found in the ${categoryFilter} category. Try another category.` 
              : "No activities available at the moment. Check back soon!"}
          </p>
        </div>
      )}
      
      <RecentActivity />
    </>
  );
}
