
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GigFiltersProps {
  categories: string[];
}

const GigFilters = ({ categories }: GigFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for gigs..."
            className="pl-10 bg-transparent border-white/20"
          />
        </div>
        <Button 
          variant="outline" 
          className="md:w-auto border-white/20 bg-transparent"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="mr-2" />
          Filters
        </Button>
        <Select>
          <SelectTrigger className="w-full md:w-[180px] bg-transparent border-white/20">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="budget-high">Highest Budget</SelectItem>
            <SelectItem value="deadline">Deadline (Soon)</SelectItem>
            <SelectItem value="applied">Least Applied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters Panel (Toggled) */}
      {showFilters && (
        <div className="mt-4 p-4 border border-white/10 rounded-lg bg-mmk-dark/80">
          <h3 className="text-lg font-medium mb-3">Filter Gigs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Categories</h4>
              <div className="space-y-2">
                {categories.slice(0, 5).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`category-${category}`} />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Budget Range</h4>
              <div className="flex gap-2 items-center">
                <Input placeholder="Min $" className="bg-transparent border-white/20" />
                <span>-</span>
                <Input placeholder="Max $" className="bg-transparent border-white/20" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <Input 
                placeholder="e.g. React, Design, Writing" 
                className="bg-transparent border-white/20"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="flex gap-1 items-center">
                  React
                  <X className="h-3 w-3 cursor-pointer" />
                </Badge>
                <Badge variant="secondary" className="flex gap-1 items-center">
                  UI/UX
                  <X className="h-3 w-3 cursor-pointer" />
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" className="border-white/20">Clear All</Button>
            <Button className="bg-mmk-purple hover:bg-mmk-purple/90">Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigFilters;
