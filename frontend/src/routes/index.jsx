import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { LoadingFallback } from "@/components/shared/LoadingFallback";

// Helper to handle chunk loading errors due to deployment updates
const safeLazy = (importFunc) => {
  return lazy(async () => {
    try {
      return await importFunc();
    } catch (error) {
      console.error("Lazy import failed:", error);
      const isChunkError =
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("dynamically imported module") ||
        error.message?.includes("Loading chunk") ||
        error.message?.includes("ChunkLoadError") ||
        error.name === "TypeError";
      if (isChunkError && typeof window !== "undefined") {
        window.location.reload();
        return new Promise(() => {}); // Wait for reload
      }
      throw error;
    }
  });
};

// Lazy-loaded pages
<<<<<<< HEAD
const Home = safeLazy(() => import("@/pages/Home"));
const Dashboard = safeLazy(() => import("@/pages/Dashboard"));
const Calendar = safeLazy(() => import("@/pages/Calendar"));
const Reports = safeLazy(() => import("@/pages/Reports"));
const Education = safeLazy(() => import("@/pages/Education"));
const ArticleDetail = safeLazy(() => import("@/pages/ArticleDetail"));
const Profile = safeLazy(() => import("@/pages/Profile"));
const LoginPage = safeLazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = safeLazy(() => import("@/features/auth/pages/SignupPage"));
const PlaceholderPage = safeLazy(() => import("@/pages/PlaceholderPage"));
const Seeds = safeLazy(() => import("@/pages/Seeds"));
const OnboardingPage = safeLazy(
=======
const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const Reports = lazy(() => import("@/pages/Reports"));
const Education = lazy(() => import("@/pages/Education"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const Profile = lazy(() => import("@/pages/Profile"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const PlaceholderPage = lazy(() => import("@/pages/PlaceholderPage"));
const Seeds = lazy(() => import("@/pages/Seeds"));
const Community = lazy(() => import("@/pages/Community"));
const OnboardingPage = lazy(
>>>>>>> 53d8e9b (Fix linting errors in ReportPreview)
  () => import("@/features/onboarding/pages/OnboardingPage"),
);

const wrap = (Component, props = {}) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

export const router = createBrowserRouter([
  // Public routes
  { path: "/", element: wrap(Home) },
  { path: "/login", element: wrap(LoginPage) },
  { path: "/signup", element: wrap(SignupPage) },

  // Protected onboarding route
  {
    path: "/onboarding",
    element: <ProtectedRoute>{wrap(OnboardingPage)}</ProtectedRoute>,
  },

  // Protected app routes
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: wrap(Dashboard) },
      { path: "calendar", element: wrap(Calendar) },
      { path: "reports", element: wrap(Reports) },
      { path: "education", element: wrap(Education) },
      { path: "education/:slug", element: wrap(ArticleDetail) },
      { path: "profile", element: wrap(Profile) },
      {
        path: "log",
        element: wrap(PlaceholderPage, {
          title: "Daily Health Log",
          description:
            "An illustrated daily logging experience is being crafted for you — track symptoms, energy, sleep, and water in one beautiful flow.",
        }),
      },
      {
        path: "coach",
        element: wrap(PlaceholderPage, {
          title: "AI Wellness Coach",
          description:
            "Your personalised botanical advisor — conversational hormone coaching, nutritional guidance, and cycle education coming soon.",
        }),
      },
      { path: "seeds", element: wrap(Seeds) },
      { path: "community", element: wrap(Community) },
      {
        path: "*",
        element: (
          <div
            className="p-10 text-center font-serif text-2xl"
            style={{ color: "#8C7B74" }}
          >
            Page not found 🌸
          </div>
        ),
      },
    ],
  },
]);
