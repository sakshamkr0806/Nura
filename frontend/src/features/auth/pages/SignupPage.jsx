import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  X,
  Phone,
  Mail,
  Lock,
  User,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isAfter, parse, isValid } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { decodeJwt } from "@/utils/jwt";

const E164_REGEX = /^\+[1-9]\d{6,14}$/;

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
  { label: "One special character", test: (v) => /[@$!%*?&^#\-_=+<>]/.test(v) },
];

function getPasswordStrength(password) {
  if (!password) return 0;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  return passed;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const STRENGTH_COLORS = [
  "",
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-blue-500",
  "bg-green-500",
];

const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    dateOfBirth: z
      .date({
        required_error: "Date of birth is required",
      })
      .refine((date) => !isAfter(date, new Date()), {
        message: "Date of birth cannot be in the future",
      }),
    phoneNumber: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || E164_REGEX.test(v), {
        message: "Use E.164 format: +919876543210",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
      .regex(/[a-z]/, { message: "Must include a lowercase letter" })
      .regex(/\d/, { message: "Must include a number" })
      .regex(/[@$!%*?&^#\-_=+<>]/, {
        message: "Must include a special character",
      }),
    confirmPassword: z.string(),
    emailNotifications: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const DateField = ({ field }) => {
  const [inputValue, setInputValue] = useState(
    field.value ? format(field.value, "dd/MM/yyyy") : "",
  );

  useEffect(() => {
    if (field.value) {
      const formatted = format(field.value, "dd/MM/yyyy");
      if (formatted !== inputValue && inputValue.length === 10) {
        setInputValue(formatted);
      } else if (!inputValue) {
        setInputValue(formatted);
      }
    }
  }, [field.value, inputValue]);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Date of Birth</FormLabel>
      <div className="relative flex items-center">
        <FormControl>
          <Input
            placeholder="DD/MM/YYYY"
            className="h-10 border-muted-foreground/20 pr-12 focus-visible:ring-primary/30"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val);
              if (val.length === 10) {
                const parsedDate = parse(val, "dd/MM/yyyy", new Date());
                if (isValid(parsedDate)) {
                  field.onChange(parsedDate);
                }
              }
            }}
          />
        </FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-primary transition-colors"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="sr-only">Pick a date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={(date) => {
                field.onChange(date);
                if (date) {
                  setInputValue(format(date, "dd/MM/yyyy"));
                }
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1940}
              toYear={new Date().getFullYear()}
              className="rounded-md border shadow"
            />
          </PopoverContent>
        </Popover>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default function SignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dateOfBirth: undefined,
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      emailNotifications: true,
    },
  });

  const watchedPassword = form.watch("password");
  const strength = getPasswordStrength(watchedPassword);

  async function onSubmit(values) {
    try {
      const signupPayload = {
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        dateOfBirth: values.dateOfBirth.toISOString(),
        password: values.password,
        emailNotifications: values.emailNotifications,
        ...(values.phoneNumber
          ? { phoneNumber: values.phoneNumber.trim() }
          : {}),
      };
      const response = await api.post("/auth/signup", signupPayload);
      const { access_token } = response.data;
      const decoded = decodeJwt(access_token);

      if (!decoded) {
        throw new Error("Invalid session token received");
      }

      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        fullName: decoded.fullName || values.fullName,
        phoneNumber: decoded.phoneNumber || "",
        dateOfBirth: decoded.dateOfBirth,
      };
      setAuth(user, access_token);

      toast.success("Account created! Welcome to CycleWell 🌸");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      const text = Array.isArray(msg) ? msg.join(". ") : msg || "Signup failed";
      toast.error(text);
    }
  }

  return (
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
            Create your account
          </CardTitle>
          <CardDescription>
            Join CycleWell and take control of your health journey
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="Jane Doe"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => <DateField field={field} />}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="jane@example.com"
                          type="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number{" "}
                      <span className="text-muted-foreground font-normal text-xs">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="+91 98765 43210"
                          type="tel"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Include country code, e.g. +91 for India
                    </p>
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9 pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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

                    {/* Password strength bar */}
                    {watchedPassword && (
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength
                                  ? STRENGTH_COLORS[strength]
                                  : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs font-medium ${strength < 3 ? "text-red-500" : strength < 5 ? "text-yellow-600" : "text-green-600"}`}
                        >
                          {STRENGTH_LABELS[strength]}
                        </p>
                        <ul className="space-y-0.5">
                          {PASSWORD_RULES.map((rule) => {
                            const passed = rule.test(watchedPassword);
                            return (
                              <li
                                key={rule.label}
                                className={`flex items-center gap-1.5 text-xs transition-colors ${
                                  passed
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {passed ? (
                                  <Check className="h-3 w-3 shrink-0" />
                                ) : (
                                  <X className="h-3 w-3 shrink-0" />
                                )}
                                {rule.label}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9 pr-10"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={
                            showConfirm
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirm ? (
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

              {/* Email notification opt-in */}
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <FormControl>
                      <Checkbox
                        id="email-notifications-opt-in"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel
                        htmlFor="email-notifications-opt-in"
                        className="cursor-pointer font-medium text-sm leading-none"
                      >
                        📧 Email Health Reminders
                      </FormLabel>
                      <p className="text-xs text-muted-foreground leading-snug">
                        Receive cycle predictions and daily log reminders via
                        email
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                id="signup-submit-btn"
                type="submit"
                className="w-full gap-2 font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-center gap-2 pt-0">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
