
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Book, Calendar, Code, Globe, HeartHandshake, MessageSquare, Star, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Mock data for badges
const BADGES = [
  {
    id: 1,
    name: "First Contribution",
    icon: <Zap className="h-6 w-6 text-mmk-amber" />,
    description: "Made your first contribution to the community",
    color: "bg-gradient-to-br from-amber-500/20 to-amber-600/20",
    borderColor: "border-amber-500/30",
    earned: true,
    date: "March 18, 2025"
  },
  {
    id: 2,
    name: "Helpful Member",
    icon: <HeartHandshake className="h-6 w-6 text-green-500" />,
    description: "Helped 10+ community members with their questions",
    color: "bg-gradient-to-br from-green-500/20 to-green-600/20",
    borderColor: "border-green-500/30",
    earned: true,
    date: "March 25, 2025"
  },
  {
    id: 3,
    name: "Code Contributor",
    icon: <Code className="h-6 w-6 text-blue-500" />,
    description: "Shared code snippets that helped others",
    color: "bg-gradient-to-br from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
    earned: true,
    date: "April 2, 2025"
  },
  {
    id: 4,
    name: "Discussion Leader",
    icon: <MessageSquare className="h-6 w-6 text-mmk-purple" />,
    description: "Started 5+ discussions with high engagement",
    color: "bg-gradient-to-br from-purple-500/20 to-purple-600/20",
    borderColor: "border-purple-500/30",
    earned: true,
    date: "April 5, 2025"
  },
  {
    id: 5,
    name: "Event Organizer",
    icon: <Calendar className="h-6 w-6 text-pink-500" />,
    description: "Successfully organized a community event",
    color: "bg-gradient-to-br from-pink-500/20 to-pink-600/20",
    borderColor: "border-pink-500/30",
    earned: false,
  },
  {
    id: 6,
    name: "Global Networker",
    icon: <Globe className="h-6 w-6 text-teal-500" />,
    description: "Connected with members from 5+ countries",
    color: "bg-gradient-to-br from-teal-500/20 to-teal-600/20",
    borderColor: "border-teal-500/30",
    earned: false,
  },
  {
    id: 7,
    name: "Knowledge Sharer",
    icon: <Book className="h-6 w-6 text-orange-500" />,
    description: "Shared 10+ high-quality learning resources",
    color: "bg-gradient-to-br from-orange-500/20 to-orange-600/20",
    borderColor: "border-orange-500/30",
    earned: false,
  },
];

const BadgesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextBadge = () => {
    setActiveIndex((prev) => (prev + 1) % BADGES.length);
  };
  
  const prevBadge = () => {
    setActiveIndex((prev) => (prev - 1 + BADGES.length) % BADGES.length);
  };
  
  const activeBadge = BADGES[activeIndex];
  
  return (
    <Card className="bg-secondary/40 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="w-4 h-4 mr-2 text-mmk-amber" />
          Your Badges
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({BADGES.filter(b => b.earned).length}/{BADGES.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full"
            onClick={prevBadge}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          
          <div className="flex justify-center items-center">
            <div className={`relative p-6 rounded-xl ${activeBadge.color} border ${activeBadge.borderColor} w-44 h-44 flex flex-col items-center justify-center mx-auto`}>
              <div className="absolute top-2 right-2">
                {activeBadge.earned && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white/10 backdrop-blur-sm">
                    <Star className="w-3 h-3 mr-1 text-yellow-400" />
                    Earned
                  </span>
                )}
              </div>
              
              {activeBadge.icon}
              <h3 className="mt-3 text-center font-bold">{activeBadge.name}</h3>
              <p className="text-xs text-center mt-1 text-gray-300">
                {activeBadge.description}
              </p>
              
              {activeBadge.earned && (
                <p className="text-xs mt-2 text-gray-400">Earned on {activeBadge.date}</p>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full"
            onClick={nextBadge}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
          
          <div className="flex justify-center mt-4 gap-1">
            {BADGES.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex
                    ? "bg-mmk-purple"
                    : "bg-white/20"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" className="border-white/20 bg-transparent">
            <Award className="h-4 w-4 mr-2" />
            View All Badges
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesCarousel;
