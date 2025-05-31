import { FormField, FieldValidation } from "@/types/form";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports various formats)
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// Validate a single field value
export const validateField = (
  field: FormField,
  value: any,
): ValidationError | null => {
  const { validation, label, type } = field;

  // Check required validation
  if (
    validation.required &&
    (!value || (typeof value === "string" && value.trim() === ""))
  ) {
    return {
      field: field.id,
      message: `${label} is required`,
    };
  }

  // If field is empty and not required, no further validation needed
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return null;
  }

  const stringValue = String(value).trim();

  // Check minimum length
  if (validation.minLength && stringValue.length < validation.minLength) {
    return {
      field: field.id,
      message: `${label} must be at least ${validation.minLength} characters long`,
    };
  }

  // Check maximum length
  if (validation.maxLength && stringValue.length > validation.maxLength) {
    return {
      field: field.id,
      message: `${label} must be no more than ${validation.maxLength} characters long`,
    };
  }

  // Type-specific validation
  switch (type) {
    case "email":
      if (!EMAIL_REGEX.test(stringValue)) {
        return {
          field: field.id,
          message: `Please enter a valid email address`,
        };
      }
      break;

    case "phone":
      if (!PHONE_REGEX.test(stringValue.replace(/[\s\-\(\)]/g, ""))) {
        return {
          field: field.id,
          message: `Please enter a valid phone number`,
        };
      }
      break;

    case "number":
      if (isNaN(Number(stringValue))) {
        return {
          field: field.id,
          message: `${label} must be a valid number`,
        };
      }
      break;

    case "date":
      const date = new Date(stringValue);
      if (isNaN(date.getTime())) {
        return {
          field: field.id,
          message: `Please enter a valid date`,
        };
      }
      break;
  }

  // Custom pattern validation
  if (validation.pattern) {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(stringValue)) {
      return {
        field: field.id,
        message: validation.patternMessage || `${label} format is invalid`,
      };
    }
  }

  return null;
};

// Validate all fields in a form
export const validateForm = (
  fields: FormField[],
  formData: Record<string, any>,
): ValidationResult => {
  const errors: ValidationError[] = [];

  for (const field of fields) {
    const value = formData[field.id];
    const error = validateField(field, value);

    if (error) {
      errors.push(error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate fields in a specific step
export const validateStep = (
  fields: FormField[],
  stepFieldIds: string[],
  formData: Record<string, any>,
): ValidationResult => {
  const stepFields = fields.filter((field) => stepFieldIds.includes(field.id));
  return validateForm(stepFields, formData);
};

// Get validation message for a specific field
export const getFieldValidationMessage = (
  fieldId: string,
  errors: ValidationError[],
): string | null => {
  const error = errors.find((e) => e.field === fieldId);
  return error ? error.message : null;
};

// Check if a field has validation errors
export const hasFieldError = (
  fieldId: string,
  errors: ValidationError[],
): boolean => {
  return errors.some((e) => e.field === fieldId);
};

// Validation rules for form builder
export const validateFormBuilder = (
  title: string,
  fields: FormField[],
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check form title
  if (!title || title.trim() === "") {
    errors.push({
      field: "title",
      message: "Form title is required",
    });
  }

  // Check if form has at least one field
  if (fields.length === 0) {
    errors.push({
      field: "fields",
      message: "Form must have at least one field",
    });
  }

  // Check field validation
  fields.forEach((field) => {
    if (!field.label || field.label.trim() === "") {
      errors.push({
        field: `field_${field.id}`,
        message: `Field label is required`,
      });
    }

    // Check dropdown/radio options
    if (
      (field.type === "dropdown" ||
        field.type === "radio" ||
        field.type === "checkbox") &&
      (!field.options || field.options.length === 0)
    ) {
      errors.push({
        field: `field_${field.id}`,
        message: `${field.type} field must have at least one option`,
      });
    }

    // Check for duplicate field IDs
    const duplicateFields = fields.filter((f) => f.id === field.id);
    if (duplicateFields.length > 1) {
      errors.push({
        field: `field_${field.id}`,
        message: `Duplicate field ID found`,
      });
    }
  });

  return errors;
};

// Sanitize form data before saving/submission
export const sanitizeFormData = (
  formData: Record<string, any>,
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === "string") {
      // Basic HTML sanitization - remove script tags and trim
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .trim();
    } else if (Array.isArray(value)) {
      // Handle arrays (for checkbox fields)
      sanitized[key] = value.filter((v) => v !== null && v !== undefined);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Generate field validation preview text
export const getValidationPreviewText = (
  validation: FieldValidation,
): string => {
  const rules: string[] = [];

  if (validation.required) {
    rules.push("Required");
  }

  if (validation.minLength) {
    rules.push(`Min: ${validation.minLength} chars`);
  }

  if (validation.maxLength) {
    rules.push(`Max: ${validation.maxLength} chars`);
  }

  if (validation.pattern) {
    rules.push("Custom pattern");
  }

  return rules.length > 0 ? rules.join(", ") : "No validation";
};
