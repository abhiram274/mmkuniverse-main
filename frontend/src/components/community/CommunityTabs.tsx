
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityFeed from "./ActivityFeed";
import CommunityGroups from "./CommunityGroups";
import CommunityChat from "./CommunityChat";

interface CommunityTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CommunityTabs = ({ activeTab, setActiveTab }: CommunityTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="bg-black/20">
          <TabsTrigger value="feed">Activity Feed</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>
        
        <div className="relative w-40 md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search community..."
            className="pl-10 bg-transparent border-white/20"
          />
        </div>
      </div>
      
      <TabsContent value="feed" className="mt-0 space-y-6">
        <ActivityFeed />
      </TabsContent>
      
      <TabsContent value="groups" className="mt-0">
        <CommunityGroups />
      </TabsContent>
      
      <TabsContent value="chat" className="mt-0">
        <CommunityChat />
      </TabsContent>
    </Tabs>
  );
};

export default CommunityTabs;
