
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onCreateGig: () => void;
}

const EmptyState = ({ onCreateGig }: EmptyStateProps) => {
  return (
    <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-mmk-purple/20 rounded-full flex items-center justify-center mb-4">
        <PlusCircle className="h-10 w-10 text-mmk-purple" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No gigs yet. Ready to launch the first one?</h3>
      <p className="text-gray-400 max-w-md mb-6">
        Be the first to post a gig and kickstart the freelance community!
      </p>
      <Button onClick={onCreateGig} className="bg-mmk-purple hover:bg-mmk-purple/90">
        <Plus size={18} className="mr-2" />
        Create a Gig
      </Button>
    </div>
  );
};

export default EmptyState;
