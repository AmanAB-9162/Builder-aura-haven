import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TextField } from "@/components/form-fields/TextField";
import { TextareaField } from "@/components/form-fields/TextareaField";
import { DropdownField } from "@/components/form-fields/DropdownField";
import { CheckboxField } from "@/components/form-fields/CheckboxField";
import { RadioField } from "@/components/form-fields/RadioField";
import { DateField } from "@/components/form-fields/DateField";
import { Form, FormField } from "@/types/form";
import { loadForm } from "@/utils/formStorage";
import { AlertCircle, Eye, Edit, ExternalLink } from "lucide-react";

export const FormPreview: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sampleData, setSampleData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (formId) {
      loadFormData();
      generateSampleData();
    }
  }, [formId]);

  const loadFormData = () => {
    if (!formId) return;

    const formData = loadForm(formId);
    if (formData) {
      setForm(formData);
    }
    setLoading(false);
  };

  const generateSampleData = () => {
    // Generate sample data for preview
    const sampleResponses: Record<string, any> = {};

    if (form) {
      form.fields.forEach((field) => {
        switch (field.type) {
          case "text":
            sampleResponses[field.id] = "Sample text response";
            break;
          case "email":
            sampleResponses[field.id] = "user@example.com";
            break;
          case "phone":
            sampleResponses[field.id] = "+1 (555) 123-4567";
            break;
          case "number":
            sampleResponses[field.id] = "42";
            break;
          case "textarea":
            sampleResponses[field.id] =
              "This is a sample multi-line response that shows how longer text inputs will appear in the form.";
            break;
          case "dropdown":
            if (field.options && field.options.length > 0) {
              sampleResponses[field.id] = field.options[0].value;
            }
            break;
          case "radio":
            if (field.options && field.options.length > 0) {
              sampleResponses[field.id] = field.options[0].value;
            }
            break;
          case "checkbox":
            if (field.options && field.options.length > 0) {
              sampleResponses[field.id] = [field.options[0].value];
            }
            break;
          case "date":
            sampleResponses[field.id] = new Date().toISOString().split("T")[0];
            break;
        }
      });
    }

    setSampleData(sampleResponses);
  };

  const getCurrentStepFields = (): FormField[] => {
    if (!form) return [];

    if (form.isMultiStep && form.steps.length > 0) {
      const currentStepData = form.steps.sort((a, b) => a.order - b.order)[
        currentStep
      ];
      return form.fields.filter((field) =>
        currentStepData.fields.includes(field.id),
      );
    }

    return form.fields;
  };

  const handleNextStep = () => {
    if (form && currentStep < form.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderField = (field: FormField) => {
    const fieldProps = {
      field,
      value: sampleData[field.id],
      onChange: () => {}, // No-op for preview
      isBuilder: false,
    };

    switch (field.type) {
      case "text":
      case "email":
      case "phone":
      case "number":
        return <TextField key={field.id} {...fieldProps} />;
      case "textarea":
        return <TextareaField key={field.id} {...fieldProps} />;
      case "dropdown":
        return <DropdownField key={field.id} {...fieldProps} />;
      case "checkbox":
        return <CheckboxField key={field.id} {...fieldProps} />;
      case "radio":
        return <RadioField key={field.id} {...fieldProps} />;
      case "date":
        return <DateField key={field.id} {...fieldProps} />;
      default:
        return (
          <Alert key={field.id}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unsupported field type: {field.type}
            </AlertDescription>
          </Alert>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form preview...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The form you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepData = form.isMultiStep
    ? form.steps.sort((a, b) => a.order - b.order)[currentStep]
    : null;
  const currentStepFields = getCurrentStepFields().sort(
    (a, b) => a.order - b.order,
  );
  const isLastStep = !form.isMultiStep || currentStep === form.steps.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Form Preview</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Preview Mode
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/form/${form.id}`)}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Open Live Form
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/builder")}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            {form.description && (
              <p className="text-muted-foreground">{form.description}</p>
            )}

            {/* Step Info */}
            {form.isMultiStep && currentStepData && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{currentStepData.title}</h3>
                  <Badge variant="outline">
                    Step {currentStep + 1} of {form.steps.length}
                  </Badge>
                </div>
                {currentStepData.description && (
                  <p className="text-sm text-muted-foreground">
                    {currentStepData.description}
                  </p>
                )}

                {/* Step Progress */}
                <div className="flex items-center gap-2">
                  {form.steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded ${
                        index <= currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Preview Notice */}
            <Alert>
              <Eye className="h-4 w-4" />
              <AlertDescription>
                This is a preview of your form. Form fields are populated with
                sample data. The live form will be empty for users to fill out.
              </AlertDescription>
            </Alert>

            {/* Form Fields */}
            <div className="space-y-4">
              {currentStepFields.map(renderField)}
            </div>

            {/* Navigation */}
            <div className="pt-6 border-t">
              {form.isMultiStep ? (
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={isLastStep ? () => {} : handleNextStep}
                    disabled={isLastStep}
                  >
                    {isLastStep ? "Submit (Preview)" : "Next"}
                  </Button>
                </div>
              ) : (
                <Button className="w-full" disabled>
                  Submit Form (Preview)
                </Button>
              )}
            </div>

            {/* Form Stats */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Form Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Fields</p>
                  <p className="font-medium">{form.fields.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Required Fields</p>
                  <p className="font-medium">
                    {form.fields.filter((f) => f.validation.required).length}
                  </p>
                </div>
                {form.isMultiStep && (
                  <div>
                    <p className="text-muted-foreground">Steps</p>
                    <p className="font-medium">{form.steps.length}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
