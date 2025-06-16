import { Calendar, Clock, Award, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2 } from "lucide-react";

interface ProgramProps {
  id: number;
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

  // Add these new props for registration period
  startDate?: string;  // registration start date
  endDate?: string;    // registration end date

  isEnrolled?: boolean;
  onEnroll: (programId: number, programName: string) => void;
  disabled?: boolean; // general disable flag
  attendees?: number; // list of attendee names
  attendance_limit?: number;       // member limit
  location: string;
 
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
  category,
  startDate = null,
  endDate = null,
  isEnrolled = false,
  onEnroll,
  disabled,
  attendance_limit,
  attendees,
  location,

}: ProgramProps) => {
  // Parse the dates safely
  const today = new Date();

  // Parse start and end dates if available, else null
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Check if today is within registration window (inclusive)
  const isWithinRegistration =
    (!start || today >= start) && (!end || today <= end);

  // Debug logs — remove in production
  // console.log({ today, start, end, isWithinRegistration });

  // The button should be disabled if:
  // - disabled prop is true OR
  // - user is already enrolled OR
  // - not within registration period
  const isButtonDisabled = disabled || isEnrolled || !isWithinRegistration;
  console.log("Start Date:", startDate, "End Date:", endDate);

  return (
    <div className="glass-card overflow-hidden hover:border-mmk-purple/60 group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {isFree && <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>}
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
        <p className="text-gray-400 mb-4 flex-grow">Registrations From: {startDate} To {endDate}</p>

        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Event Starts From: {date}</span>

          </div>
  <div className="flex items-center text-gray-400">
    <MapPin className="w-4 h-4 mr-2" />
    <span>{location}</span>
  </div>




          <p className="text-gray-400 mb-1">Members Limit: {attendance_limit ?? 'N/A'}</p>

          {isCertified && (
            <div className="flex items-center text-mmk-amber">
              <Award className="w-4 h-4 mr-2" />
              <span>Certificate Included</span>
            </div>
          )}
        </div>




        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold">Price: {isFree ? "Free" : price}</span>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="h-4 w-4" />
              {attendees} attending
            </div>

         <Button
    variant="outline"
    onClick={() => {
      const url = `${window.location.origin}/guest-program-join-payment?program_id=${id}&program_name=${encodeURIComponent(title)}`;
      navigator.clipboard.writeText(url);
      toast.success("Join link copied to clipboard!");
    }}
    className="flex items-center gap-2 text-sm"
  >
    <Share2 className="w-4 h-4" />
    Share Event Join Link
  </Button>

            <br />
            <Button
              className="bg-mmk-purple hover:bg-mmk-purple/90 text-white"
              onClick={() => onEnroll(id, title)}
            disabled={isButtonDisabled}
            >
              {isEnrolled ? "Enrolled" : isWithinRegistration ? "Enroll Now" : "Registration Closed"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;
