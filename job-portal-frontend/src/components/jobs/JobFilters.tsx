import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Briefcase, DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterValues {
  searchTerm: string;
  location: string;
  jobType: string[];
  salaryRange: [number, number];
  category?: string;
  duration?: number;
}

interface JobFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

// Job categories in your system
const JOB_CATEGORIES = [
  { value: "IT", label: "IT" },
  { value: "Finance", label: "Finance" },
  { value: "Management", label: "Management" },
  { value: "Marketing", label: "Marketing" },
  { value: "HR", label: "Human Resources" },
  { value: "Sales", label: "Sales" },
  { value: "Engineering", label: "Engineering" },
  { value: "Other", label: "Other" }
];

const JobFilters = ({ onFilterChange, initialFilters }: JobFiltersProps) => {
  const [location, setLocation] = useState(initialFilters?.location || "");
  const [jobType, setJobType] = useState<string[]>(initialFilters?.jobType || []);
  const [salaryRange, setSalaryRange] = useState<[number, number]>(initialFilters?.salaryRange || [0, 200000]);
  const [category, setCategory] = useState<string | undefined>(initialFilters?.category);
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state when initialFilters changes
  useEffect(() => {
    if (initialFilters) {
      setLocation(initialFilters.location || "");
      setJobType(initialFilters.jobType || []);
      setSalaryRange(initialFilters.salaryRange || [0, 200000]);
      setCategory(initialFilters.category);
    }
  }, [initialFilters]);
  
  const toggleJobType = (type: string) => {
    if (jobType.includes(type)) {
      setJobType(jobType.filter(t => t !== type));
    } else {
      setJobType([...jobType, type]);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const applyFilters = async () => {
    setIsSubmitting(true);
    
    try {
      await onFilterChange({
        searchTerm: "",
        location,
        jobType,
        salaryRange,
        category,
        duration: undefined
      });
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const clearFilters = async () => {
    setLocation("");
    setJobType([]);
    setSalaryRange([0, 200000]);
    setCategory(undefined);
    
    setIsSubmitting(true);
    try {
      await onFilterChange({
        searchTerm: "",
        location: "",
        jobType: [],
        salaryRange: [0, 200000],
        category: undefined,
        duration: undefined
      });
    } catch (error) {
      console.error("Error clearing filters:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatSalary = (value: number) => {
    return `PKR ${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
            <input
              type="text"
              placeholder="Location"
              className="w-full rounded-md border border-input px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="button"
              variant="outline"
              className="flex items-center space-x-1 bg-blue-50 border-blue-200 hover:bg-blue-100"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 text-blue-500" />
              <span>Filters</span>
            </Button>
            
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                  Filtering...
                </span>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-600">Advanced Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:text-blue-700"
                disabled={isSubmitting}
              >
                Clear all
              </button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium mb-3 flex items-center text-blue-700">
                <Briefcase className="h-4 w-4 mr-1.5" />
                Job Type
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobType.includes("full-time")}
                    onChange={() => toggleJobType("full-time")}
                    className="rounded text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-sm">Full-Time</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobType.includes("part-time")}
                    onChange={() => toggleJobType("part-time")}
                    className="rounded text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-sm">Part-Time</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobType.includes("freelance")}
                    onChange={() => toggleJobType("freelance")}
                    className="rounded text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-sm">Freelance</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobType.includes("internship")}
                    onChange={() => toggleJobType("internship")}
                    className="rounded text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-sm">Internship</span>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium mb-3 flex items-center text-blue-700">
                <DollarSign className="h-4 w-4 mr-1.5" />
                Salary Range (PKR)
              </h4>
              <div className="px-2">
                <Slider
                  defaultValue={salaryRange}
                  min={0}
                  max={200000}
                  step={5000}
                  value={salaryRange}
                  onValueChange={(value) => setSalaryRange(value as [number, number])}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatSalary(salaryRange[0])}</span>
                  <span>{formatSalary(salaryRange[1])}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-3 flex items-center text-blue-700">
                <Calendar className="h-4 w-4 mr-1.5" />
                Category
              </h4>
              <Select 
                value={category} 
                onValueChange={setCategory}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={applyFilters}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                    Applying...
                  </span>
                ) : (
                  "Apply Filters"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default JobFilters;
