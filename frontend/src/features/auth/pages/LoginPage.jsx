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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { decodeJwt } from "@/utils/jwt";
import {
  FlowerLogo,
  CalmWomanIllustration,
  FloralDecoration,
} from "@/components/shared/Illustrations";

const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
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
    defaultValues: { identifier: "", password: "" },
  });

  async function onSubmit(values) {
    try {
      const payload = { ...values, identifier: values.identifier.trim() };
      const response = await api.post("/auth/signin", payload);
      const { access_token } = response.data;
      const decoded = decodeJwt(access_token);
      if (!decoded) throw new Error("Invalid session token received");
      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        fullName: decoded.fullName || "",
        phoneNumber: decoded.phoneNumber || "",
        dateOfBirth: decoded.dateOfBirth || null,
      };
      setAuth(user, access_token);
      toast.success("Welcome back! 🌸");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(". ") : msg || "Login failed");
    }
  }

  const inputClass =
    "pl-10 h-11 rounded-xl text-sm border focus:ring-2 focus:ring-[rgba(246,165,142,0.3)] focus:border-[rgba(246,165,142,0.4)]";
  const inputStyle = {
    borderColor: "rgba(246,165,142,0.2)",
    background: "#FFFAF8",
  };

  return (
    <>
      <div className="min-h-screen relative flex items-center justify-center px-6 py-12" style={{ backgroundColor: "#FFF9F7" }}>
        {/* Decorative background image - full page center */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/home-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />

        {/* Left illustration overlay — hidden on mobile */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block z-10 overflow-hidden">
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(248,182,182,0.15), rgba(234,220,248,0.2))",
          }} />
          {/* Top left content */}
          <div className="absolute top-8 left-8 space-y-4 w-56 text-left">
            <img 
              src="/images/login-bg-transparent.png" 
              alt="Woman holding cup" 
              className="w-56 object-contain"
              style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }} 
            />
            <div className="space-y-2">
              <h2
                className="font-serif font-bold text-xl leading-tight"
                style={{ color: "#2D1F1A" }}
              >
                Your wellness sanctuary awaits
              </h2>
              <p className="text-xs font-medium leading-relaxed" style={{ color: "#8C7B74" }}>
                Track your cycle, understand your hormones, and live in harmony
                with your body.
              </p>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-16 -top-16 opacity-15">
              <FloralDecoration className="w-64 h-64" />
            </div>
            <div className="absolute -right-16 -bottom-16 opacity-15 rotate-180">
              <FloralDecoration className="w-64 h-64" />
            </div>
          </div>
        </div>

        {/* Center form panel */}
        <div className="relative z-20 w-full max-w-md space-y-8">
          {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="transition-transform duration-300 group-hover:rotate-12">
                <FlowerLogo className="w-10 h-10" />
              </div>
              <span
                className="text-2xl font-serif font-bold"
                style={{ color: "#2D1F1A" }}
              >
                Nura
              </span>
            </Link>

            <div>
              <h1
                className="font-serif font-bold text-3xl"
                style={{ color: "#2D1F1A" }}
              >
                Welcome back 🌸
              </h1>
              <p
                className="mt-1 text-sm font-medium"
                style={{ color: "#8C7B74" }}
              >
                Sign in with your email or phone number
              </p>
            </div>

            {/* Form card */}
            <div
              className="rounded-3xl border p-8 space-y-6"
              style={{
                background: "white",
                borderColor: "rgba(246,165,142,0.15)",
                boxShadow: "0 4px 32px rgba(200,150,130,0.1)",
              }}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: "#8C7B74" }}
                        >
                          Email or Phone
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div
                              className="absolute left-3 top-1/2 -translate-y-1/2"
                              style={{ color: "#F6A58E" }}
                            >
                              {field.value && /^\+/.test(field.value) ? (
                                <Phone className="h-4 w-4" />
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                            </div>
                            <Input
                              id="login-identifier"
                              className={inputClass}
                              style={inputStyle}
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

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel
                            className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: "#8C7B74" }}
                          >
                            Password
                          </FormLabel>
                          <button
                            type="button"
                            onClick={() => setForgotOpen(true)}
                            id="forgot-password-btn"
                            className="text-xs font-bold hover:underline"
                            style={{ color: "#F6A58E" }}
                          >
                            Forgot password?
                          </button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                              style={{ color: "#F6A58E" }}
                            />
                            <Input
                              id="login-password"
                              className={`${inputClass} pr-10`}
                              style={inputStyle}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              autoComplete="current-password"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                              style={{ color: "#8C7B74" }}
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
                    className="w-full h-12 rounded-2xl text-white font-bold text-sm gap-2"
                    style={{
                      background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                      boxShadow: "0 4px 16px rgba(246,165,142,0.35)",
                    }}
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Signing
                        in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>

              <p
                className="text-center text-sm font-medium"
                style={{ color: "#8C7B74" }}
              >
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold hover:underline"
                  style={{ color: "#F6A58E" }}
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-sm" id="forgot-password-dialog">
          <DialogHeader>
            <div
              className="mx-auto mb-3 h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(246,165,142,0.12)" }}
            >
              <Lock className="h-6 w-6" style={{ color: "#F6A58E" }} />
            </div>
            <DialogTitle className="text-center font-serif text-xl">
              Reset your password
            </DialogTitle>
            <DialogDescription
              className="text-center text-sm"
              style={{ color: "#8C7B74" }}
            >
              Password reset via WhatsApp OTP and email is coming soon.
              <br />
              <br />
              For urgent access, please contact{" "}
              <a
                href="mailto:support@nura.app"
                className="font-bold hover:underline"
                style={{ color: "#F6A58E" }}
              >
                support@nura.app
              </a>
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="outline"
            className="w-full mt-2 rounded-2xl"
            style={{ borderColor: "rgba(246,165,142,0.3)", color: "#F6A58E" }}
            onClick={() => setForgotOpen(false)}
          >
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
