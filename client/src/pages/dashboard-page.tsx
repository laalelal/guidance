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
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Career Recommendations</h3>
                <CareerRecommendations />
              </div>
              
              {user.quizResults ? (
                <div className="mt-6 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Career Aptitude Quiz Results</h3>
                      <p className="text-primary font-semibold mt-1">Recommended Stream: {user.quizResults.recommendedStream}</p>
                    </div>
                    <a 
                      href="/quiz" 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      View Full Results
                    </a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <p className="text-sm text-gray-500">Logical Reasoning</p>
                      <p className="font-bold text-blue-600">{user.quizResults.logicalScore}/10</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-green-100">
                      <p className="text-sm text-gray-500">Mathematics</p>
                      <p className="font-bold text-green-600">{user.quizResults.mathQuizScore}/10</p>
                    </div>
                    <div className="bg-white p-3 rounded border border-purple-100">
                      <p className="text-sm text-gray-500">Verbal Ability</p>
                      <p className="font-bold text-purple-600">{user.quizResults.verbalScore}/10</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Take the Career Aptitude Quiz</h3>
                  <p className="text-gray-600 mb-4">Take our comprehensive career aptitude quiz to get a detailed assessment of your strengths and receive personalized stream recommendations based on your aptitude.</p>
                  <a href="/quiz" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Start Career Quiz
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
