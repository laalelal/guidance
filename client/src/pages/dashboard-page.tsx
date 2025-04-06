import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProfileChart from "@/components/ui/profile-chart";
import CareerRecommendations from "@/components/ui/career-recommendations";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // The ProtectedRoute component will handle the authentication check
  // This is just an extra safety check
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-primary px-6 py-4">
              <h2 className="text-xl font-bold text-white">Welcome, {user.fullName || user.username}!</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Academic Profile</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">School</p>
                      <p className="font-medium">{user.schoolName || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Board</p>
                      <p className="font-medium">{user.schoolBoard || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Overall Percentage</p>
                      <p className="font-medium">{user.percentage ? `${user.percentage}%` : "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preferred Stream</p>
                      <p className="font-medium">{user.preferredStream || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Subject Performance</h3>
                {(user.mathMarks || user.scienceMarks || user.englishMarks || user.hindiMarks || user.socialScienceMarks) ? (
                  <ProfileChart userData={user} />
                ) : (
                  <div className="h-64 bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No subject performance data available</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Career Recommendations</h3>
                <CareerRecommendations />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
