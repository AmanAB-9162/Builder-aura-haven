import React from "react";
import { FormField } from "@/types/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldWrapper } from "./FieldWrapper";

interface DropdownFieldProps {
  field: FormField;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
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
      <Select
        value={value}
        onValueChange={onChange}
        required={field.validation.required}
        disabled={isBuilder}
      >
        <SelectTrigger
          id={field.id}
          className={error ? "border-red-500 focus:border-red-500" : ""}
          aria-describedby={
            error
              ? `${field.id}-error`
              : field.helpText
                ? `${field.id}-help`
                : undefined
          }
        >
          <SelectValue
            placeholder={
              field.placeholder || `Select ${field.label.toLowerCase()}`
            }
          />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={option.id} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {(!field.options || field.options.length === 0) && isBuilder && (
            <SelectItem value="placeholder" disabled>
              No options defined
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
};
