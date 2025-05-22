
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Calendar, CircleUserRound, Trophy, Star, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

// Mock data for the current user's membership
const USER_MEMBERSHIP = {
  name: "Alex Johnson",
  avatar: "https://ui-avatars.com/api/?name=AJ&background=8B5CF6&color=fff",
  role: "Contributor",
  level: "Gold",
  joinDate: new Date(2024, 2, 15), // March 15, 2024
  points: 1250,
  pointsToNextLevel: 1500,
  badges: 14,
  contributions: 47,
};

const MembershipCard = () => {
  const progressPercentage = (USER_MEMBERSHIP.points / USER_MEMBERSHIP.pointsToNextLevel) * 100;
  
  return (
    <Card className="bg-secondary/40 border-white/10 overflow-hidden">
      <CardHeader className="relative pb-0">
        <div className="absolute -top-6 -right-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mmk-purple to-mmk-amber opacity-20 blur-xl" />
        </div>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <CircleUserRound className="w-5 h-5 mr-2 text-mmk-purple" />
            My Membership
          </CardTitle>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-mmk-amber to-mmk-purple/80 text-white text-xs font-medium">
            {USER_MEMBERSHIP.level} Level
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-mmk-purple/30">
            <AvatarImage src={USER_MEMBERSHIP.avatar} alt={USER_MEMBERSHIP.name} />
            <AvatarFallback>{USER_MEMBERSHIP.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold flex items-center">
              {USER_MEMBERSHIP.name}
              <BadgeCheck className="w-4 h-4 ml-1 text-mmk-purple" />
            </h3>
            <p className="text-sm text-gray-400">{USER_MEMBERSHIP.role}</p>
            
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              Member since {format(USER_MEMBERSHIP.joinDate, "MMMM yyyy")}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Contribution Points</span>
            <span className="font-semibold text-mmk-purple">{USER_MEMBERSHIP.points} / {USER_MEMBERSHIP.pointsToNextLevel}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-mmk-purple to-mmk-amber" />
          <p className="text-xs text-gray-400 text-right">
            {Math.round(USER_MEMBERSHIP.pointsToNextLevel - USER_MEMBERSHIP.points)} points to Platinum level
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-3 rounded-lg bg-white/5 flex flex-col items-center">
            <div className="mb-1 bg-mmk-purple/20 w-8 h-8 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-mmk-purple" />
            </div>
            <p className="text-xl font-bold text-mmk-purple">{USER_MEMBERSHIP.badges}</p>
            <p className="text-xs text-gray-400">Badges Earned</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5 flex flex-col items-center">
            <div className="mb-1 bg-mmk-amber/20 w-8 h-8 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-mmk-amber" />
            </div>
            <p className="text-xl font-bold text-mmk-amber">{USER_MEMBERSHIP.contributions}</p>
            <p className="text-xs text-gray-400">Contributions</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button className="w-full bg-mmk-purple hover:bg-mmk-purple/90">
          View Full Profile
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-white/20 bg-transparent hover:bg-white/10"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MembershipCard;
