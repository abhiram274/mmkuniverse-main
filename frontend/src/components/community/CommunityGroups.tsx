
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TrendingUp, Star, Award, Users, BookOpen, Code, Laptop, Paintbrush, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock community groups data
const COMMUNITY_GROUPS = [
  {
    id: 1,
    name: "Frontend Developers",
    members: 128,
    description: "A group for all frontend developers to share ideas, ask questions, and collaborate on projects.",
    icon: <Globe className="w-8 h-8 text-mmk-purple" />,
    lastActive: "Today",
    category: "Development",
  },
  {
    id: 2,
    name: "AI & Machine Learning",
    members: 96,
    description: "Discussions, resources, and collaborations on all things AI and machine learning.",
    icon: <TrendingUp className="w-8 h-8 text-mmk-amber" />,
    lastActive: "Yesterday",
    category: "Technology",
  },
  {
    id: 3,
    name: "Design Systems",
    members: 73,
    description: "Building and maintaining effective design systems for applications of all sizes.",
    icon: <Star className="w-8 h-8 text-emerald-500" />,
    lastActive: "2 days ago",
    category: "Design",
  },
  {
    id: 4,
    name: "Career Development",
    members: 215,
    description: "Network, share opportunities, and get advice on growing your tech career.",
    icon: <Award className="w-8 h-8 text-blue-500" />,
    lastActive: "Today",
    category: "Career",
  },
  {
    id: 5,
    name: "React Enthusiasts",
    members: 145,
    description: "Everything React - hooks, state management, best practices, and more.",
    icon: <Code className="w-8 h-8 text-blue-400" />,
    lastActive: "Today",
    category: "Development",
  },
  {
    id: 6,
    name: "UX/UI Designers",
    members: 89,
    description: "Share your designs, get feedback, and discuss the latest UX trends.",
    icon: <Paintbrush className="w-8 h-8 text-pink-500" />,
    lastActive: "Yesterday",
    category: "Design",
  },
  {
    id: 7,
    name: "Weekly Study Group",
    members: 52,
    description: "Join our weekly sessions to learn together and solve coding challenges.",
    icon: <BookOpen className="w-8 h-8 text-purple-400" />,
    lastActive: "2 days ago",
    category: "Learning",
  },
  {
    id: 8,
    name: "Tech Talks",
    members: 118,
    description: "Watch and discuss tech presentations, or share your own talks with the community.",
    icon: <Video className="w-8 h-8 text-red-500" />,
    lastActive: "Today",
    category: "Learning",
  },
];

const CommunityGroups = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Community Groups</h3>
        <Button className="bg-mmk-purple hover:bg-mmk-purple/90">
          <Users className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <Badge className="bg-mmk-purple cursor-pointer">All Groups</Badge>
        <Badge variant="outline" className="border-white/20 cursor-pointer">Development</Badge>
        <Badge variant="outline" className="border-white/20 cursor-pointer">Design</Badge>
        <Badge variant="outline" className="border-white/20 cursor-pointer">Technology</Badge>
        <Badge variant="outline" className="border-white/20 cursor-pointer">Career</Badge>
        <Badge variant="outline" className="border-white/20 cursor-pointer">Learning</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COMMUNITY_GROUPS.map((group) => (
          <Card key={group.id} className="bg-secondary/40 border-white/10 hover:border-mmk-purple/60 transition-all overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center">
                    {group.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {group.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400">{group.members} members</p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="border-white/20"
                >
                  Active {group.lastActive}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm line-clamp-2">{group.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="border-white/20 bg-transparent"
              >
                View Group
              </Button>
              <Button 
                className="bg-mmk-purple hover:bg-mmk-purple/90"
              >
                Join Group
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityGroups;
