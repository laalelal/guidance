import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
          <p className="mt-4 text-xl text-gray-500">Learn more about our Career Guidance System</p>
        </div>
        
        <div className="prose prose-primary mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-lg text-gray-700 mb-6">
              The Career Guidance System is an intelligent platform designed to help Class 10 students make informed academic choices based on their strengths, interests, and performance.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              Combining Class 10 subject results with an AI-driven quiz, the system analyzes a student's aptitude across Mathematics, Science, English, Social Science, and Logical Reasoning to recommend the most suitable stream — Science (PCM or PCMB), Commerce, or Arts/Humanities.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              With a personalized result page, students receive insights on:
            </p>
            
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li className="text-gray-700">Recommended stream based on academic and quiz performance</li>
              <li className="text-gray-700">Top competitive exams for each stream</li>
              <li className="text-gray-700">Best institutes and cut-off scores</li>
              <li className="text-gray-700">Future career opportunities</li>
            </ul>
            
            <p className="text-lg text-gray-700 font-medium">
              Whether you're aiming to become an engineer, doctor, economist, journalist, or IAS officer — this system helps you take the first right step toward your dream career.
            </p>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700">
              Our mission is to empower students with the knowledge and insights they need to make confident decisions about their academic and career paths, ensuring they utilize their strengths and pursue paths aligned with their interests and abilities.
            </p>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Approach</h2>
            <p className="text-lg text-gray-700">
              We believe in a data-driven approach to career guidance, combining academic performance metrics with aptitude assessment to provide holistic recommendations that consider both past achievement and future potential.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}