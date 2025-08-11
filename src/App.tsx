
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Players from "./pages/Players";
import Reports from "./pages/Reports";
import Statistics from "./pages/Statistics";
import PlayerProfile from "./pages/PlayerProfile";
import Admin from "./pages/Admin";
import Messages from "./pages/Messages";
import Connections from "./pages/Connections";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useSupabaseRealtime } from "@/hooks/useRealtime";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user && role === 'admin' ? children : <Navigate to="/dashboard" replace />;
}

function RealtimeWrapper({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { user, loading } = useAuth();

  // attach realtime after auth ready
  useSupabaseRealtime(qc, user?.id);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return <>{children}</>;
}

const App = () => {
  console.log("App component rendering...");
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RealtimeWrapper>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
                <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/players" element={<ProtectedRoute><Layout><Players /></Layout></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                <Route path="/statistics" element={<ProtectedRoute><Layout><Statistics /></Layout></ProtectedRoute>} />
                <Route path="/player/:id" element={<ProtectedRoute><Layout><PlayerProfile /></Layout></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><Layout><Admin /></Layout></AdminRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
                <Route path="/connections" element={<ProtectedRoute><Layout><Connections /></Layout></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </RealtimeWrapper>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
