import React from "react";
import { FormField } from "@/types/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FieldWrapper } from "./FieldWrapper";

interface RadioFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  field,
  value = "",
  onChange,
  error,
  isBuilder = false,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  return (
    <FieldWrapper
      field={field}
      error={error}
      isBuilder={isBuilder}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        required={field.validation.required}
        disabled={isBuilder}
        className="space-y-3"
        aria-describedby={
          error
            ? `${field.id}-error`
            : field.helpText
              ? `${field.id}-help`
              : undefined
        }
      >
        {field.options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${field.id}-${option.id}`}
              disabled={isBuilder}
            />
            <Label
              htmlFor={`${field.id}-${option.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}

        {(!field.options || field.options.length === 0) && isBuilder && (
          <div className="text-sm text-muted-foreground italic">
            No options defined. Add options in the field editor.
          </div>
        )}
      </RadioGroup>
    </FieldWrapper>
  );
};
