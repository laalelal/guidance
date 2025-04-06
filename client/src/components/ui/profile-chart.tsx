import { User } from "@shared/schema";

interface ProfileChartProps {
  userData: Omit<User, "password">;
}

export default function ProfileChart({ userData }: ProfileChartProps) {
  const subjects = [
    { name: "Mathematics", marks: userData.mathMarks || 0 },
    { name: "Science", marks: userData.scienceMarks || 0 },
    { name: "English", marks: userData.englishMarks || 0 },
    { name: "Hindi", marks: userData.hindiMarks || 0 },
    { name: "Social Science", marks: userData.socialScienceMarks || 0 },
  ];

  return (
    <div className="h-64 bg-gray-50 p-4 rounded-lg">
      <div className="h-full flex items-center justify-center">
        <div className="w-full">
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{subject.name}</span>
                  <span>{subject.marks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${subject.marks}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
