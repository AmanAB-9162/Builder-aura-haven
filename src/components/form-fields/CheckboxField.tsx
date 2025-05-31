import React from "react";
import { FormField } from "@/types/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldWrapper } from "./FieldWrapper";

interface CheckboxFieldProps {
  field: FormField;
  value?: string[];
  onChange?: (value: string[]) => void;
  error?: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value = [],
  onChange,
  error,
  isBuilder = false,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <FieldWrapper
      field={field}
      error={error}
      isBuilder={isBuilder}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
    >
      <div className="space-y-3">
        {field.options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.id}-${option.id}`}
              name={field.id}
              value={option.value}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option.value, checked as boolean)
              }
              required={field.validation.required && value.length === 0}
              disabled={isBuilder}
              aria-describedby={
                error
                  ? `${field.id}-error`
                  : field.helpText
                    ? `${field.id}-help`
                    : undefined
              }
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
      </div>
    </FieldWrapper>
  );
};
