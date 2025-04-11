
import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface JobFiltersProps {
  onFilterChange: (filters: any) => void;
}

const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);
  const [showFilters, setShowFilters] = useState(false);
  
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
  
  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      location,
      jobType,
      salaryRange
    });
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJobType([]);
    setSalaryRange([0, 200000]);
    onFilterChange({
      searchTerm: "",
      location: "",
      jobType: [],
      salaryRange: [0, 200000]
    });
  };
  
  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Job title or keyword"
              className="input-field pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-1/3">
            <input
              type="text"
              placeholder="Location"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="button"
              variant="outline"
              className="flex items-center space-x-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            
            <Button type="submit" className="btn-primary">
              Search
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Advanced Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80"
              >
                Clear all
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Job Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobType.includes("Full-Time")}
                      onChange={() => toggleJobType("Full-Time")}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Full-Time</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobType.includes("Part-Time")}
                      onChange={() => toggleJobType("Part-Time")}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Part-Time</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobType.includes("Contract")}
                      onChange={() => toggleJobType("Contract")}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Contract</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={jobType.includes("Internship")}
                      onChange={() => toggleJobType("Internship")}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Internship</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Salary Range</h4>
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
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={applyFilters}
                className="btn-primary"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default JobFilters;
