
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Users, MessageSquare, Calendar, MessageCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import MemberSpotlight from "@/components/community/MemberSpotlight";
import OnlineMembers from "@/components/community/OnlineMembers";
import CommunityChat from "@/components/community/CommunityChat";
import ActivityFeed from "@/components/community/ActivityFeed";
import CommunityGroups from "@/components/community/CommunityGroups";
import MembershipCard from "@/components/community/MembershipCard";
import BadgesCarousel from "@/components/community/BadgesCarousel";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityStats from "@/components/community/CommunityStats";
import CommunityTimestamp from "@/components/community/CommunityTimestamp";
import CommunityTabs from "@/components/community/CommunityTabs";
import { format } from "date-fns";

const Community = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 md:py-20 relative">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <CommunityHeader />
          
          {/* Stats */}
          <CommunityStats />
          
          {/* Lovable Timestamp */}
          <CommunityTimestamp currentTime={currentTime} />
          
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Who's Online & Membership Card (visible on desktop) */}
            <div className="hidden lg:flex lg:w-1/4 flex-col gap-6">
              <OnlineMembers />
              <MembershipCard />
              <BadgesCarousel />
            </div>
            
            {/* Main Content Area */}
            <div className="w-full lg:w-2/4">
              <CommunityTabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
              />
            </div>
            
            {/* Right Sidebar - Member Spotlight */}
            <div className="hidden lg:block lg:w-1/4">
              <MemberSpotlight />
            </div>
          </div>
        </div>
        
        {/* Mobile Drawer for Who's Online */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              className="lg:hidden fixed bottom-20 left-4 bg-mmk-purple hover:bg-mmk-purple/90 rounded-full w-12 h-12 p-0"
              aria-label="See who's online"
            >
              <Users className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-mmk-purple" />
                Who's Online
              </h3>
              <OnlineMembers />
            </div>
          </DrawerContent>
        </Drawer>
        
        {/* Mobile Drawer for Membership */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              className="lg:hidden fixed bottom-20 right-4 bg-mmk-amber hover:bg-mmk-amber/90 rounded-full w-12 h-12 p-0"
              aria-label="View membership"
            >
              <BadgeCheck className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="p-4 max-h-[80vh] overflow-y-auto space-y-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Star className="w-5 h-5 mr-2 text-mmk-amber" />
                My Membership
              </h3>
              <MembershipCard />
              <BadgesCarousel />
            </div>
          </DrawerContent>
        </Drawer>
        
        {/* Floating Button for Start a Conversation */}
        <Button 
          className="fixed bottom-4 right-4 bg-mmk-amber hover:bg-mmk-amber/90 rounded-full shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Start a Conversation
        </Button>
      </main>
    </div>
  );
};

// Define a Star component to fix the undefined reference
import { Star } from "lucide-react";

export default Community;
