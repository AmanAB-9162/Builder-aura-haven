import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFormBuilder } from "@/context/FormBuilderContext";
import { FormField, FieldOption } from "@/types/form";
import { generateId } from "@/utils/formStorage";
import { Trash2, Plus } from "lucide-react";

export const FieldEditor: React.FC = () => {
  const { state, dispatch } = useFormBuilder();
  const selectedField = state.currentForm?.fields.find(
    (f) => f.id === state.selectedFieldId,
  );

  if (!selectedField) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg">Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a field to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const updateField = (updates: Partial<FormField>) => {
    dispatch({
      type: "UPDATE_FIELD",
      payload: { fieldId: selectedField.id, updates },
    });
    dispatch({ type: "SAVE_TO_HISTORY" });
  };

  const updateValidation = (key: keyof FormField["validation"], value: any) => {
    updateField({
      validation: {
        ...selectedField.validation,
        [key]: value,
      },
    });
  };

  const addOption = () => {
    const newOption: FieldOption = {
      id: generateId(),
      label: `Option ${(selectedField.options?.length || 0) + 1}`,
      value: `option${(selectedField.options?.length || 0) + 1}`,
    };

    updateField({
      options: [...(selectedField.options || []), newOption],
    });
  };

  const updateOption = (optionId: string, updates: Partial<FieldOption>) => {
    const updatedOptions =
      selectedField.options?.map((option) =>
        option.id === optionId ? { ...option, ...updates } : option,
      ) || [];

    updateField({ options: updatedOptions });
  };

  const deleteOption = (optionId: string) => {
    const updatedOptions =
      selectedField.options?.filter((option) => option.id !== optionId) || [];

    updateField({ options: updatedOptions });
  };

  const hasOptions = ["dropdown", "radio", "checkbox"].includes(
    selectedField.type,
  );

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Field Properties</CardTitle>
        <p className="text-sm text-muted-foreground">
          Editing: {selectedField.type} field
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-label">Label</Label>
            <Input
              id="field-label"
              value={selectedField.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={selectedField.placeholder || ""}
              onChange={(e) => updateField({ placeholder: e.target.value })}
              placeholder="Placeholder text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-help">Help Text</Label>
            <Textarea
              id="field-help"
              value={selectedField.helpText || ""}
              onChange={(e) => updateField({ helpText: e.target.value })}
              placeholder="Additional help text for users"
              rows={2}
            />
          </div>
        </div>

        <Separator />

        {/* Validation Rules */}
        <div className="space-y-4">
          <h4 className="font-medium">Validation Rules</h4>

          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required Field</Label>
            <Switch
              id="required"
              checked={selectedField.validation.required || false}
              onCheckedChange={(checked) =>
                updateValidation("required", checked)
              }
            />
          </div>

          {selectedField.type === "text" ||
          selectedField.type === "textarea" ||
          selectedField.type === "email" ||
          selectedField.type === "phone" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="min-length">Minimum Length</Label>
                <Input
                  id="min-length"
                  type="number"
                  min="0"
                  value={selectedField.validation.minLength || ""}
                  onChange={(e) =>
                    updateValidation(
                      "minLength",
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  placeholder="Minimum character length"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-length">Maximum Length</Label>
                <Input
                  id="max-length"
                  type="number"
                  min="0"
                  value={selectedField.validation.maxLength || ""}
                  onChange={(e) =>
                    updateValidation(
                      "maxLength",
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  placeholder="Maximum character length"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pattern">Custom Pattern (Regex)</Label>
                <Input
                  id="pattern"
                  value={selectedField.validation.pattern || ""}
                  onChange={(e) => updateValidation("pattern", e.target.value)}
                  placeholder="Regular expression pattern"
                />
              </div>

              {selectedField.validation.pattern && (
                <div className="space-y-2">
                  <Label htmlFor="pattern-message">Pattern Error Message</Label>
                  <Input
                    id="pattern-message"
                    value={selectedField.validation.patternMessage || ""}
                    onChange={(e) =>
                      updateValidation("patternMessage", e.target.value)
                    }
                    placeholder="Error message for pattern validation"
                  />
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Options for dropdown, radio, checkbox */}
        {hasOptions && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Options</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addOption}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {selectedField.options?.map((option, index) => (
                  <div key={option.id} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={option.label}
                        onChange={(e) =>
                          updateOption(option.id, { label: e.target.value })
                        }
                        placeholder={`Option ${index + 1} label`}
                        className="h-8"
                      />
                      <Input
                        value={option.value}
                        onChange={(e) =>
                          updateOption(option.id, { value: e.target.value })
                        }
                        placeholder={`Option ${index + 1} value`}
                        className="h-8"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteOption(option.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {(!selectedField.options ||
                  selectedField.options.length === 0) && (
                  <p className="text-sm text-muted-foreground italic">
                    No options added yet. Click "Add Option" to create options.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
