
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import { useSupabaseRealtime } from "@/hooks/useRealtime";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user ? children : <Login />;
}

function RealtimeWrapper({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { user, loading } = useAuth();

  // attach realtime after auth ready
  useSupabaseRealtime(qc, user?.id);

  if (loading) return <div>Loading auth...</div>;
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
                <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
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
