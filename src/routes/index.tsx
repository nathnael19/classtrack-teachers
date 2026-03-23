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
import EditUserPage from "@/features/admin/EditUserPage";
import SetupPasswordPage from "@/features/auth/SetupPasswordPage";
import AcademicManagementPage from "@/features/admin/AcademicManagementPage";
import AddCoursePage from "@/features/admin/AddCoursePage";
import AddDepartmentPage from "@/features/admin/AddDepartmentPage";
import AddRoomPage from "@/features/admin/AddRoomPage";
import AddTermPage from "@/features/admin/AddTermPage";
import AdminSettingsPage from "@/features/admin/AdminSettingsPage";
import { useAuthStore } from "@/store/authStore";

/** Shows loading spinner while identity is being rehydrated, then redirects unauthenticated users to /login */
const ProtectedRoute = () => {
  const { isAuthenticated, token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 animate-pulse italic">Synchronizing Identity...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

/** Redirects already-authenticated users to their correct dashboard */
const GuestRoute = () => {
  const { isAuthenticated, user, token, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (isAuthenticated || token) {
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

/** Student/teacher pages — redirects admins to /admin/dashboard */
const UserRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Outlet />;
};

/** Admin-only pages — redirects non-admins to /dashboard */
const AdminRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    // Publicly accessible landing page
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
          {
            // Student & teacher routes — admins are blocked
            element: <UserRoute />,
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
            ],
          },
          {
            // Admin-only routes — non-admins are blocked
            element: <AdminRoute />,
            children: [
              { path: "admin/dashboard", element: <AdminDashboardPage /> },
              { path: "admin/users", element: <UsersManagementPage /> },
              { path: "admin/users/new", element: <AddUserPage /> },
              { path: "admin/users/edit/:id", element: <EditUserPage /> },
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
    ],
  },
  {
    // Auth pages — redirects logged-in users to their dashboard
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/setup-password", element: <SetupPasswordPage /> },
    ],
  },
]);
