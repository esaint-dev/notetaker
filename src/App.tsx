import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/notes" /> : <Login />
                }
              />
              <Route
                path="/signup"
                element={
                  isAuthenticated ? <Navigate to="/notes" /> : <Signup />
                }
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route
                path="/notes"
                element={
                  isAuthenticated === false ? (
                    <Navigate to="/login" />
                  ) : (
                    <Notes />
                  )
                }
              />
              <Route
                path="/profile"
                element={
                  isAuthenticated === false ? (
                    <Navigate to="/login" />
                  ) : (
                    <Profile />
                  )
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;