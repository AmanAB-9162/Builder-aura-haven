import React from "react";
import { FormField } from "@/types/form";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "./FieldWrapper";

interface TextareaFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
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
      <Textarea
        id={field.id}
        name={field.id}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.validation.required}
        minLength={field.validation.minLength}
        maxLength={field.validation.maxLength}
        disabled={isBuilder}
        className={error ? "border-red-500 focus:border-red-500" : ""}
        rows={4}
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
