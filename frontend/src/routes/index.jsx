import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { LoadingFallback } from "@/components/shared/LoadingFallback";

// Lazy-loaded pages
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
      {
        path: "seeds",
        element: wrap(PlaceholderPage, {
          title: "Seed Cycling Hub",
          description:
            "Track your daily seed ritual — flax, pumpkin, sesame, and sunflower — to naturally harmonise estrogen and progesterone.",
        }),
      },
      {
        path: "community",
        element: wrap(PlaceholderPage, {
          title: "Sisterhood Sanctuary",
          description:
            "A safe, anonymous space to connect, share experiences, and find comfort with thousands of women on similar paths.",
        }),
      },
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
