
import { Link } from "react-router-dom";
import { Users, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommunityHeader = () => {
  return (
    <div className="glass-card p-6 md:p-8 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-mmk-purple/20 flex items-center justify-center">
            <Users className="w-8 h-8 text-mmk-purple" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">MMK Universe Community</h1>
            <p className="text-gray-400 mt-1">Connect, collaborate, and grow with fellow learners</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/20 bg-transparent">
            <Share2 className="mr-2 h-4 w-4" />
            Invite Friends
          </Button>
          <Link to="/forum">
            <Button className="bg-mmk-purple hover:bg-mmk-purple/90">
              <MessageSquare className="mr-2 h-4 w-4" />
              Join Discussions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
