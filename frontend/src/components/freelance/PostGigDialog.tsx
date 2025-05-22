
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

interface PostGigDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
}

const PostGigDialog = ({ isOpen, onOpenChange, categories }: PostGigDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary/90 border-white/10 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a Gig</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new freelance gig. Be specific to attract the right talent.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input id="title" placeholder="e.g. React Developer for Educational App" className="bg-transparent border-white/20" />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea 
              id="description" 
              placeholder="Describe the project, requirements, and deliverables..." 
              className="bg-transparent border-white/20 min-h-[120px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger id="category" className="bg-transparent border-white/20">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="skills" className="text-sm font-medium">Required Skills</label>
              <Input id="skills" placeholder="e.g. React, UI/UX, Writing" className="bg-transparent border-white/20" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium">Budget Range ($)</label>
              <div className="flex gap-2 items-center">
                <Input id="budget-min" placeholder="Min" className="bg-transparent border-white/20" />
                <span>-</span>
                <Input id="budget-max" placeholder="Max" className="bg-transparent border-white/20" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
              <Input id="deadline" type="date" className="bg-transparent border-white/20" />
            </div>
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
            Create a Gig
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostGigDialog;
