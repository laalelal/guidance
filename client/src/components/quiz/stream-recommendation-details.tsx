import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  School, 
  Briefcase, 
  Award, 
  MapPin, 
  TrendingUp
} from "lucide-react";
import { StreamData } from "@/data/career-stream-data";

interface StreamRecommendationDetailsProps {
  streamData: StreamData;
}

export default function StreamRecommendationDetails({ streamData }: StreamRecommendationDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">About {streamData.name} Stream</h3>
        <p className="text-slate-600 dark:text-slate-300">{streamData.description}</p>
      </div>
      
      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exams" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Competitive Exams</span>
          </TabsTrigger>
          <TabsTrigger value="colleges" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            <span>Top Colleges</span>
          </TabsTrigger>
          <TabsTrigger value="careers" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Career Paths</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="exams" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Matching Competitive Exams</CardTitle>
              <CardDescription>
                Important entrance exams for {streamData.name} stream students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {streamData.exams.map((exam, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-primary flex items-center">
                          <Award className="h-5 w-5 mr-2" />
                          {exam.name} - {exam.fullName}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">{exam.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colleges" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Colleges & Cut-off Scores</CardTitle>
              <CardDescription>
                Prestigious institutions offering programs in {streamData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {streamData.colleges.map((college, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-primary">{college.name}</h4>
                        <div className="mt-1 text-sm">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{college.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 mt-1">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>Typical Cut-off: {college.cutoff}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="careers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Future Career Paths</CardTitle>
              <CardDescription>
                Potential career options after completing {streamData.name} stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {streamData.careers.map((career, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-2 rounded mr-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{career.title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{career.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}