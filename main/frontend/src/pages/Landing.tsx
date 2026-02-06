import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Terminal, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@/assets/cyber-bg.jpg";
import { useAuth } from "@/context/AuthContext";
import { localLogin, localSignup } from "@/services/auth.service";
import { toast } from "sonner";
import type { UserRole } from "@/types/api";

type AuthMode = "login" | "signup";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("ANALYST");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      if (mode === "login") {
        response = await localLogin(email, password);
        toast.success("Access granted. Welcome back.");
      } else {
        response = await localSignup({ email, password, role });
        toast.success("Account created. Access granted.");
      }

      login(response.token, response.user);

      // Navigate based on role
      if (response.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/analyst");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Authentication failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // For Google auth, you'd integrate with Google Sign-In SDK
    // This is a placeholder - in production, use @react-oauth/google
    toast.info("Google authentication requires backend configuration");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${"@/assets/cyber-bg.jpg"})` }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
          <div className="max-w-md text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Shield className="w-24 h-24 text-primary" />
                <div className="absolute inset-0 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 terminal-text">
              MicroSOC
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Command Center
            </p>

            <div className="space-y-4 text-left font-mono text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                <span>Real-time threat detection</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                <span>Incident correlation engine</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                <span>Geo-mapped attack visualization</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                <span>Automated threat response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <Shield className="w-16 h-16 text-primary" />
            </div>

            <div className="glow-card bg-card border border-border rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {mode === "login" ? "Secure Access" : "Create Account"}
                </h2>
                <p className="text-muted-foreground text-sm font-mono">
                  {mode === "login"
                    ? "Enter credentials to access command center"
                    : "Register for system access"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@microsoc.io"
                      className="pl-10 bg-input border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-input border-border focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Access Level
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Select
                        value={role}
                        onValueChange={(value: UserRole) => setRole(value)}
                      >
                        <SelectTrigger className="pl-10 bg-input border-border">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ANALYST">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-primary" />
                              Analyst
                            </span>
                          </SelectItem>
                          <SelectItem value="ADMIN">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-destructive" />
                              Administrator
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : mode === "login" ? (
                    "Access System"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-card text-muted-foreground">
                      OR
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4 border-border hover:bg-accent"
                  onClick={handleGoogleAuth}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    New operator?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Request access
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground font-mono">
              SECURE CONNECTION ESTABLISHED • TLS 1.3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
