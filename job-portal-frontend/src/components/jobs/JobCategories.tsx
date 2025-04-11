
import React from "react";
import { CodeIcon, BarChart, FlaskConical, Briefcase, Building2, Pencil, Globe, Heart, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryProps {
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
}

const Category = ({ name, icon, count, color }: CategoryProps) => {
  return (
    <Link 
      to={`/jobs?category=${name}`}
      className="flex flex-col items-center p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
    >
      <div className={`p-3 rounded-full ${color} mb-3`}>
        {icon}
      </div>
      <h3 className="font-medium text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{count} jobs</p>
    </Link>
  );
};

const JobCategories = () => {
  const categories = [
    { 
      name: "IT & Software", 
      icon: <CodeIcon className="h-5 w-5 text-blue-600" />, 
      count: 345,
      color: "bg-blue-100" 
    },
    { 
      name: "Finance", 
      icon: <BarChart className="h-5 w-5 text-green-600" />, 
      count: 182,
      color: "bg-green-100" 
    },
    { 
      name: "Science", 
      icon: <FlaskConical className="h-5 w-5 text-purple-600" />, 
      count: 103,
      color: "bg-purple-100" 
    },
    { 
      name: "Business", 
      icon: <Briefcase className="h-5 w-5 text-amber-600" />, 
      count: 256,
      color: "bg-amber-100" 
    },
    { 
      name: "Corporate", 
      icon: <Building2 className="h-5 w-5 text-indigo-600" />, 
      count: 147,
      color: "bg-indigo-100" 
    },
    { 
      name: "Creative", 
      icon: <Pencil className="h-5 w-5 text-pink-600" />, 
      count: 98,
      color: "bg-pink-100" 
    },
    { 
      name: "Marketing", 
      icon: <Globe className="h-5 w-5 text-red-600" />, 
      count: 124,
      color: "bg-red-100" 
    },
    { 
      name: "Healthcare", 
      icon: <Heart className="h-5 w-5 text-rose-600" />, 
      count: 165,
      color: "bg-rose-100" 
    },
  ];

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
        <Link to="/jobs" className="text-primary hover:text-primary/80 text-sm font-medium">
          View All Categories
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Category
            key={category.name}
            name={category.name}
            icon={category.icon}
            count={category.count}
            color={category.color}
          />
        ))}
      </div>
    </div>
  );
};

export default JobCategories;
