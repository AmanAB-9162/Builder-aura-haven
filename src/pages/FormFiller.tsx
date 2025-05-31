import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TextField } from "@/components/form-fields/TextField";
import { TextareaField } from "@/components/form-fields/TextareaField";
import { DropdownField } from "@/components/form-fields/DropdownField";
import { CheckboxField } from "@/components/form-fields/CheckboxField";
import { RadioField } from "@/components/form-fields/RadioField";
import { DateField } from "@/components/form-fields/DateField";
import { Form, FormField, FormResponse, FormStep } from "@/types/form";
import { loadForm, saveFormResponse, generateId } from "@/utils/formStorage";
import {
  validateStep,
  validateForm,
  sanitizeFormData,
} from "@/utils/formValidation";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";

export const FormFiller: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      loadFormData();
    }
  }, [formId]);

  const loadFormData = () => {
    if (!formId) return;

    const formData = loadForm(formId);
    if (formData) {
      setForm(formData);
    } else {
      toast({
        title: "Form not found",
        description: "The requested form could not be found.",
        variant: "destructive",
      });
      navigate("/");
    }
    setLoading(false);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));

    // Clear error when user starts entering data
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
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

  const validateCurrentStep = (): boolean => {
    if (!form) return false;

    const stepFields = getCurrentStepFields();
    const stepFieldIds = stepFields.map((f) => f.id);
    const result = validateStep(form.fields, stepFieldIds, formData);

    if (!result.isValid) {
      const fieldErrors: Record<string, string> = {};
      result.errors.forEach((error) => {
        fieldErrors[error.field] = error.message;
      });
      setErrors(fieldErrors);

      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });

      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;

    if (form && currentStep < form.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!form) return;

    if (form.isMultiStep && !validateCurrentStep()) return;

    // Validate entire form
    const result = validateForm(form.fields, formData);
    if (!result.isValid) {
      const fieldErrors: Record<string, string> = {};
      result.errors.forEach((error) => {
        fieldErrors[error.field] = error.message;
      });
      setErrors(fieldErrors);

      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedData = sanitizeFormData(formData);

      const response: FormResponse = {
        id: generateId(),
        formId: form.id,
        responses: sanitizedData,
        submittedAt: new Date().toISOString(),
        metadata: {
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined,
        },
      };

      saveFormResponse(response);
      setIsSubmitted(true);

      toast({
        title: "Form Submitted",
        description: "Thank you for your submission!",
      });

      // Redirect if specified
      if (form.settings.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings.redirectUrl!;
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldProps = {
      field,
      value: formData[field.id],
      onChange: (value: any) => handleFieldChange(field.id, value),
      error: errors[field.id],
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

  const getProgress = (): number => {
    if (!form) return 0;

    if (form.isMultiStep) {
      return ((currentStep + 1) / form.steps.length) * 100;
    }

    const completedFields = form.fields.filter(
      (field) => formData[field.id] !== undefined && formData[field.id] !== "",
    ).length;

    return (completedFields / form.fields.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading form...</p>
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
            <p className="text-muted-foreground">
              The form you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-4">
              {form.settings.thankYouMessage}
            </p>
            {form.settings.redirectUrl && (
              <p className="text-sm text-muted-foreground">
                Redirecting you shortly...
              </p>
            )}
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            {form.description && (
              <p className="text-muted-foreground">{form.description}</p>
            )}

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="w-full" />
            </div>

            {/* Step Info */}
            {form.isMultiStep && currentStepData && (
              <div className="border-t pt-4">
                <h3 className="font-medium">{currentStepData.title}</h3>
                {currentStepData.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentStepData.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Step {currentStep + 1} of {form.steps.length}
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              {currentStepFields.map(renderField)}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              {form.isMultiStep ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={isLastStep ? handleSubmit : handleNextStep}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : isLastStep
                        ? "Submit"
                        : "Next"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
