import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MarkAiCreatePost from "@/components/MarkAiCreatePost";
import Dashboard from "@/pages/Dashboard";
import Calendar from "@/pages/Calendar";
import Mind from "@/pages/Mind";
import { AuthModalProvider } from "@/components/auth/AuthModalProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthInit } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import EditPostProvider from "@/context/EditPostProvider";

// AuthInitializer component to load auth state on app start
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthInit();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      
      {/* Protected routes - require authentication */}
      <ProtectedRoute path="/create" component={MarkAiCreatePost} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/calendar" component={Calendar} />
      <ProtectedRoute path="/mind" component={Mind} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthModalProvider>
          <EditPostProvider>
            <Toaster />
            <AuthInitializer>
              <Router />
            </AuthInitializer>
          </EditPostProvider>
        </AuthModalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
