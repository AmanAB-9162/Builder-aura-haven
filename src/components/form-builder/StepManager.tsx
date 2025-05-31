import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormBuilder } from "@/context/FormBuilderContext";
import { FormStep } from "@/types/form";
import { generateId } from "@/utils/formStorage";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepManagerProps {
  currentStepId?: string;
  onStepChange?: (stepId: string) => void;
}

export const StepManager: React.FC<StepManagerProps> = ({
  currentStepId,
  onStepChange,
}) => {
  const { state, dispatch } = useFormBuilder();
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [editingStep, setEditingStep] = useState<FormStep | null>(null);
  const [stepForm, setStepForm] = useState({ title: "", description: "" });

  const handleToggleMultiStep = (enabled: boolean) => {
    if (
      enabled &&
      (!state.currentForm?.steps || state.currentForm.steps.length === 0)
    ) {
      // Create first step automatically
      const firstStep: FormStep = {
        id: generateId(),
        title: "Step 1",
        description: "First step of the form",
        order: 0,
        fields: state.currentForm?.fields.map((f) => f.id) || [],
      };

      dispatch({ type: "ADD_STEP", payload: firstStep });

      // Update all fields to belong to this step
      state.currentForm?.fields.forEach((field) => {
        dispatch({
          type: "UPDATE_FIELD",
          payload: {
            fieldId: field.id,
            updates: { stepId: firstStep.id },
          },
        });
      });

      onStepChange?.(firstStep.id);
    } else if (!enabled) {
      // Remove all steps and clear stepId from fields
      state.currentForm?.steps.forEach((step) => {
        dispatch({ type: "DELETE_STEP", payload: step.id });
      });

      state.currentForm?.fields.forEach((field) => {
        dispatch({
          type: "UPDATE_FIELD",
          payload: {
            fieldId: field.id,
            updates: { stepId: undefined },
          },
        });
      });

      onStepChange?.("");
    }

    dispatch({
      type: "UPDATE_FORM_SETTINGS",
      payload: { isMultiStep: enabled },
    });
    dispatch({ type: "SAVE_TO_HISTORY" });
  };

  const handleAddStep = () => {
    const newStep: FormStep = {
      id: generateId(),
      title:
        stepForm.title || `Step ${(state.currentForm?.steps.length || 0) + 1}`,
      description: stepForm.description,
      order: Date.now(),
      fields: [],
    };

    dispatch({ type: "ADD_STEP", payload: newStep });
    dispatch({ type: "SAVE_TO_HISTORY" });
    setIsAddingStep(false);
    setStepForm({ title: "", description: "" });
    onStepChange?.(newStep.id);
  };

  const handleEditStep = (step: FormStep) => {
    setEditingStep(step);
    setStepForm({
      title: step.title,
      description: step.description || "",
    });
  };

  const handleUpdateStep = () => {
    if (!editingStep) return;

    dispatch({
      type: "UPDATE_STEP",
      payload: {
        stepId: editingStep.id,
        updates: {
          title: stepForm.title,
          description: stepForm.description,
        },
      },
    });
    dispatch({ type: "SAVE_TO_HISTORY" });
    setEditingStep(null);
    setStepForm({ title: "", description: "" });
  };

  const handleDeleteStep = (stepId: string) => {
    dispatch({ type: "DELETE_STEP", payload: stepId });
    dispatch({ type: "SAVE_TO_HISTORY" });

    // If this was the current step, switch to the first available step
    if (currentStepId === stepId) {
      const remainingSteps =
        state.currentForm?.steps.filter((s) => s.id !== stepId) || [];
      onStepChange?.(remainingSteps.length > 0 ? remainingSteps[0].id : "");
    }
  };

  if (!state.currentForm) {
    return null;
  }

  const steps = state.currentForm.steps.sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multi-step toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Multi-step Form</Label>
            <p className="text-sm text-muted-foreground">
              Create a form with multiple steps
            </p>
          </div>
          <Switch
            checked={state.currentForm.isMultiStep}
            onCheckedChange={handleToggleMultiStep}
          />
        </div>

        {state.currentForm.isMultiStep && (
          <>
            <Separator />

            {/* Steps list */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                    currentStepId === step.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : "border-border hover:bg-muted",
                  )}
                  onClick={() => onStepChange?.(step.id)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{step.title}</span>
                      <span className="text-xs text-muted-foreground">
                        ({step.fields.length} fields)
                      </span>
                    </div>
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {step.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStep(step);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(step.id);
                      }}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Add step button */}
              <Dialog open={isAddingStep} onOpenChange={setIsAddingStep}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-dashed"
                    onClick={() => setIsAddingStep(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Step</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="step-title">Step Title</Label>
                      <Input
                        id="step-title"
                        value={stepForm.title}
                        onChange={(e) =>
                          setStepForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter step title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="step-description">
                        Description (optional)
                      </Label>
                      <Textarea
                        id="step-description"
                        value={stepForm.description}
                        onChange={(e) =>
                          setStepForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter step description"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingStep(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddStep}>Add Step</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}

        {/* Edit step dialog */}
        <Dialog open={!!editingStep} onOpenChange={() => setEditingStep(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Step</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-step-title">Step Title</Label>
                <Input
                  id="edit-step-title"
                  value={stepForm.title}
                  onChange={(e) =>
                    setStepForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter step title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-step-description">
                  Description (optional)
                </Label>
                <Textarea
                  id="edit-step-description"
                  value={stepForm.description}
                  onChange={(e) =>
                    setStepForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter step description"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingStep(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStep}>Update Step</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
