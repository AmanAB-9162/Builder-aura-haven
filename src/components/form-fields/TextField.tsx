import React from "react";
import { FormField } from "@/types/form";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";

interface TextFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  field,
  value = "",
  onChange,
  error,
  isBuilder = false,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "phone"
        ? "tel"
        : field.type === "number"
          ? "number"
          : "text";

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
        type={inputType}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.validation.required}
        minLength={field.validation.minLength}
        maxLength={field.validation.maxLength}
        pattern={field.validation.pattern}
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
