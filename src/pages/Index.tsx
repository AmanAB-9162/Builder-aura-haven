import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100">
            Build Beautiful Forms
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Create stunning, interactive forms with our powerful drag-and-drop
            builder. Collect responses, analyze data, and streamline your
            workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-3"
              onClick={() => navigate("/builder")}
            >
              Start Building
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3"
              onClick={() => navigate("/templates")}
            >
              Browse Templates
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Drag & Drop Builder
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Intuitive interface for creating forms without any coding
              knowledge
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Smart Validation
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Built-in validation rules to ensure data quality and user
              experience
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Response Analytics
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              View and analyze form responses with detailed insights and exports
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Everything you need to create powerful forms
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Multi-step Forms
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Break long forms into manageable steps
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Responsive Design
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Forms that work perfectly on all devices
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Pre-built Templates
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Start quickly with professional templates
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded border-2 border-dashed border-slate-300 dark:border-slate-600"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4"></div>
              <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded border-2 border-dashed border-slate-300 dark:border-slate-600"></div>
              <div className="flex gap-2">
                <div className="h-6 w-6 bg-slate-300 dark:bg-slate-600 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1 mt-1"></div>
              </div>
              <Button className="w-full" disabled>
                Submit Form
              </Button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Create your first form in minutes. No coding required, no credit
            card needed.
          </p>
          <Button
            size="lg"
            className="text-lg px-12 py-4"
            onClick={() => navigate("/builder")}
          >
            Create Your First Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
