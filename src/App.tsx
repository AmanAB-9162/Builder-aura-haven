import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormBuilderProvider } from "@/context/FormBuilderContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { FormBuilder } from "./pages/FormBuilder";
import { FormFiller } from "./pages/FormFiller";
import { FormPreview } from "./pages/FormPreview";
import { FormResponses } from "./pages/FormResponses";
import { Templates } from "./pages/Templates";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FormBuilderProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<FormBuilder />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/form/:formId" element={<FormFiller />} />
            <Route path="/preview/:formId" element={<FormPreview />} />
            <Route path="/responses/:formId" element={<FormResponses />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FormBuilderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
