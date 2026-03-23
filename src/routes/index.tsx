import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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
import AdminDashboardPage from "@/features/admin/AdminDashboardPage";
import UsersManagementPage from "@/features/admin/UsersManagementPage";
import AddUserPage from "@/features/admin/AddUserPage";
import SetupPasswordPage from "@/features/auth/SetupPasswordPage";
import AcademicManagementPage from "@/features/admin/AcademicManagementPage";
import AddCoursePage from "@/features/admin/AddCoursePage";
import AddDepartmentPage from "@/features/admin/AddDepartmentPage";
import AddRoomPage from "@/features/admin/AddRoomPage";
import AddTermPage from "@/features/admin/AddTermPage";
import AdminSettingsPage from "@/features/admin/AdminSettingsPage";
import { useAuthStore } from "@/store/authStore";

/** Redirects unauthenticated users to /login */
const ProtectedRoute = () => {
  const { isAuthenticated, token } = useAuthStore();
  if (!isAuthenticated && !token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    // Protected layout: redirects to /login if not authenticated
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "courses", element: <CoursesPage /> },
          { path: "courses/:id", element: <CourseDetailsPage /> },
          { path: "sessions/new", element: <SessionCreationPage /> },
          { path: "sessions/live", element: <LiveSessionPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "classrooms", element: <ClassroomsPage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "admin/dashboard", element: <AdminDashboardPage /> },
          { path: "admin/users", element: <UsersManagementPage /> },
          { path: "admin/users/new", element: <AddUserPage /> },
          { path: "admin/academic", element: <AcademicManagementPage /> },
          { path: "admin/academic/courses/new", element: <AddCoursePage /> },
          { path: "admin/academic/departments/new", element: <AddDepartmentPage /> },
          { path: "admin/academic/rooms/new", element: <AddRoomPage /> },
          { path: "admin/academic/terms/new", element: <AddTermPage /> },
          { path: "admin/settings", element: <AdminSettingsPage /> },
        ],
      },
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
  {
    path: "/setup-password",
    element: <SetupPasswordPage />,
  },
]);
