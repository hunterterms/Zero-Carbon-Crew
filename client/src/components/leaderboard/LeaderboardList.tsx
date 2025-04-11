import { LeaderboardUser } from "@/lib/types";

interface LeaderboardListProps {
  users: LeaderboardUser[];
  startRank: number;
}

export default function LeaderboardList({ users, startRank }: LeaderboardListProps) {
  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-dark">
        <p>No more users to display on the leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        {users.map((user, index) => (
          <div 
            key={user.id} 
            className={`py-3 border-b border-neutral-light last:border-b-0 flex justify-between items-center ${
              user.isCurrentUser ? 'bg-primary bg-opacity-5' : ''
            }`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 ${
                user.isCurrentUser ? 'bg-primary' : 'bg-primary-light'
              } rounded-full text-white flex items-center justify-center font-bold mr-3`}>
                {startRank + index}
              </div>
              <div className={`w-10 h-10 rounded-full ${
                user.isCurrentUser ? 'bg-primary bg-opacity-20' : 'bg-primary bg-opacity-10'
              } flex items-center justify-center mr-3`}>
                <i className="fas fa-user text-primary"></i>
              </div>
              <div>
                <h4 className="font-medium">{user.isCurrentUser ? 'You' : user.username}</h4>
                <div className="flex items-center text-sm">
                  <i className="fas fa-leaf text-success text-xs mr-1"></i>
                  <span className="text-neutral">{user.carbonSaved} kg CO₂ saved</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fas fa-star text-accent mr-1"></i>
              <span className="font-bold">{user.points.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
