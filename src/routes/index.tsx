import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuthStore } from "@/store/authStore";

// Lazy-loaded components
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const CoursesPage = lazy(() => import("@/features/courses/CoursesPage"));
const CourseDetailsPage = lazy(() => import("@/features/courses/CourseDetailsPage"));
const SessionCreationPage = lazy(() => import("@/features/sessions/SessionCreationPage"));
const LiveSessionPage = lazy(() => import("@/features/sessions/LiveSessionPage"));
const LeaveRequestsPage = lazy(() => import("@/features/sessions/LeaveRequestsPage"));
const AnalyticsPage = lazy(() => import("@/features/analytics/AnalyticsPage"));
const ReportsPage = lazy(() => import("@/features/reports/ReportsPage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));
const LoginPage = lazy(() => import("@/features/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/RegisterPage"));
const LandingPage = lazy(() => import("@/features/landing/LandingPage"));
const AdminDashboardPage = lazy(() => import("@/features/admin/AdminDashboardPage"));
const UsersManagementPage = lazy(() => import("@/features/admin/UsersManagementPage"));
const AddUserPage = lazy(() => import("@/features/admin/AddUserPage"));
const EditUserPage = lazy(() => import("@/features/admin/EditUserPage"));
const SetupPasswordPage = lazy(() => import("@/features/auth/SetupPasswordPage"));
const AcademicManagementPage = lazy(() => import("@/features/admin/AcademicManagementPage"));
const AddCoursePage = lazy(() => import("@/features/admin/AddCoursePage"));
const AddDepartmentPage = lazy(() => import("@/features/admin/AddDepartmentPage"));
const AddRoomPage = lazy(() => import("@/features/admin/AddRoomPage"));
const AddTermPage = lazy(() => import("@/features/admin/AddTermPage"));
const AdminSettingsPage = lazy(() => import("@/features/admin/AdminSettingsPage"));

/** Standard Loading Fallback */
const PageLoader = () => (
  <div className="h-[60vh] w-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 animate-pulse italic">Loading Module...</p>
    </div>
  </div>
);

/** Shows loading spinner while identity is being rehydrated, then redirects unauthenticated users to /login */
const ProtectedRoute = () => {
  const { isAuthenticated, token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 animate-pulse italic">Signing you in...</p>
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
    element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense>,
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
              { path: "dashboard", element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
              { path: "courses", element: <Suspense fallback={<PageLoader />}><CoursesPage /></Suspense> },
              { path: "courses/:id", element: <Suspense fallback={<PageLoader />}><CourseDetailsPage /></Suspense> },
              { path: "sessions/new", element: <Suspense fallback={<PageLoader />}><SessionCreationPage /></Suspense> },
              { path: "sessions/live", element: <Suspense fallback={<PageLoader />}><LiveSessionPage /></Suspense> },
              { path: "sessions/leave-requests", element: <Suspense fallback={<PageLoader />}><LeaveRequestsPage /></Suspense> },
              { path: "analytics", element: <Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense> },
              { path: "reports", element: <Suspense fallback={<PageLoader />}><ReportsPage /></Suspense> },
              { path: "settings", element: <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense> },
            ],
          },
          {
            // Admin-only routes — non-admins are blocked
            element: <AdminRoute />,
            children: [
              { path: "admin/dashboard", element: <Suspense fallback={<PageLoader />}><AdminDashboardPage /></Suspense> },
              { path: "admin/users", element: <Suspense fallback={<PageLoader />}><UsersManagementPage /></Suspense> },
              { path: "admin/users/new", element: <Suspense fallback={<PageLoader />}><AddUserPage /></Suspense> },
              { path: "admin/users/edit/:id", element: <Suspense fallback={<PageLoader />}><EditUserPage /></Suspense> },
              { path: "admin/academic", element: <Suspense fallback={<PageLoader />}><AcademicManagementPage /></Suspense> },
              { path: "admin/academic/courses/new", element: <Suspense fallback={<PageLoader />}><AddCoursePage /></Suspense> },
              { path: "admin/academic/departments/new", element: <Suspense fallback={<PageLoader />}><AddDepartmentPage /></Suspense> },
              { path: "admin/academic/rooms/new", element: <Suspense fallback={<PageLoader />}><AddRoomPage /></Suspense> },
              { path: "admin/academic/terms/new", element: <Suspense fallback={<PageLoader />}><AddTermPage /></Suspense> },
              { path: "admin/leave-requests", element: <Suspense fallback={<PageLoader />}><LeaveRequestsPage /></Suspense> },
              { path: "admin/settings", element: <Suspense fallback={<PageLoader />}><AdminSettingsPage /></Suspense> },
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
      { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "/register", element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
      { path: "/setup-password", element: <Suspense fallback={<PageLoader />}><SetupPasswordPage /></Suspense> },
    ],
  },
]);
