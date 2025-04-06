import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { 
  registrationStep1Schema,
  registrationStep2Schema,
  registrationStep3Schema,
  type RegistrationStep1,
  type RegistrationStep2,
  type RegistrationStep3,
  type InsertUser
} from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, GraduationCap, Star } from "lucide-react";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

// Extended schema with custom validations
const extendedStep1Schema = registrationStep1Schema.extend({
  confirmPassword: z.string()
    .min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { registerMutation } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<InsertUser>>({});

  // Form 1: Personal Information
  const form1 = useForm<RegistrationStep1 & { confirmPassword: string }>({
    resolver: zodResolver(extendedStep1Schema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      dob: "",
      gender: "",
      email: "",
      city: "",
      state: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form 2: Academic Information
  const form2 = useForm<RegistrationStep2>({
    resolver: zodResolver(registrationStep2Schema),
    defaultValues: {
      schoolName: "",
      schoolBoard: "",
      percentage: "", // String instead of number for percentage
      mathMarks: undefined,
      scienceMarks: undefined,
      englishMarks: undefined,
      hindiMarks: undefined,
      socialScienceMarks: undefined,
    },
  });

  // Form 3: Preferred Stream
  const form3 = useForm<RegistrationStep3>({
    resolver: zodResolver(registrationStep3Schema),
    defaultValues: {
      preferredStream: "",
    },
  });

  const onSubmitStep1 = (data: RegistrationStep1 & { confirmPassword: string }) => {
    const { confirmPassword, ...rest } = data;
    setFormData({ ...formData, ...rest });
    setStep(2);
  };

  const onSubmitStep2 = (data: RegistrationStep2) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const onSubmitStep3 = (data: RegistrationStep3) => {
    const completeFormData = {
      ...formData,
      ...data,
    } as InsertUser;
    
    registerMutation.mutate(completeFormData);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
        <p className="text-sm text-gray-600 mt-1">Register to get personalized career guidance</p>
      </div>
      
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'}`}>
              <User size={16} />
            </div>
            <span className="text-xs text-gray-500">Personal</span>
          </div>
          <div className="h-1 w-full bg-gray-200 mx-2">
            <div className="h-1 bg-primary" style={{ width: step >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'}`}>
              <GraduationCap size={16} />
            </div>
            <span className="text-xs text-gray-500">Academic</span>
          </div>
          <div className="h-1 w-full bg-gray-200 mx-2">
            <div className="h-1 bg-primary" style={{ width: step >= 3 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'}`}>
              <Star size={16} />
            </div>
            <span className="text-xs text-gray-500">Preferences</span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Personal Information */}
      {step === 1 && (
        <Form {...form1}>
          <form onSubmit={form1.handleSubmit(onSubmitStep1)} className="space-y-4">
            <FormField
              control={form1.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form1.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form1.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form1.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={field.value} 
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel className="font-normal">Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form1.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form1.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form1.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form1.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form1.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form1.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Next: Academic Information
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Button 
                  type="button"
                  variant="link" 
                  className="p-0 text-primary hover:text-primary/80" 
                  onClick={onSwitchToLogin}
                >
                  Sign in
                </Button>
              </p>
            </div>
          </form>
        </Form>
      )}
      
      {/* Step 2: Academic Information */}
      {step === 2 && (
        <Form {...form2}>
          <form onSubmit={form2.handleSubmit(onSubmitStep2)} className="space-y-4">
            <FormField
              control={form2.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Delhi Public School" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form2.control}
              name="schoolBoard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Board</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Board" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form2.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Percentage / CGPA</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="100" 
                      placeholder="85.5" 
                      {...field}
                      onChange={(e) => {
                        // Keep the value as a string instead of converting to number
                        const value = e.target.value;
                        field.onChange(value);
                      }}
                      value={field.value?.toString() || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel className="block mb-2">Subject-wise Marks <span className="text-red-500">*</span> (out of 100)</FormLabel>
              <div className="space-y-3">
                <FormField
                  control={form2.control}
                  name="mathMarks"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-gray-700">Mathematics</span>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="95" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                            }}
                            value={field.value?.toString() || ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form2.control}
                  name="scienceMarks"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-gray-700">Science</span>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="90" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                            }}
                            value={field.value?.toString() || ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form2.control}
                  name="englishMarks"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-gray-700">English</span>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="85" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                            }}
                            value={field.value?.toString() || ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form2.control}
                  name="hindiMarks"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-gray-700">Hindi</span>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="80" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                            }}
                            value={field.value?.toString() || ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form2.control}
                  name="socialScienceMarks"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <span className="w-32 text-sm text-gray-700">Social Science</span>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="88" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value ? parseInt(e.target.value) : undefined;
                              field.onChange(value);
                            }}
                            value={field.value?.toString() || ""}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit">
                Next: Preferences
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      {/* Step 3: Preferred Stream */}
      {step === 3 && (
        <Form {...form3}>
          <form onSubmit={form3.handleSubmit(onSubmitStep3)} className="space-y-4">
            <FormField
              control={form3.control}
              name="preferredStream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">Preferred Stream (optional)</FormLabel>
                  <p className="text-sm text-gray-500 mb-4">Select the stream you're interested in or leave it blank if you're uncertain.</p>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            className="space-y-4"
                          >
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Science (PCM)" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium block">
                                  Science (PCM - Physics, Chemistry, Mathematics)
                                </FormLabel>
                                <p className="text-xs text-gray-500 mt-1">
                                  Ideal for engineering, computer science, and technical fields
                                </p>
                              </div>
                            </FormItem>
                            
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Science (PCMB)" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium block">
                                  Science (PCMB - Physics, Chemistry, Mathematics, Biology)
                                </FormLabel>
                                <p className="text-xs text-gray-500 mt-1">
                                  Great for medical, biotechnology, and multi-disciplinary science fields
                                </p>
                              </div>
                            </FormItem>
                            
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Commerce" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium block">
                                  Commerce
                                </FormLabel>
                                <p className="text-xs text-gray-500 mt-1">
                                  Suited for business, accounting, finance, and economics
                                </p>
                              </div>
                            </FormItem>
                            
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Arts" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium block">
                                  Arts
                                </FormLabel>
                                <p className="text-xs text-gray-500 mt-1">
                                  Perfect for humanities, liberal arts, languages, and social sciences
                                </p>
                              </div>
                            </FormItem>
                            
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="" />
                              </FormControl>
                              <div>
                                <FormLabel className="font-medium block">
                                  I'm not sure yet (Skip this step)
                                </FormLabel>
                                <p className="text-xs text-gray-500 mt-1">
                                  We'll provide guidance based on your academic performance
                                </p>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
