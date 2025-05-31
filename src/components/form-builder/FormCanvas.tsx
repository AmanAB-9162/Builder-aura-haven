import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormBuilder } from "@/context/FormBuilderContext";
import { FormField, DraggedItem } from "@/types/form";
import { generateId } from "@/utils/formStorage";
import { TextField } from "@/components/form-fields/TextField";
import { TextareaField } from "@/components/form-fields/TextareaField";
import { DropdownField } from "@/components/form-fields/DropdownField";
import { CheckboxField } from "@/components/form-fields/CheckboxField";
import { RadioField } from "@/components/form-fields/RadioField";
import { DateField } from "@/components/form-fields/DateField";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface FormCanvasProps {
  currentStepId?: string;
}

export const FormCanvas: React.FC<FormCanvasProps> = ({ currentStepId }) => {
  const { state, dispatch } = useFormBuilder();
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Get fields for current step or all fields
  const displayFields =
    state.currentForm?.fields
      .filter((field) => {
        if (currentStepId && state.currentForm?.isMultiStep) {
          return field.stepId === currentStepId;
        }
        return !state.currentForm?.isMultiStep || !field.stepId;
      })
      .sort((a, b) => a.order - b.order) || [];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    try {
      const dragData = JSON.parse(
        e.dataTransfer.getData("application/json"),
      ) as DraggedItem;

      if (dragData.type === "field" && dragData.fieldType) {
        const newField: FormField = {
          id: generateId(),
          type: dragData.fieldType,
          label: `${dragData.fieldType.charAt(0).toUpperCase() + dragData.fieldType.slice(1)} Field`,
          placeholder: "",
          helpText: "",
          validation: { required: false },
          order: Date.now(),
          stepId: currentStepId,
        };

        // Add default options for dropdown, radio, and checkbox fields
        if (["dropdown", "radio", "checkbox"].includes(dragData.fieldType)) {
          newField.options = [
            { id: generateId(), label: "Option 1", value: "option1" },
            { id: generateId(), label: "Option 2", value: "option2" },
          ];
        }

        dispatch({
          type: "ADD_FIELD",
          payload: { field: newField, stepId: currentStepId },
        });
        dispatch({ type: "SELECT_FIELD", payload: newField.id });
        dispatch({ type: "SAVE_TO_HISTORY" });
      }
    } catch (error) {
      console.error("Failed to parse drag data:", error);
    }
  };

  const handleFieldSelect = (fieldId: string) => {
    dispatch({ type: "SELECT_FIELD", payload: fieldId });
  };

  const handleFieldDelete = (fieldId: string) => {
    dispatch({ type: "DELETE_FIELD", payload: fieldId });
    dispatch({ type: "SAVE_TO_HISTORY" });
  };

  const handleFieldDragStart = (e: React.DragEvent, field: FormField) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "existing-field",
        fieldId: field.id,
      }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFieldDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleFieldDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleFieldDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    try {
      const dragData = JSON.parse(
        e.dataTransfer.getData("application/json"),
      ) as DraggedItem;

      if (dragData.type === "existing-field" && dragData.fieldId) {
        const sourceField = displayFields.find(
          (f) => f.id === dragData.fieldId,
        );
        const targetField = displayFields[dropIndex];

        if (sourceField && targetField && sourceField.id !== targetField.id) {
          dispatch({
            type: "REORDER_FIELDS",
            payload: {
              fieldId: sourceField.id,
              newOrder: targetField.order,
              stepId: currentStepId,
            },
          });
          dispatch({ type: "SAVE_TO_HISTORY" });
        }
      }
    } catch (error) {
      console.error("Failed to handle field drop:", error);
    }
  };

  const renderField = (field: FormField, index: number) => {
    const isSelected = state.selectedFieldId === field.id;
    const isDragOver = dragOverIndex === index;

    const fieldProps = {
      field,
      isBuilder: true,
      isSelected,
      onSelect: () => handleFieldSelect(field.id),
      onDelete: () => handleFieldDelete(field.id),
    };

    const FieldComponent = () => {
      switch (field.type) {
        case "text":
        case "email":
        case "phone":
        case "number":
          return <TextField {...fieldProps} />;
        case "textarea":
          return <TextareaField {...fieldProps} />;
        case "dropdown":
          return <DropdownField {...fieldProps} />;
        case "checkbox":
          return <CheckboxField {...fieldProps} />;
        case "radio":
          return <RadioField {...fieldProps} />;
        case "date":
          return <DateField {...fieldProps} />;
        default:
          return (
            <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
              <p className="text-red-600">Unknown field type: {field.type}</p>
            </div>
          );
      }
    };

    return (
      <div
        key={field.id}
        className={cn(
          "relative group transition-all duration-200",
          isDragOver && "border-t-4 border-blue-500",
        )}
        onDragOver={(e) => handleFieldDragOver(e, index)}
        onDragLeave={handleFieldDragLeave}
        onDrop={(e) => handleFieldDrop(e, index)}
      >
        <div className="flex items-start gap-2">
          <button
            className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={(e) => handleFieldDragStart(e, field)}
            aria-label="Drag to reorder field"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <FieldComponent />
          </div>
        </div>
      </div>
    );
  };

  if (!state.currentForm) {
    return (
      <Card className="flex-1 h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">
            Create a new form or load an existing one to start building
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {state.currentForm.title || "Untitled Form"}
        </CardTitle>
        {state.currentForm.description && (
          <p className="text-sm text-muted-foreground">
            {state.currentForm.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="h-full">
        <div
          className={cn(
            "min-h-[400px] border-2 border-dashed rounded-lg p-6 transition-colors",
            "border-gray-300 hover:border-gray-400",
            displayFields.length === 0 && "flex items-center justify-center",
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {displayFields.length === 0 ? (
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Drop fields here to start building your form
              </p>
              <p className="text-sm text-muted-foreground">
                Drag field types from the palette on the left or click to add
                them
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayFields.map((field, index) => renderField(field, index))}
            </div>
          )}
        </div>

        {displayFields.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
            <p>💡 Click fields to edit properties, drag handles to reorder</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
