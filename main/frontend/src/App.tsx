import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Admin Dashboard
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/admin/Overview";
import AdminBlockedIPs from "./pages/admin/BlockedIPs";
import AdminIncidents from "./pages/admin/Incidents";

// Analyst Dashboard
import AnalystDashboard from "./pages/AnalystDashboard";
import AnalystOverview from "./pages/analyst/Overview";
import AnalystLogs from "./pages/analyst/Logs";
import AnalystIncidents from "./pages/analyst/Incidents";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="blocked-ips" element={<AdminBlockedIPs />} />
              <Route path="incidents" element={<AdminIncidents />} />
            </Route>

            {/* Analyst Routes */}
            <Route
              path="/analyst"
              element={
                <ProtectedRoute allowedRoles={["ANALYST"]}>
                  <AnalystDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AnalystOverview />} />
              <Route path="logs" element={<AnalystLogs />} />
              <Route path="incidents" element={<AnalystIncidents />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
