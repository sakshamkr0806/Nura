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
import api from "@/api/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { decodeJwt } from "@/utils/jwt";
import {
  FlowerLogo,
  FloralDecoration,
} from "@/components/shared/Illustrations";

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
  return PASSWORD_RULES.filter((r) => r.test(password)).length;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const STRENGTH_COLORS = [
  "",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#3B82F6",
  "#22C55E",
];

const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    dateOfBirth: z
      .date({ required_error: "Date of birth is required" })
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
      if (formatted !== inputValue && inputValue.length === 10)
        setInputValue(formatted);
      else if (!inputValue) setInputValue(formatted);
    }
  }, [field.value, inputValue]);

  const inputClass =
    "h-11 rounded-xl text-sm border pr-12 focus:ring-2 focus:ring-[rgba(246,165,142,0.3)]";
  const inputStyle = {
    borderColor: "rgba(246,165,142,0.2)",
    background: "#FFFAF8",
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: "#8C7B74" }}
      >
        Date of Birth
      </FormLabel>
      <div className="relative flex items-center">
        <FormControl>
          <Input
            placeholder="DD/MM/YYYY"
            className={inputClass}
            style={inputStyle}
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val);
              if (val.length === 10) {
                const parsedDate = parse(val, "dd/MM/yyyy", new Date());
                if (isValid(parsedDate)) field.onChange(parsedDate);
              }
            }}
          />
        </FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-11 w-11 transition-colors"
              style={{ color: "#8C7B74" }}
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
                if (date) setInputValue(format(date, "dd/MM/yyyy"));
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={1940}
              toYear={new Date().getFullYear()}
              className="rounded-2xl border shadow"
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
      if (!decoded) throw new Error("Invalid session token received");
      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        fullName: decoded.fullName || values.fullName,
        phoneNumber: decoded.phoneNumber || "",
        dateOfBirth: decoded.dateOfBirth,
      };
      setAuth(user, access_token);
      toast.success("Welcome to Nura! 🌸");
      navigate("/dashboard");
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(". ") : msg || "Signup failed");
    }
  }

  const inputClass =
    "pl-10 h-11 rounded-xl text-sm border focus:ring-2 focus:ring-[rgba(246,165,142,0.3)]";
  const inputStyle = {
    borderColor: "rgba(246,165,142,0.2)",
    background: "#FFFAF8",
  };
  const labelClass = "text-xs font-bold uppercase tracking-wider";
  const labelStyle = { color: "#8C7B74" };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{ background: "#FFF9F7" }}
    >
      {/* Bg deco */}
      <div className="absolute -left-12 -top-12 opacity-8 pointer-events-none">
        <FloralDecoration className="w-64 h-64" />
      </div>
      <div className="absolute -right-12 -bottom-12 opacity-8 pointer-events-none rotate-180">
        <FloralDecoration className="w-64 h-64" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <FlowerLogo className="w-10 h-10" />
          <span
            className="text-2xl font-serif font-bold"
            style={{ color: "#2D1F1A" }}
          >
            Nura
          </span>
        </div>

        <div>
          <h1
            className="font-serif font-bold text-3xl"
            style={{ color: "#2D1F1A" }}
          >
            Create your sanctuary 🌸
          </h1>
          <p className="mt-1 text-sm font-medium" style={{ color: "#8C7B74" }}>
            Join Nura and take control of your hormonal health journey.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl border p-8"
          style={{
            background: "white",
            borderColor: "rgba(246,165,142,0.15)",
            boxShadow: "0 4px 32px rgba(200,150,130,0.1)",
          }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass} style={labelStyle}>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: "#F6A58E" }}
                        />
                        <Input
                          className={inputClass}
                          style={inputStyle}
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
                    <FormLabel className={labelClass} style={labelStyle}>
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: "#F6A58E" }}
                        />
                        <Input
                          className={inputClass}
                          style={inputStyle}
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

              {/* Phone */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass} style={labelStyle}>
                      Phone{" "}
                      <span
                        className="normal-case font-normal"
                        style={{ color: "#8C7B74" }}
                      >
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: "#F6A58E" }}
                        />
                        <Input
                          className={inputClass}
                          style={inputStyle}
                          placeholder="+91 98765 43210"
                          type="tel"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs" style={{ color: "#8C7B74" }}>
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
                    <FormLabel className={labelClass} style={labelStyle}>
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: "#F6A58E" }}
                        />
                        <Input
                          className={`${inputClass} pr-10`}
                          style={inputStyle}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
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
                    {watchedPassword && (
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="h-1.5 flex-1 rounded-full transition-all duration-300"
                              style={{
                                background:
                                  i <= strength
                                    ? STRENGTH_COLORS[strength]
                                    : "#E5E7EB",
                              }}
                            />
                          ))}
                        </div>
                        <p
                          className="text-xs font-bold"
                          style={{
                            color: STRENGTH_COLORS[strength] || "#8C7B74",
                          }}
                        >
                          {STRENGTH_LABELS[strength]}
                        </p>
                        <ul className="space-y-0.5">
                          {PASSWORD_RULES.map((rule) => {
                            const passed = rule.test(watchedPassword);
                            return (
                              <li
                                key={rule.label}
                                className="flex items-center gap-1.5 text-xs transition-colors"
                                style={{
                                  color: passed ? "#22C55E" : "#8C7B74",
                                }}
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
                    <FormLabel className={labelClass} style={labelStyle}>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                          style={{ color: "#F6A58E" }}
                        />
                        <Input
                          className={`${inputClass} pr-10`}
                          style={inputStyle}
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: "#8C7B74" }}
                          aria-label={showConfirm ? "Hide" : "Show"}
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

              {/* Email opt-in */}
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem
                    className="flex items-start gap-3 rounded-2xl border p-4"
                    style={{
                      borderColor: "rgba(246,165,142,0.15)",
                      background: "rgba(255,249,247,0.6)",
                    }}
                  >
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
                        className="cursor-pointer text-sm font-semibold"
                        style={{ color: "#2D1F1A" }}
                      >
                        📧 Email Health Reminders
                      </FormLabel>
                      <p
                        className="text-xs leading-snug"
                        style={{ color: "#8C7B74" }}
                      >
                        Receive cycle predictions and daily log reminders via
                        email.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                id="signup-submit-btn"
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
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <p
            className="text-center text-sm font-medium mt-5"
            style={{ color: "#8C7B74" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold hover:underline"
              style={{ color: "#F6A58E" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
