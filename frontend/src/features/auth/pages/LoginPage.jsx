import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Mail, Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Email or phone number is required" })
    .refine(
      (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+[1-9]\d{6,14}$/.test(v),
      {
        message:
          "Enter a valid email or E.164 phone number (e.g. +919876543210)",
      },
    ),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await api.post("/auth/signin", values);
      const { access_token } = response.data;
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name || "",
        phoneNumber: payload.phoneNumber || "",
      };
      setAuth(user, access_token);
      toast.success("Welcome back! 🌸");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      const text = Array.isArray(msg) ? msg.join(". ") : msg || "Login failed";
      toast.error(text);
    }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-10">
        <Card className="w-full max-w-md shadow-lg border-0 ring-1 ring-border/50">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-lg">🌸</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                CycleWell
              </span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in with your email or phone number
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Identifier — email OR phone */}
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email or Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {field.value && /^\+/.test(field.value) ? (
                              <Phone className="h-4 w-4" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </div>
                          <Input
                            id="login-identifier"
                            className="pl-9"
                            placeholder="jane@example.com or +919876543210"
                            autoComplete="username"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <button
                          type="button"
                          onClick={() => setForgotOpen(true)}
                          className="text-xs text-primary hover:underline font-medium"
                          id="forgot-password-btn"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            className="pl-9 pr-10"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full gap-2 font-semibold"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-center gap-2 pt-0">
            <div className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Create one
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-sm" id="forgot-password-dialog">
          <DialogHeader>
            <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-center">
              Reset your password
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Password reset via WhatsApp OTP and email is coming soon.
              <br />
              <br />
              For urgent access, please contact{" "}
              <a
                href="mailto:support@cyclewell.app"
                className="text-primary hover:underline font-medium"
              >
                support@cyclewell.app
              </a>
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => setForgotOpen(false)}
          >
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
