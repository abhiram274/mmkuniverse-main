
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users } from "lucide-react";

export interface GigData {
  id: number;
  title: string;
  description: string;
  budget: string;
  skills: string[];
  deadline: string;
  postedBy: string;
  applicants: number;
}

interface GigCardProps {
  gig: GigData;
  onViewDetails: (gig: GigData) => void;
  onApply: (gig: GigData) => void;
}

const GigCard = ({ gig, onViewDetails, onApply }: GigCardProps) => {
  return (
    <Card className="bg-secondary/40 border-white/10 hover:border-mmk-purple/60 transition-all overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {gig.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-300 line-clamp-3">{gig.description}</p>
        <div className="flex flex-wrap gap-2">
          {gig.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-mmk-purple/20 hover:bg-mmk-purple/30">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-gray-300">
            <DollarSign className="h-4 w-4 text-mmk-amber" />
            {gig.budget}
          </div>
          <div className="flex items-center gap-1 text-gray-300">
            <Calendar className="h-4 w-4 text-mmk-purple" />
            {gig.deadline}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-400">
          <div>Posted by: {gig.postedBy}</div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {gig.applicants} applied
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          variant="outline" 
          className="border-white/20 hover:bg-mmk-purple/10 hover:border-mmk-purple/60"
          onClick={() => onViewDetails(gig)}
        >
          View Details
        </Button>
        <Button 
          className="bg-mmk-purple hover:bg-mmk-purple/90"
          onClick={() => onApply(gig)}
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GigCard;
