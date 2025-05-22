
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, Heart, Award, BookOpen, Video, 
  Calendar, UserPlus, Share2, Star, ThumbsUp 
} from "lucide-react";
import { format } from "date-fns";

// Mock data for activity feed
const ACTIVITY_FEED = [
  {
    id: 1,
    user: {
      name: "Miguel Rodriguez",
      avatar: "https://ui-avatars.com/api/?name=MR&background=F59E0B&color=fff",
    },
    type: "post",
    content: "Just finished my first React project! Check out my portfolio site built with React, Tailwind, and TypeScript.",
    timestamp: new Date(2025, 3, 7, 10, 15),
    likes: 24,
    comments: 6,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    user: {
      name: "Amina Patel",
      avatar: "https://ui-avatars.com/api/?name=AP&background=10B981&color=fff",
    },
    type: "event",
    content: "I'm hosting a workshop on 'Advanced CSS Techniques' next Friday at 5 PM. Space is limited, so sign up soon!",
    timestamp: new Date(2025, 3, 7, 9, 30),
    likes: 18,
    comments: 3,
    eventDate: new Date(2025, 3, 12, 17, 0)
  },
  {
    id: 3,
    user: {
      name: "Sarah Chen",
      avatar: "https://ui-avatars.com/api/?name=SC&background=8B5CF6&color=fff",
    },
    type: "achievement",
    content: "Just earned the 'Code Mentor' badge for helping 25+ community members with their coding problems!",
    timestamp: new Date(2025, 3, 6, 16, 45),
    likes: 32,
    comments: 8,
    achievement: "Code Mentor",
    achievementIcon: <BookOpen className="h-5 w-5 text-mmk-purple" />
  },
  {
    id: 4,
    user: {
      name: "Jackson Lee",
      avatar: "https://ui-avatars.com/api/?name=JL&background=EF4444&color=fff",
    },
    type: "resource",
    content: "Shared a new resource: 'The Complete Guide to Modern JavaScript' - really helpful for understanding ES6+ features.",
    timestamp: new Date(2025, 3, 6, 14, 20),
    likes: 12,
    comments: 2,
    link: "https://example.com/javascript-guide"
  },
  {
    id: 5,
    user: {
      name: "Elena Kowalski",
      avatar: "https://ui-avatars.com/api/?name=EK&background=F59E0B&color=fff",
    },
    type: "live",
    content: "Going live in 30 minutes to demo the new features in React 20. Join me for Q&A after!",
    timestamp: new Date(2025, 3, 6, 11, 10),
    likes: 15,
    comments: 4,
    liveTime: new Date(2025, 3, 6, 11, 40)
  },
];

const ActivityFeed = () => {
  const renderActivityContent = (activity: typeof ACTIVITY_FEED[0]) => {
    switch (activity.type) {
      case "post":
        return (
          <>
            <p className="text-gray-200 mb-4">{activity.content}</p>
            {activity.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img 
                  src={activity.image} 
                  alt="Post attachment" 
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </>
        );
      case "event":
        return (
          <>
            <p className="text-gray-200 mb-2">{activity.content}</p>
            <div className="flex items-center mb-4 text-mmk-amber mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{format(activity.eventDate!, "MMMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </>
        );
      case "achievement":
        return (
          <>
            <p className="text-gray-200 mb-2">{activity.content}</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 w-fit mb-4">
              {activity.achievementIcon}
              <span className="font-medium">{activity.achievement} Badge</span>
            </div>
          </>
        );
      case "resource":
        return (
          <>
            <p className="text-gray-200 mb-2">{activity.content}</p>
            <a 
              href={activity.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 w-fit mb-4 hover:bg-white/10 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-mmk-purple" />
              <span className="text-sm">View Resource</span>
            </a>
          </>
        );
      case "live":
        return (
          <>
            <p className="text-gray-200 mb-2">{activity.content}</p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-mmk-purple/20 w-fit mb-4 text-mmk-purple">
              <Video className="h-4 w-4" />
              <span className="text-sm">Live at {format(activity.liveTime!, "h:mm a")}</span>
            </div>
          </>
        );
      default:
        return <p className="text-gray-200 mb-4">{activity.content}</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* New Post Input */}
      <div className="glass-card p-4 rounded-lg flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="https://ui-avatars.com/api/?name=ME&background=8B5CF6&color=fff" alt="Your Avatar" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-white/5 rounded-lg px-4 py-3 mb-2">
            <p className="text-gray-400">Share something with the community...</p>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-mmk-purple">
                <Calendar className="h-4 w-4 mr-2" />
                Event
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-mmk-purple">
                <BookOpen className="h-4 w-4 mr-2" />
                Resource
              </Button>
            </div>
            <Button size="sm" className="bg-mmk-purple hover:bg-mmk-purple/90">
              Post
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {ACTIVITY_FEED.map((activity) => (
        <div key={activity.id} className="glass-card p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{activity.user.name}</p>
                <p className="text-xs text-gray-400">{format(activity.timestamp, "MMM d, h:mm a")}</p>
              </div>
            </div>
            
            {activity.type === "event" && (
              <Button variant="outline" size="sm" className="border-white/20 bg-transparent">
                <Calendar className="h-4 w-4 mr-1" />
                RSVP
              </Button>
            )}
            {activity.type === "live" && (
              <Button size="sm" className="bg-red-500 hover:bg-red-600">
                <Video className="h-4 w-4 mr-1" />
                Join
              </Button>
            )}
          </div>
          
          {renderActivityContent(activity)}
          
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-mmk-purple px-0">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {activity.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-mmk-purple px-0">
                <MessageSquare className="h-4 w-4 mr-1" />
                {activity.comments}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-mmk-purple">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
