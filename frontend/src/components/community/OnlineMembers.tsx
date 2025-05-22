
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi } from "lucide-react";

// Mock data for online members
const ONLINE_MEMBERS = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "https://ui-avatars.com/api/?name=SC&background=8B5CF6&color=fff",
    status: "Teaching React Workshop",
    role: "Instructor",
  },
  {
    id: 2,
    name: "Miguel Rodriguez",
    avatar: "https://ui-avatars.com/api/?name=MR&background=F59E0B&color=fff",
    status: "In Study Group",
    role: "Student",
  },
  {
    id: 3,
    name: "Amina Patel",
    avatar: "https://ui-avatars.com/api/?name=AP&background=10B981&color=fff",
    status: "Available to Chat",
    role: "Mentor",
  },
  {
    id: 4,
    name: "Jackson Lee",
    avatar: "https://ui-avatars.com/api/?name=JL&background=EF4444&color=fff",
    status: "Coding Challenge",
    role: "Student",
  },
  {
    id: 5,
    name: "Nia Williams",
    avatar: "https://ui-avatars.com/api/?name=NW&background=6366F1&color=fff",
    status: "Project Collaboration",
    role: "Developer",
  },
  {
    id: 6,
    name: "Raj Kumar",
    avatar: "https://ui-avatars.com/api/?name=RK&background=EC4899&color=fff",
    status: "Available to Chat",
    role: "Student",
  },
];

const OnlineMembers = () => {
  return (
    <Card className="bg-secondary/40 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Wifi className="w-4 h-4 mr-2 text-green-500 animate-pulse" />
          Who's Online
        </CardTitle>
        <p className="text-sm text-gray-400">{ONLINE_MEMBERS.length} members active now</p>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[320px] overflow-y-auto scrollbar-none">
        {ONLINE_MEMBERS.map((member) => (
          <div key={member.id} className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="relative">
              <Avatar className="w-10 h-10 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{member.name}</p>
              <p className="text-xs text-gray-400 truncate">{member.status}</p>
            </div>
            <Badge variant="outline" className="text-xs border-white/20 group-hover:border-mmk-purple/50 transition-colors">
              {member.role}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OnlineMembers;
