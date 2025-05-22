
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, BookOpen, Calendar, HeartHandshake, MessageSquare, Sparkles, Trophy } from "lucide-react";

// Mock data for featured member
const FEATURED_MEMBER = {
  id: 1,
  name: "Elena Kowalski",
  title: "Full Stack Developer",
  avatar: "https://ui-avatars.com/api/?name=EK&background=F59E0B&color=fff",
  bio: "Passionate about teaching web development and building accessible user interfaces. Currently working on open-source projects and mentoring new developers.",
  achievements: [
    { id: 1, name: "Top Contributor", icon: <Trophy className="w-4 h-4 text-yellow-500" /> },
    { id: 2, name: "Workshop Host", icon: <Calendar className="w-4 h-4 text-blue-500" /> },
    { id: 3, name: "Code Mentor", icon: <BookOpen className="w-4 h-4 text-green-500" /> },
  ],
  stats: {
    contributions: 147,
    helped: 53,
    events: 12,
  }
};

const MemberSpotlight = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-secondary/40 border-white/10 overflow-hidden">
        <CardHeader className="relative pb-0">
          <div className="absolute -top-6 -right-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mmk-purple to-mmk-amber opacity-20 blur-xl" />
          </div>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-mmk-amber" />
              Member Spotlight
            </CardTitle>
            <Badge className="bg-mmk-amber/20 hover:bg-mmk-amber/30 text-mmk-amber">
              Featured
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-mmk-purple/30">
              <AvatarImage src={FEATURED_MEMBER.avatar} alt={FEATURED_MEMBER.name} />
              <AvatarFallback>{FEATURED_MEMBER.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold flex items-center">
                {FEATURED_MEMBER.name}
                <BadgeCheck className="w-4 h-4 ml-1 text-mmk-purple" />
              </h3>
              <p className="text-sm text-gray-400">{FEATURED_MEMBER.title}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-300">{FEATURED_MEMBER.bio}</p>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-2 rounded-lg bg-white/5">
              <p className="text-xl font-bold text-mmk-purple">{FEATURED_MEMBER.stats.contributions}</p>
              <p className="text-xs text-gray-400">Contributions</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <p className="text-xl font-bold text-mmk-purple">{FEATURED_MEMBER.stats.helped}</p>
              <p className="text-xs text-gray-400">Helped</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <p className="text-xl font-bold text-mmk-purple">{FEATURED_MEMBER.stats.events}</p>
              <p className="text-xs text-gray-400">Events</p>
            </div>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {FEATURED_MEMBER.achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full text-xs"
                >
                  {achievement.icon}
                  {achievement.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button 
            variant="ghost" 
            className="text-mmk-purple hover:bg-mmk-purple/10 p-0 h-auto"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button 
            variant="ghost" 
            className="text-mmk-purple hover:bg-mmk-purple/10 p-0 h-auto"
          >
            <HeartHandshake className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </CardFooter>
      </Card>
      
      {/* Community Achievements Card */}
      <Card className="bg-secondary/40 border-white/10 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-mmk-amber" />
            Community Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-white/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-mmk-purple/20 to-mmk-amber/20 rounded-md flex items-center justify-center">
              <Calendar className="w-5 h-5 text-mmk-amber" />
            </div>
            <div>
              <p className="font-medium text-sm">Community Milestone</p>
              <p className="text-xs text-gray-400">5,000 members joined</p>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-white/5 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-mmk-purple/20 to-mmk-amber/20 rounded-md flex items-center justify-center">
              <Trophy className="w-5 h-5 text-mmk-purple" />
            </div>
            <div>
              <p className="font-medium text-sm">Hackathon Winners</p>
              <p className="text-xs text-gray-400">Team BuilderX took first place</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberSpotlight;
