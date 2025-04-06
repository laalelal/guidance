import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-8">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground mb-8">
            Create a new password to secure your account
          </p>
          <ResetPasswordForm />
        </div>
      </div>

      {/* Right side hero section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <h2 className="text-4xl font-bold mb-4">Career Guidance System</h2>
          <p className="text-lg">
            Your gateway to making informed academic choices based on your strengths, interests, and performance.
          </p>
        </div>
      </div>
    </div>
  );
}