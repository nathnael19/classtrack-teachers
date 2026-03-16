import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/features/dashboard/DashboardPage";
import CoursesPage from "@/features/courses/CoursesPage";
import CourseDetailsPage from "@/features/courses/CourseDetailsPage";
import SessionCreationPage from "@/features/sessions/SessionCreationPage";
import LiveSessionPage from "@/features/sessions/LiveSessionPage";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";
import ReportsPage from "@/features/reports/ReportsPage";
import ClassroomsPage from "@/features/classrooms/ClassroomsPage";
import SettingsPage from "@/features/settings/SettingsPage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import LandingPage from "@/features/landing/LandingPage";
import { Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "courses/:id", element: <CourseDetailsPage /> },
      { path: "sessions/new", element: <SessionCreationPage /> },
      { path: "sessions/live", element: <LiveSessionPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "classrooms", element: <ClassroomsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
