import React from "react";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  UserPlus,
  Users,
  FileText,
  Star,
  BarChart2,
  Calendar
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
  userType: "applicant" | "recruiter";
  stats?: {
    totalJobs?: number;
    totalApplicants?: number;
    newApplicants?: number;
    rating?: number;
    totalApplications?: number;
    pendingApplications?: number;
    interviewApplications?: number;
    rejectedApplications?: number;
    applicantsPerJob?: number;
  };
}

const DashboardStats = ({ userType, stats }: DashboardStatsProps) => {
  // Calculate applicants per job
  const applicantsPerJob = stats?.totalJobs && stats.totalJobs > 0 
    ? (stats.totalApplicants || 0) / stats.totalJobs 
    : 0;

  // Default stats for job seeker
  const defaultJobSeekerStats = [
    {
      title: "Total Applications",
      value: stats?.totalApplications || 0,
      description: "Applications submitted",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Pending",
      value: stats?.pendingApplications || 0,
      description: "Applications awaiting review",
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      color: "bg-amber-100",
    },
    {
      title: "Interviews",
      value: stats?.interviewApplications || 0,
      description: "Applications in interview stage",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Rejected",
      value: stats?.rejectedApplications || 0,
      description: "Applications not selected",
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      color: "bg-red-100",
    },
  ];

  // Default stats for recruiter
  const defaultRecruiterStats = [
    {
      title: "Active Jobs",
      value: stats?.totalJobs || 0,
      description: "Currently accepting applications",
      icon: <Briefcase className="h-5 w-5 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Applicants Per Job",
      value: applicantsPerJob.toFixed(1),
      description: "Average applications received",
      icon: <BarChart2 className="h-5 w-5 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Total Applicants",
      value: stats?.totalApplicants || 0,
      description: "Across all job postings",
      icon: <Users className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-100",
    },
    {
      title: "Average Rating",
      value: stats?.rating?.toFixed(1) || "N/A",
      description: "Based on applicant feedback",
      icon: <Star className="h-5 w-5 text-amber-600" />,
      color: "bg-amber-100",
    },
  ];

  const displayStats = userType === "applicant" ? defaultJobSeekerStats : defaultRecruiterStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {displayStats.map((stat) => (
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
