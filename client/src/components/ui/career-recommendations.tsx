import { useQuery } from "@tanstack/react-query";
import { FaGraduationCap, FaFlask, FaChartLine, FaUsers, FaComments, FaBriefcase, FaPalette, FaCompass } from "react-icons/fa";

interface Recommendation {
  title: string;
  icon: string;
  color: string;
  description: string;
}

const iconMap: Record<string, React.ReactNode> = {
  "graduation-cap": <FaGraduationCap />,
  "flask": <FaFlask />,
  "chart-line": <FaChartLine />,
  "users": <FaUsers />,
  "comments": <FaComments />,
  "briefcase": <FaBriefcase />,
  "palette": <FaPalette />,
  "compass": <FaCompass />,
};

const colorMap: Record<string, string> = {
  "primary": "bg-primary-100 text-primary-600",
  "secondary": "bg-secondary-100 text-secondary-600",
  "green": "bg-green-100 text-green-600",
  "blue": "bg-blue-100 text-blue-600",
  "yellow": "bg-yellow-100 text-yellow-600",
  "orange": "bg-orange-100 text-orange-600",
  "purple": "bg-purple-100 text-purple-600",
  "gray": "bg-gray-100 text-gray-600",
};

export default function CareerRecommendations() {
  const { data: recommendations, isLoading, error } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="h-24 flex items-center justify-center">
          <p className="text-gray-500">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="h-24 flex items-center justify-center">
          <p className="text-red-500">Error loading recommendations. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="h-24 flex items-center justify-center">
          <p className="text-gray-500">Complete your academic information to get personalized recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {recommendations.map((recommendation, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className="flex items-start">
            <div className={`h-10 w-10 rounded-full ${colorMap[recommendation.color]} flex items-center justify-center flex-shrink-0`}>
              {iconMap[recommendation.icon]}
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">{recommendation.title}</h4>
              <p className="text-sm text-gray-600">{recommendation.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
