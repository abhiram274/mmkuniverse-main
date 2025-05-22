
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import GigCard, { GigData } from "@/components/freelance/GigCard";
import GigFilters from "@/components/freelance/GigFilters";
import EmptyState from "@/components/freelance/EmptyState";
import PostGigDialog from "@/components/freelance/PostGigDialog";
import ApplyGigDialog from "@/components/freelance/ApplyGigDialog";
import { MOCK_GIGS, CATEGORIES } from "@/components/freelance/mockData";

const FreelanceGigsHub = () => {
  const [isPostGigDialogOpen, setIsPostGigDialogOpen] = useState(false);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<GigData | null>(null);

  const handleApplyClick = (gig: GigData) => {
    setSelectedGig(gig);
    setIsApplyDialogOpen(true);
  };

  const handleViewDetailsClick = (gig: GigData) => {
    setSelectedGig(gig);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="flex flex-col gap-8">
          {/* Header with updated copy */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">Explore Freelance Opportunities</h1>
              <p className="text-gray-400 mt-2">Earn. Learn. Contribute.</p>
            </div>
            <Button onClick={() => setIsPostGigDialogOpen(true)} className="bg-mmk-purple hover:bg-mmk-purple/90">
              <Plus size={18} />
              Create a Gig
            </Button>
          </div>

          {/* Search and Filter */}
          <GigFilters categories={CATEGORIES} />

          {/* Gigs Listing */}
          {MOCK_GIGS.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_GIGS.map((gig) => (
                <GigCard 
                  key={gig.id} 
                  gig={gig} 
                  onViewDetails={handleViewDetailsClick}
                  onApply={handleApplyClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState onCreateGig={() => setIsPostGigDialogOpen(true)} />
          )}
        </div>

        {/* Post a Gig Dialog */}
        <PostGigDialog 
          isOpen={isPostGigDialogOpen} 
          onOpenChange={setIsPostGigDialogOpen} 
          categories={CATEGORIES}
        />

        {/* Apply to Gig Dialog */}
        <ApplyGigDialog 
          isOpen={isApplyDialogOpen} 
          onOpenChange={setIsApplyDialogOpen} 
          selectedGig={selectedGig}
        />
      </main>
    </div>
  );
};

export default FreelanceGigsHub;
