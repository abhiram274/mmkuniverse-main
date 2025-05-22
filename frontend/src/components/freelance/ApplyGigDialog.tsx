
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GigData } from "./GigCard";

interface ApplyGigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGig: GigData | null;
}

const ApplyGigDialog = ({ isOpen, onOpenChange, selectedGig }: ApplyGigDialogProps) => {
  if (!selectedGig) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary/90 border-white/10 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Apply to Gig</DialogTitle>
          <DialogDescription>
            {selectedGig?.title}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="cover-letter" className="text-sm font-medium">Cover Letter</label>
            <Textarea 
              id="cover-letter" 
              placeholder="Tell them what makes you perfect for this gig!" 
              className="bg-transparent border-white/20 min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bid" className="text-sm font-medium">Your Bid ($)</label>
            <Input id="bid" type="number" placeholder="Enter your price" className="bg-transparent border-white/20" />
            <p className="text-xs text-gray-400">Budget Range: {selectedGig?.budget}</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="completion-time" className="text-sm font-medium">Estimated Completion Time</label>
            <div className="flex gap-2 items-center">
              <Input id="completion-time" type="number" className="bg-transparent border-white/20" />
              <Select defaultValue="days">
                <SelectTrigger className="w-[120px] bg-transparent border-white/20">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="portfolio" className="text-sm font-medium">Relevant Portfolio Links (Optional)</label>
            <Input id="portfolio" placeholder="Links to your previous work" className="bg-transparent border-white/20" />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-white/20"
          >
            Cancel
          </Button>
          <Button className="bg-mmk-purple hover:bg-mmk-purple/90">
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyGigDialog;
