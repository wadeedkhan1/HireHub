
import React from "react";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  UserPlus,
  Users,
  FileText,
  Star
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, description, icon, color }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  userType: "jobseeker" | "recruiter";
}

const DashboardStats = ({ userType }: DashboardStatsProps) => {
  const jobSeekerStats = [
    {
      title: "Total Applications",
      value: 12,
      description: "Across 8 companies",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Pending",
      value: 5,
      description: "Applications awaiting review",
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      color: "bg-amber-100",
    },
    {
      title: "Interviews",
      value: 3,
      description: "Scheduled this week",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Rejected",
      value: 4,
      description: "Better luck next time",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      color: "bg-red-100",
    },
  ];

  const recruiterStats = [
    {
      title: "Active Jobs",
      value: 8,
      description: "Currently accepting applications",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "New Applicants",
      value: 43,
      description: "Last 7 days",
      icon: <UserPlus className="h-5 w-5 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Total Applicants",
      value: 218,
      description: "Across all job postings",
      icon: <Users className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-100",
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Based on applicant feedback",
      icon: <Star className="h-5 w-5 text-amber-600" />,
      color: "bg-amber-100",
    },
  ];

  const stats = userType === "jobseeker" ? jobSeekerStats : recruiterStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
