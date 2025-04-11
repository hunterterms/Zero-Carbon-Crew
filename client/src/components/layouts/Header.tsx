import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

function UserPointsDisplay({ points }: { points: number }) {
  return (
    <div className="bg-white bg-opacity-20 rounded-full py-1 px-4 flex items-center">
      <i className="fas fa-star text-accent mr-2"></i>
      <span className="text-white font-bold">{points.toLocaleString()}</span>
      <span className="text-white ml-1">points</span>
    </div>
  );
}

export default function Header() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-cannabis text-white text-2xl mr-2"></i>
          <h1 className="text-white font-heading font-bold text-xl md:text-2xl">EcoPoints</h1>
        </div>
        <div className="flex items-center">
          {isLoading ? (
            <div className="bg-white bg-opacity-20 rounded-full py-1 px-4 animate-pulse">
              <span className="text-white">Loading...</span>
            </div>
          ) : user ? (
            <UserPointsDisplay points={user.points} />
          ) : (
            <UserPointsDisplay points={0} />
          )}
          <div className="ml-4 relative group">
            <button className="flex items-center focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-neutral-lightest flex items-center justify-center">
                <i className="fas fa-user text-primary"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
