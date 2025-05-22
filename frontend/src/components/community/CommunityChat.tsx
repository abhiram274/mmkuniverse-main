
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Smile } from "lucide-react";
import { format } from "date-fns";

// Mock chat messages
const INITIAL_MESSAGES = [
  {
    id: 1,
    user: {
      name: "Miguel Rodriguez",
      avatar: "https://ui-avatars.com/api/?name=MR&background=F59E0B&color=fff",
    },
    message: "Hey everyone! Is anyone working on the new React assignment from week 3?",
    timestamp: new Date(2025, 3, 7, 9, 30)
  },
  {
    id: 2,
    user: {
      name: "Sarah Chen",
      avatar: "https://ui-avatars.com/api/?name=SC&background=8B5CF6&color=fff",
    },
    message: "I just finished it! The useContext part was a bit tricky, but I figured it out.",
    timestamp: new Date(2025, 3, 7, 9, 32)
  },
  {
    id: 3,
    user: {
      name: "Amina Patel",
      avatar: "https://ui-avatars.com/api/?name=AP&background=10B981&color=fff",
    },
    message: "I'm stuck on that part too. Any tips, Sarah?",
    timestamp: new Date(2025, 3, 7, 9, 35)
  },
  {
    id: 4,
    user: {
      name: "Sarah Chen",
      avatar: "https://ui-avatars.com/api/?name=SC&background=8B5CF6&color=fff",
    },
    message: "Sure! The key is to understand how the Provider works with the values you want to share. Let me DM you my code examples.",
    timestamp: new Date(2025, 3, 7, 9, 37)
  },
  {
    id: 5,
    user: {
      name: "Jackson Lee",
      avatar: "https://ui-avatars.com/api/?name=JL&background=EF4444&color=fff",
    },
    message: "Has anyone seen the new announcement about the upcoming workshop?",
    timestamp: new Date(2025, 3, 7, 10, 0)
  },
];

const CommunityChat = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const currentUser = {
      name: "You",
      avatar: "https://ui-avatars.com/api/?name=ME&background=8B5CF6&color=fff",
    };
    
    const newMsg = {
      id: messages.length + 1,
      user: currentUser,
      message: newMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-secondary/40 border-white/10 overflow-hidden h-[600px] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-gray-400 my-2">
          Live chat - Today
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.user.name === "You" ? "justify-end" : ""}`}>
            {msg.user.name !== "You" && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                <AvatarFallback>{msg.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`max-w-[75%] ${msg.user.name === "You" ? "bg-mmk-purple/30" : "bg-white/10"} rounded-2xl p-3`}>
              {msg.user.name !== "You" && (
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{msg.user.name}</span>
                  <span className="text-xs text-gray-400">{format(msg.timestamp, "h:mm a")}</span>
                </div>
              )}
              <p className="text-sm">{msg.message}</p>
              {msg.user.name === "You" && (
                <div className="text-right">
                  <span className="text-xs text-gray-400">{format(msg.timestamp, "h:mm a")}</span>
                </div>
              )}
            </div>
            
            {msg.user.name === "You" && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                <AvatarFallback>{msg.user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef}></div>
      </CardContent>
      
      <CardFooter className="p-4 border-t border-white/10">
        <div className="flex items-center w-full gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-5 w-5 text-gray-400" />
          </Button>
          
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white/5 border-white/10 rounded-full"
          />
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            size="icon" 
            className="rounded-full bg-mmk-purple hover:bg-mmk-purple/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CommunityChat;
