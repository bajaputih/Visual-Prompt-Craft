import * as wouter from "wouter";
const { Switch, Route } = wouter;
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Designer from "@/pages/designer";
import Layout from "@/components/Layout";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/designer/:id?" component={Designer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <TooltipProvider>
          <Toaster />
          <Layout>
            <AppRouter />
          </Layout>
        </TooltipProvider>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}

export default App;
