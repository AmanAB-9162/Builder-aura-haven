import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useFormBuilder, useFormActions } from "@/context/FormBuilderContext";
import { FieldPalette } from "@/components/form-builder/FieldPalette";
import { FormCanvas } from "@/components/form-builder/FormCanvas";
import { FieldEditor } from "@/components/form-builder/FieldEditor";
import { StepManager } from "@/components/form-builder/StepManager";
import { PreviewModes } from "@/components/form-builder/PreviewModes";
import { TemplateSelector } from "@/components/form-builder/TemplateSelector";
import { ShareModal } from "@/components/form-builder/ShareModal";
import { ResponseViewer } from "@/components/form-builder/ResponseViewer";
import { saveForm, loadForms } from "@/utils/formStorage";
import { validateFormBuilder } from "@/utils/formValidation";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Eye,
  Share2,
  FileText,
  Undo2,
  Redo2,
  Moon,
  Sun,
  BarChart3,
  Settings,
} from "lucide-react";

export const FormBuilder: React.FC = () => {
  const { state, dispatch } = useFormBuilder();
  const { createNewForm, saveFormChanges } = useFormActions();
  const { toast } = useToast();

  const [currentStepId, setCurrentStepId] = useState<string>("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showResponseViewer, setShowResponseViewer] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  useEffect(() => {
    // Auto-create a new form if none exists
    if (!state.currentForm) {
      createNewForm();
    }
  }, []);

  useEffect(() => {
    // Update last saved indicator
    if (state.currentForm?.updatedAt) {
      setLastSaved(new Date(state.currentForm.updatedAt).toLocaleTimeString());
    }
  }, [state.currentForm?.updatedAt]);

  const handleSaveForm = () => {
    if (!state.currentForm) return;

    const errors = validateFormBuilder(
      state.currentForm.title,
      state.currentForm.fields,
    );
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0].message,
        variant: "destructive",
      });
      return;
    }

    saveFormChanges(state.currentForm);
    toast({
      title: "Form Saved",
      description: "Your form has been saved successfully",
    });
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleFormSettingsUpdate = (field: string, value: any) => {
    if (!state.currentForm) return;

    dispatch({
      type: "UPDATE_FORM_SETTINGS",
      payload: { [field]: value },
    });
    dispatch({ type: "SAVE_TO_HISTORY" });
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };

  const handleToggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const handleToggleAutoSave = () => {
    dispatch({ type: "TOGGLE_AUTO_SAVE" });
  };

  if (!state.currentForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
          <Button onClick={() => setShowTemplateSelector(true)}>
            Create New Form
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Form Builder</h1>
              {state.autoSaveEnabled && lastSaved && (
                <Badge variant="secondary" className="text-xs">
                  Auto-saved at {lastSaved}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={handleToggleTheme}>
                {state.isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* Undo/Redo */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
              >
                <Redo2 className="w-4 h-4" />
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Actions */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateSelector(true)}
              >
                <FileText className="w-4 h-4 mr-1" />
                Templates
              </Button>

              <Button variant="outline" size="sm" onClick={handlePreviewToggle}>
                <Eye className="w-4 h-4 mr-1" />
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResponseViewer(true)}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Responses
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>

              <Button onClick={handleSaveForm}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {isPreviewMode ? (
          /* Preview Mode */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Form Preview</h2>
              <p className="text-muted-foreground">
                This is how your form will appear to users
              </p>
            </div>

            <PreviewModes>
              <FormPreviewContent form={state.currentForm} />
            </PreviewModes>
          </div>
        ) : (
          /* Builder Mode */
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
            {/* Left Sidebar - Field Palette & Form Settings */}
            <div className="col-span-3 space-y-6 overflow-y-auto">
              {/* Form Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Form Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="form-title">Form Title</Label>
                    <Input
                      id="form-title"
                      value={state.currentForm.title}
                      onChange={(e) =>
                        handleFormSettingsUpdate("title", e.target.value)
                      }
                      placeholder="Enter form title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form-description">Description</Label>
                    <Textarea
                      id="form-description"
                      value={state.currentForm.description || ""}
                      onChange={(e) =>
                        handleFormSettingsUpdate("description", e.target.value)
                      }
                      placeholder="Enter form description (optional)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Step Manager */}
              <StepManager
                currentStepId={currentStepId}
                onStepChange={setCurrentStepId}
              />

              {/* Field Palette */}
              <FieldPalette currentStepId={currentStepId} />
            </div>

            {/* Center - Form Canvas */}
            <div className="col-span-6">
              <FormCanvas currentStepId={currentStepId} />
            </div>

            {/* Right Sidebar - Field Editor */}
            <div className="col-span-3 overflow-y-auto">
              <FieldEditor />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
      />

      <ShareModal
        form={state.currentForm}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      <ResponseViewer
        form={state.currentForm}
        isOpen={showResponseViewer}
        onClose={() => setShowResponseViewer(false)}
      />
    </div>
  );
};

// Form Preview Component
interface FormPreviewContentProps {
  form: any;
}

const FormPreviewContent: React.FC<FormPreviewContentProps> = ({ form }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = form.isMultiStep
    ? form.steps.sort((a: any, b: any) => a.order - b.order)
    : [];
  const currentStepFields =
    form.isMultiStep && steps[currentStep]
      ? form.fields.filter((field: any) =>
          steps[currentStep].fields.includes(field.id),
        )
      : form.fields;

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderFormField = (field: any) => {
    const fieldProps = {
      field,
      value: formData[field.id],
      onChange: (value: any) => handleFieldChange(field.id, value),
      error: errors[field.id],
    };

    // Import and render the appropriate field component
    // This is a simplified version - in reality you'd import the actual components
    return (
      <div key={field.id} className="space-y-2">
        <label className="font-medium">{field.label}</label>
        <input
          type={field.type === "email" ? "email" : "text"}
          placeholder={field.placeholder}
          value={fieldProps.value || ""}
          onChange={(e) => fieldProps.onChange(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {field.helpText && (
          <p className="text-sm text-muted-foreground">{field.helpText}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        {form.description && (
          <p className="text-muted-foreground">{form.description}</p>
        )}

        {form.isMultiStep && (
          <div className="flex items-center gap-2 mt-4">
            {steps.map((_: any, index: number) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded ${
                  index <= currentStep ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {form.isMultiStep && steps[currentStep] && (
          <div>
            <h3 className="font-medium">{steps[currentStep].title}</h3>
            {steps[currentStep].description && (
              <p className="text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          {currentStepFields.map(renderFormField)}
        </div>

        {form.isMultiStep && (
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>

            <Button
              onClick={
                currentStep === steps.length - 1 ? undefined : handleNextStep
              }
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        )}

        {!form.isMultiStep && <Button className="w-full">Submit Form</Button>}
      </CardContent>
    </Card>
  );
};
