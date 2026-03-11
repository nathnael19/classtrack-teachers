import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/features/dashboard/DashboardPage";
import CoursesPage from "@/features/courses/CoursesPage";
import SessionCreationPage from "@/features/sessions/SessionCreationPage";
import LiveSessionPage from "@/features/sessions/LiveSessionPage";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";
import ReportsPage from "@/features/reports/ReportsPage";
import ClassroomsPage from "@/features/classrooms/ClassroomsPage";
import SettingsPage from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "sessions/new", element: <SessionCreationPage /> },
      { path: "sessions/live", element: <LiveSessionPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "classrooms", element: <ClassroomsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
