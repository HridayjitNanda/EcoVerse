import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);
  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);

      console.log("signed in");

      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);

      setError("The verification code you entered is incorrect.");
      setIsLoading(false);

      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting anonymous sign in...");
      await signIn("anonymous");
      console.log("Anonymous sign in successful");
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Frosting Sprinkles Navbar with Drips */}
      <nav
        className="sticky top-0 z-50 border-b-4 border-black relative overflow-visible"
        style={{
          backgroundColor: "#ffd7ea",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-1 text-sm font-extrabold hover:bg-white/90"
            onClick={() => navigate("/")}
          >
            <img src="/logo.svg" alt="EcoVerse" className="h-6 w-6" />
            EcoVerse
          </button>

          <div className="flex items-center gap-2 sm:-mr-4 lg:-mr-8 xl:-mr-12">
            <Button
              className="rounded-md border-2 border-black bg-white text-black hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              LOG IN
            </Button>
            <Button
              className="rounded-md border-2 border-black bg-white text-black hover:bg-white/90"
              onClick={() => navigate("/auth")}
            >
              SIGN-UP
            </Button>
          </div>
        </div>

        {/* Frosting seam + layered drip (matches reference) */}
        <svg
          viewBox="0 0 1440 170"
          className="pointer-events-none absolute left-0 right-0 -bottom-[74px] h-[96px] w-full drop-shadow-[0_8px_0_rgba(0,0,0,0.25)]"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="frostingTopGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffb2da" />
              <stop offset="60%" stopColor="#ff8dcb" />
              <stop offset="100%" stopColor="#ff5fb6" />
            </linearGradient>
            <linearGradient id="frostingBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9fd1" />
              <stop offset="70%" stopColor="#ff63b8" />
              <stop offset="100%" stopColor="#ff3f9f" />
            </linearGradient>
            <linearGradient id="biscuit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3c22b" />
              <stop offset="100%" stopColor="#e2ad13" />
            </linearGradient>
          </defs>

          {/* Top stitch dashes */}
          <g>
            <rect x="0" y="0" width="1440" height="8" fill="#ffd7ea" />
            {/* dashed stitches */}
            {
              /* 72 dashes across the width */
            }
            {Array.from({ length: 72 }).map((_, i) => {
              const x = 10 + i * 20;
              return (
                <rect key={i} x={x} y={2} width="10" height="4" rx="2" fill="#8b6bd9" />
              );
            })}
          </g>

          {/* Thin dark separator line (subtle) */}
          <rect x="0" y="14" width="1440" height="2" fill="#7b1a52" opacity="0.5" />

          {/* Pink frosting flat top */}
          <rect x="0" y="16" width="1440" height="28" fill="url(#frostingTopGloss)" />

          {/* Pink wavy drip body */}
          <path
            d="M0,44 
               C160,58 320,58 480,44 
               C640,30 800,30 960,44 
               C1120,58 1280,58 1440,44 
               L1440,120 
               C1380,132 1340,150 1290,150 
               C1240,150 1200,132 1140,120 
               C1080,108 1020,126 960,138 
               C900,150 840,132 780,120 
               C720,108 660,126 600,138 
               C540,150 480,132 420,120 
               C360,108 300,126 240,138 
               C180,150 120,132 60,120 
               C40,116 20,118 0,122
               Z"
            fill="url(#frostingBody)"
          />

          {/* Biscuit/Yellow base wave under frosting */}
          <path
            d="M0,128 
               C120,138 240,146 360,138 
               C480,130 600,138 720,146 
               C840,154 960,146 1080,138 
               C1200,130 1320,138 1440,146 
               L1440,170 L0,170 Z"
            fill="url(#biscuit)"
            stroke="#b9910b"
            strokeWidth="6"
          />
        </svg>
      </nav>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center h-full flex-col">
        <Card className="min-w-[350px] pb-0 border shadow-md">
          {step === "signIn" ? (
            <>
              <CardHeader className="text-center">
              <div className="flex justify-center">
                    <img
                      src="./logo.svg"
                      alt="Lock Icon"
                      width={64}
                      height={64}
                      className="rounded-lg mb-4 mt-4 cursor-pointer"
                      onClick={() => navigate("/")}
                    />
                  </div>
                <CardTitle className="text-xl">Get Started</CardTitle>
                <CardDescription>
                  Enter your email to log in or sign up
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSubmit}>
                <CardContent>
                  
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500">{error}</p>
                  )}
                  
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleGuestLogin}
                      disabled={isLoading}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Continue as Guest
                    </Button>
                  </div>
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="text-center mt-4">
                <CardTitle>Check your email</CardTitle>
                <CardDescription>
                  We've sent a code to {step.email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />

                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          // Find the closest form and submit it
                          const form = (e.target as HTMLElement).closest("form");
                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500 text-center">
                      {error}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Didn't receive a code?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => setStep("signIn")}
                    >
                      Try again
                    </Button>
                  </p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify code
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Use different email
                  </Button>
                </CardFooter>
              </form>
            </>
          )}

          <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
            Secured by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              vly.ai
            </a>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}