import { useState } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

type AuthView = 'login' | 'register' | 'forgotPassword';

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  
  // Redirect to home if already logged in
  if (user && !isLoading) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8">
          {authView === 'login' && (
            <LoginForm 
              onSwitchToSignup={() => setAuthView('register')} 
              onSwitchToForgotPassword={() => setAuthView('forgotPassword')}
            />
          )}
          
          {authView === 'register' && (
            <RegisterForm 
              onSwitchToLogin={() => setAuthView('login')} 
            />
          )}
          
          {authView === 'forgotPassword' && (
            <ForgotPasswordForm 
              onSwitchToLogin={() => setAuthView('login')} 
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
