import React from "react";
import { FormField } from "@/types/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  field: FormField;
  children: React.ReactNode;
  error?: string;
  className?: string;
  isBuilder?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  field,
  children,
  error,
  className,
  isBuilder = false,
  isSelected = false,
  onSelect,
  onDelete,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isBuilder && onSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSelect();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isBuilder && e.key === "Delete" && isSelected && onDelete) {
      e.preventDefault();
      onDelete();
    }
  };

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isBuilder &&
          "cursor-pointer border-2 border-transparent rounded-lg p-2",
        isBuilder &&
          isSelected &&
          "border-blue-500 bg-blue-50 dark:bg-blue-950",
        isBuilder &&
          !isSelected &&
          "hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isBuilder ? 0 : undefined}
      aria-label={isBuilder ? `Field: ${field.label}` : undefined}
    >
      {isBuilder && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              aria-label="Delete field"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="space-y-1">
          <Label
            htmlFor={field.id}
            className={cn(
              "text-sm font-medium",
              field.validation.required &&
                "after:content-['*'] after:text-red-500 after:ml-1",
            )}
          >
            {field.label}
          </Label>

          {field.helpText && (
            <p className="text-sm text-muted-foreground">{field.helpText}</p>
          )}
        </div>

        <div className="relative">
          {children}

          {error && (
            <p className="text-sm text-red-500 mt-1" role="alert">
              {error}
            </p>
          )}
        </div>

        {isBuilder && (
          <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            Type: {field.type}
            {field.validation.required && " • Required"}
            {field.validation.minLength &&
              ` • Min: ${field.validation.minLength}`}
            {field.validation.maxLength &&
              ` • Max: ${field.validation.maxLength}`}
          </div>
        )}
      </div>
    </div>
  );
};
