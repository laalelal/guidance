import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { QuizQuestion, QuizAnswer, QuizResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Redirect } from "wouter";

export default function QuizPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<'logical' | 'math' | 'verbal'>('logical');
  const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  
  // Check if user has already taken the quiz
  const { data: existingResults, isLoading: resultsLoading } = useQuery<QuizResult | undefined>({
    queryKey: ['/api/quiz/results'],
    queryFn: getQueryFn({ on401: 'throw' }),
    retry: false,
    enabled: !!user
  });

  // Fetch quiz questions
  const { data: questions, isLoading: questionsLoading } = useQuery<QuizQuestion[]>({
    queryKey: ['/api/quiz/questions'],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!user && !existingResults,
  });

  // Submit quiz answers
  const submitQuizMutation = useMutation({
    mutationFn: async (answers: QuizAnswer[]) => {
      const res = await apiRequest('POST', '/api/quiz/submit', { answers });
      return await res.json() as QuizResult;
    },
    onSuccess: (data) => {
      setQuizComplete(true);
      queryClient.setQueryData(['/api/quiz/results'], data);
      toast({
        title: "Quiz completed!",
        description: "Your answers have been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting quiz",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter questions by category
  const logicalQuestions = questions?.filter(q => q.category === 'logical') || [];
  const mathQuestions = questions?.filter(q => q.category === 'math') || [];
  const verbalQuestions = questions?.filter(q => q.category === 'verbal') || [];

  // Get current question based on category and index
  const getCurrentQuestion = () => {
    let categoryQuestions: QuizQuestion[] = [];
    if (currentCategory === 'logical') categoryQuestions = logicalQuestions;
    else if (currentCategory === 'math') categoryQuestions = mathQuestions;
    else if (currentCategory === 'verbal') categoryQuestions = verbalQuestions;
    
    return categoryQuestions[currentQuestionIndex] || null;
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    const totalAnswered = userAnswers.length;
    const totalQuestions = (logicalQuestions.length + mathQuestions.length + verbalQuestions.length);
    return totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;
  };

  // Handle option selection
  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    const updatedAnswers = [...userAnswers];
    const existingAnswerIndex = updatedAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex].selectedOption = optionIndex;
    } else {
      updatedAnswers.push({
        questionId,
        selectedOption: optionIndex
      });
    }
    
    setUserAnswers(updatedAnswers);
  };

  // Move to next question
  const nextQuestion = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    // Check if user has answered the current question
    const hasAnswered = userAnswers.some(a => a.questionId === currentQuestion.id);
    if (!hasAnswered) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before moving to the next question.",
        variant: "destructive",
      });
      return;
    }
    
    // If we're at the end of current category questions, move to next category
    if (currentQuestionIndex >= getCategoryQuestions().length - 1) {
      if (currentCategory === 'logical') {
        setCurrentCategory('math');
        setCurrentQuestionIndex(0);
      } else if (currentCategory === 'math') {
        setCurrentCategory('verbal');
        setCurrentQuestionIndex(0);
      } else {
        // Quiz complete - submit answers
        submitQuizMutation.mutate(userAnswers);
      }
    } else {
      // Move to next question in current category
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Get questions for current category
  const getCategoryQuestions = () => {
    if (currentCategory === 'logical') return logicalQuestions;
    if (currentCategory === 'math') return mathQuestions;
    return verbalQuestions;
  };

  // Check if the current question is answered
  const isCurrentQuestionAnswered = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return false;
    return userAnswers.some(a => a.questionId === currentQuestion.id);
  };

  // Get the selected option for the current question
  const getSelectedOption = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return -1;
    const answer = userAnswers.find(a => a.questionId === currentQuestion.id);
    return answer ? answer.selectedOption : -1;
  };

  // If loading or auth not complete
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in, redirect to auth page
  if (!user) {
    return <Redirect to="/auth" />;
  }

  // If user has already taken the quiz, show results page
  if (existingResults) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Career Aptitude Quiz Results</CardTitle>
            <CardDescription>You have already completed the Career Aptitude Quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-lg">Logical Reasoning</h3>
                  <div className="mt-2 text-3xl font-bold text-blue-600">{existingResults?.logicalScore || 0}/10</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-lg">Mathematics</h3>
                  <div className="mt-2 text-3xl font-bold text-green-600">{existingResults?.mathQuizScore || 0}/10</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-lg">Verbal Ability</h3>
                  <div className="mt-2 text-3xl font-bold text-purple-600">{existingResults?.verbalScore || 0}/10</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Recommended Stream</h3>
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                  {existingResults?.recommendedStream || "Unknown"}
                </div>
                <p className="mt-3 text-slate-600">
                  Based on your academic performance and quiz results, we recommend the {existingResults?.recommendedStream || "Science"} stream 
                  for your higher education. Check the dashboard for more detailed career recommendations.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild className="mt-4">
              <a href="/">View Dashboard</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show quiz interface
  const currentQuestion = getCurrentQuestion();
  const progressPercentage = getProgressPercentage();

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle>Career Aptitude Quiz</CardTitle>
            <span className="text-sm font-medium">
              {userAnswers.length}/{questions?.length || 0} Questions
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <Tabs 
            value={currentCategory} 
            onValueChange={(v) => setCurrentCategory(v as 'logical' | 'math' | 'verbal')}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="logical" disabled={submitQuizMutation.isPending}>
                Logical Reasoning {logicalQuestions.filter(q => userAnswers.some(a => a.questionId === q.id)).length}/{logicalQuestions.length}
              </TabsTrigger>
              <TabsTrigger value="math" disabled={submitQuizMutation.isPending}>
                Mathematics {mathQuestions.filter(q => userAnswers.some(a => a.questionId === q.id)).length}/{mathQuestions.length}
              </TabsTrigger>
              <TabsTrigger value="verbal" disabled={submitQuizMutation.isPending}>
                Verbal Ability {verbalQuestions.filter(q => userAnswers.some(a => a.questionId === q.id)).length}/{verbalQuestions.length}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {questionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentQuestion ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">
                  Question {currentQuestionIndex + 1} of {getCategoryQuestions().length}
                </h3>
                <p className="text-lg">{currentQuestion.question}</p>
              </div>
              
              <RadioGroup 
                value={getSelectedOption().toString()}
                onValueChange={(value) => handleOptionSelect(currentQuestion.id, parseInt(value))}
                className="space-y-3"
                disabled={submitQuizMutation.isPending}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-amber-500 mb-2" />
              <p>No questions available for this category.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <div className="text-sm text-muted-foreground">
            Select an answer to continue
          </div>
          <Button 
            onClick={nextQuestion} 
            disabled={!isCurrentQuestionAnswered() || submitQuizMutation.isPending || !currentQuestion}
            className="flex items-center gap-2"
          >
            {submitQuizMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : currentCategory === 'verbal' && currentQuestionIndex === verbalQuestions.length - 1 ? (
              <>Submit Quiz</>
            ) : (
              <>Next <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}