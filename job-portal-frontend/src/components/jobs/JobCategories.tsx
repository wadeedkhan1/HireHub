import React, { useState, useEffect } from "react";
import { CodeIcon, BarChart, FlaskConical, Briefcase, Building2, Pencil, Globe, Heart, Utensils, Users, BookOpen, GraduationCap, Headphones, ArrowRight, Palette, Camera, Music, Plane, Smartphone, Coffee, Home, Database, Mic, ShoppingBag, Truck, Music as MusicIcon, Lightbulb, Package, PresentationIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { jobService } from "@/services";

interface CategoryProps {
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  hoverColor: string;
}

interface CategoryData {
  name: string;
  count: number;
}

const Category = ({ name, icon, count, color, hoverColor }: CategoryProps) => {
  return (
    <Link 
      to={`/jobs?category=${name}`}
      className={`flex flex-col items-center p-8 bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 ${hoverColor} group hover:translate-y-[-5px]`}
    >
      <div className={`p-5 rounded-full ${color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-xl mb-2">{name}</h3>
      <p className="text-sm text-gray-500 mb-3">{count} jobs</p>
      <span className="text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        View Jobs <ArrowRight className="ml-1 h-4 w-4" />
      </span>
    </Link>
  );
};

// Map of category names to icons and colors
const CATEGORY_ICONS: Record<string, { icon: React.ReactNode, color: string, hoverColor: string }> = {
  "IT": { 
    icon: <CodeIcon className="h-8 w-8 text-blue-600" />, 
    color: "bg-blue-100",
    hoverColor: "hover:border-blue-300"
  },
  "Finance": { 
    icon: <BarChart className="h-8 w-8 text-green-600" />, 
    color: "bg-green-100",
    hoverColor: "hover:border-green-300"
  },
  "Science": { 
    icon: <FlaskConical className="h-8 w-8 text-purple-600" />, 
    color: "bg-purple-100",
    hoverColor: "hover:border-purple-300"
  },
  "Business": { 
    icon: <Briefcase className="h-8 w-8 text-amber-600" />, 
    color: "bg-amber-100",
    hoverColor: "hover:border-amber-300"
  },
  "Management": { 
    icon: <Building2 className="h-8 w-8 text-indigo-600" />, 
    color: "bg-indigo-100",
    hoverColor: "hover:border-indigo-300"
  },
  "Creative": { 
    icon: <Pencil className="h-8 w-8 text-pink-600" />, 
    color: "bg-pink-100",
    hoverColor: "hover:border-pink-300"
  },
  "Marketing": { 
    icon: <Globe className="h-8 w-8 text-red-600" />, 
    color: "bg-red-100",
    hoverColor: "hover:border-red-300"
  },
  "HR": { 
    icon: <Users className="h-8 w-8 text-teal-600" />, 
    color: "bg-teal-100",
    hoverColor: "hover:border-teal-300"
  },
  "Healthcare": { 
    icon: <Heart className="h-8 w-8 text-rose-600" />, 
    color: "bg-rose-100",
    hoverColor: "hover:border-rose-300"
  },
  "Education": {
    icon: <BookOpen className="h-8 w-8 text-sky-600" />,
    color: "bg-sky-100",
    hoverColor: "hover:border-sky-300"
  },
  "Engineering": {
    icon: <GraduationCap className="h-8 w-8 text-orange-600" />,
    color: "bg-orange-100",
    hoverColor: "hover:border-orange-300"
  },
  "Design": {
    icon: <Palette className="h-8 w-8 text-fuchsia-600" />,
    color: "bg-fuchsia-100",
    hoverColor: "hover:border-fuchsia-300"
  },
  "Media": {
    icon: <Camera className="h-8 w-8 text-cyan-600" />,
    color: "bg-cyan-100",
    hoverColor: "hover:border-cyan-300"
  },
  "Hospitality": {
    icon: <Utensils className="h-8 w-8 text-yellow-600" />,
    color: "bg-yellow-100",
    hoverColor: "hover:border-yellow-300"
  },
  "Customer Service": {
    icon: <Headphones className="h-8 w-8 text-emerald-600" />,
    color: "bg-emerald-100",
    hoverColor: "hover:border-emerald-300"
  },
  "Travel": {
    icon: <Plane className="h-8 w-8 text-blue-500" />,
    color: "bg-blue-100",
    hoverColor: "hover:border-blue-300"
  },
  "Technology": {
    icon: <Smartphone className="h-8 w-8 text-slate-600" />,
    color: "bg-slate-100",
    hoverColor: "hover:border-slate-300"
  },
  "Food & Beverage": {
    icon: <Coffee className="h-8 w-8 text-amber-600" />,
    color: "bg-amber-100",
    hoverColor: "hover:border-amber-300"
  },
  "Real Estate": {
    icon: <Home className="h-8 w-8 text-lime-600" />,
    color: "bg-lime-100",
    hoverColor: "hover:border-lime-300"
  },
  "Data": {
    icon: <Database className="h-8 w-8 text-indigo-600" />,
    color: "bg-indigo-100",
    hoverColor: "hover:border-indigo-300"
  },
  "Entertainment": {
    icon: <MusicIcon className="h-8 w-8 text-violet-600" />,
    color: "bg-violet-100",
    hoverColor: "hover:border-violet-300"
  },
  "Sales": {
    icon: <ShoppingBag className="h-8 w-8 text-pink-600" />,
    color: "bg-pink-100",
    hoverColor: "hover:border-pink-300"
  },
  "Logistics": {
    icon: <Truck className="h-8 w-8 text-gray-600" />,
    color: "bg-gray-100",
    hoverColor: "hover:border-gray-300"
  },
  "Communications": {
    icon: <Mic className="h-8 w-8 text-purple-600" />,
    color: "bg-purple-100", 
    hoverColor: "hover:border-purple-300"
  },
  "Other": {
    icon: <Briefcase className="h-8 w-8 text-gray-600" />,
    color: "bg-gray-100",
    hoverColor: "hover:border-gray-300"
  },
  "R&D": {
    icon: <Lightbulb className="h-8 w-8 text-amber-600" />,
    color: "bg-amber-100",
    hoverColor: "hover:border-amber-300"
  },
  "Product": {
    icon: <Package className="h-8 w-8 text-blue-600" />,
    color: "bg-blue-100",
    hoverColor: "hover:border-blue-300"
  },
  "Consulting": {
    icon: <PresentationIcon className="h-8 w-8 text-emerald-600" />,
    color: "bg-emerald-100",
    hoverColor: "hover:border-emerald-300"
  },
  // Add default for any category not in this map
  "default": {
    icon: <Briefcase className="h-8 w-8 text-gray-600" />,
    color: "bg-gray-100",
    hoverColor: "hover:border-gray-300"
  }
};

const JobCategories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobCategoryCounts();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter out categories with 0 jobs and sort by count (highest first)
  const displayCategories = categories
    .filter(cat => cat.count > 0)
    .sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div className="my-8">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
        </div>
        <div className="bg-red-50 p-8 rounded-xl text-red-700 text-center border border-red-100 shadow-md max-w-3xl mx-auto">
          <p className="font-medium text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex justify-center items-center mb-10 relative">
        <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
        <Link 
          to="/jobs" 
          className="text-blue-600 hover:text-blue-700 text-base font-medium flex items-center absolute right-4"
        >
          View All Categories <ArrowRight className="ml-1 h-5 w-5" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
        {displayCategories.length > 0 ? (
          displayCategories.map((category) => {
            const categoryConfig = CATEGORY_ICONS[category.name] || CATEGORY_ICONS.default;
            return (
              <Category
                key={category.name}
                name={category.name}
                icon={categoryConfig.icon}
                count={category.count}
                color={categoryConfig.color}
                hoverColor={categoryConfig.hoverColor}
              />
            );
          })
        ) : (
          <div className="col-span-full py-20 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shadow-md">
            <Briefcase className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-xl font-medium">No job categories available</p>
            <p className="text-gray-400 text-base mt-2">Check back later for updated categories</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCategories;
