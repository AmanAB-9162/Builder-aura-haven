import React from "react";
import { FormField } from "@/types/form";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";

interface DateFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export const DateField: React.FC<DateFieldProps> = ({
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
      <Input
        id={field.id}
        name={field.id}
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.validation.required}
        disabled={isBuilder}
        className={error ? "border-red-500 focus:border-red-500" : ""}
        aria-describedby={
          error
            ? `${field.id}-error`
            : field.helpText
              ? `${field.id}-help`
              : undefined
        }
      />
    </FieldWrapper>
  );
};
