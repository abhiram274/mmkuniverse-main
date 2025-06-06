
import { format } from "date-fns";

interface CommunityTimestampProps {
  currentTime: Date;
}

const CommunityTimestamp = ({ currentTime }: CommunityTimestampProps) => {
  return (
    <div className="text-xs text-gray-400 text-right">
      MMK Universe {format(currentTime, "HH:mm 'on' MMM dd, yyyy")}
    </div>
  );
};

export default CommunityTimestamp;
