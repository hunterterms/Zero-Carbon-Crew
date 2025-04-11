import { LeaderboardUser } from "@/lib/types";

interface TopChampionsProps {
  leaders: LeaderboardUser[];
}

export default function TopChampions({ leaders }: TopChampionsProps) {
  // Ensure we have at least 3 users for the top positions
  const top3 = leaders.slice(0, 3);
  
  // If we have less than 3 leaders, we'll fill the rest with placeholders
  while (top3.length < 3) {
    top3.push({
      id: -top3.length,
      username: "???",
      password: "",
      points: 0,
      level: 0,
      carbonSaved: 0,
      createdAt: new Date(),
      rank: top3.length + 1,
      isCurrentUser: false
    });
  }
  
  // Arrange them in order for display: [2nd place, 1st place, 3rd place]
  const [secondPlace, firstPlace, thirdPlace] = [top3[1], top3[0], top3[2]];

  return (
    <div className="bg-neutral-lightest p-6">
      <div className="flex flex-wrap justify-center items-end gap-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center order-1 md:order-1">
          <div className="relative">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${secondPlace.isCurrentUser ? 'bg-primary bg-opacity-20' : 'bg-primary bg-opacity-10'} flex items-center justify-center border-2 border-accent`}>
              <i className="fas fa-user text-primary text-xl"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent-light text-primary-dark rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white">2</div>
          </div>
          <h3 className={`font-heading font-bold mt-2 ${secondPlace.isCurrentUser ? 'text-primary' : ''}`}>
            {secondPlace.username === "???" ? secondPlace.username : secondPlace.username.split(' ')[0]}
          </h3>
          <div className="flex items-center">
            <i className="fas fa-star text-accent text-sm mr-1"></i>
            <span className="font-bold">{secondPlace.points.toLocaleString()}</span>
          </div>
        </div>
        
        {/* 1st Place */}
        <div className="flex flex-col items-center order-0 md:order-0 transform translate-y-2">
          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mb-1">
            <i className="fas fa-crown text-white text-xs"></i>
          </div>
          <div className="relative">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${firstPlace.isCurrentUser ? 'bg-primary bg-opacity-20' : 'bg-primary bg-opacity-10'} flex items-center justify-center border-2 border-accent`}>
              <i className="fas fa-user text-primary text-2xl"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent text-primary-dark rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white">1</div>
          </div>
          <h3 className={`font-heading font-bold mt-2 ${firstPlace.isCurrentUser ? 'text-primary' : ''}`}>
            {firstPlace.username === "???" ? firstPlace.username : firstPlace.username.split(' ')[0]}
          </h3>
          <div className="flex items-center">
            <i className="fas fa-star text-accent text-sm mr-1"></i>
            <span className="font-bold">{firstPlace.points.toLocaleString()}</span>
          </div>
        </div>
        
        {/* 3rd Place */}
        <div className="flex flex-col items-center order-2 md:order-2">
          <div className="relative">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${thirdPlace.isCurrentUser ? 'bg-primary bg-opacity-20' : 'bg-primary bg-opacity-10'} flex items-center justify-center border-2 border-accent`}>
              <i className="fas fa-user text-primary text-xl"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-accent-light text-primary-dark rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white">3</div>
          </div>
          <h3 className={`font-heading font-bold mt-2 ${thirdPlace.isCurrentUser ? 'text-primary' : ''}`}>
            {thirdPlace.username === "???" ? thirdPlace.username : thirdPlace.username.split(' ')[0]}
          </h3>
          <div className="flex items-center">
            <i className="fas fa-star text-accent text-sm mr-1"></i>
            <span className="font-bold">{thirdPlace.points.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
