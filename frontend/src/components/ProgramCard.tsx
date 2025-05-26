
import { Calendar, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProgramProps {
  id:number;
  title: string;
  description: string;
  image: string;
  price: string;
  isFree: boolean;
  isCertified: boolean;
  isLive: boolean;
  duration: string;
  date: string;
   category: string;
   isEnrolled?: boolean;
  onEnroll: (programId: number, programName: string) => void;

}


const ProgramCard = ({
  id,
  title,
  description,
  image,
  price,
  isFree,
  isCertified,
  isLive,
  duration,
  date,
  isEnrolled=false,
    onEnroll,

}: ProgramProps) => {
  return (
    <div className="glass-card overflow-hidden hover:border-mmk-purple/60 group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {isFree && (
            <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>
          )}
          {isCertified && (
            <Badge className="bg-mmk-amber hover:bg-mmk-amber/90">Certified</Badge>
          )}
          {isLive && (
            <Badge className="bg-red-500 hover:bg-red-600">
              <span className="mr-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Live
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 mb-4 flex-grow">{description}</p>
        

        
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{date}</span>
          </div>
          {isCertified && (
            <div className="flex items-center text-mmk-amber">
              <Award className="w-4 h-4 mr-2" />
              <span>Certificate Included</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold">{isFree ? "Free" : price}</span>
         <Button
    className="bg-mmk-purple hover:bg-mmk-purple/90 text-white"
    onClick={() => onEnroll (id, title)}
    disabled={isEnrolled}
  >
    {isEnrolled ? "Enrolled" : "Enroll Now"}
  </Button>
        </div>


        
      </div>
    </div>
  );
};

export default ProgramCard;
