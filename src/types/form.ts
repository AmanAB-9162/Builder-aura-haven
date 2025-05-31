export type FieldType =
  | "text"
  | "textarea"
  | "dropdown"
  | "checkbox"
  | "date"
  | "radio"
  | "email"
  | "phone"
  | "number";

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  validation: FieldValidation;
  options?: FieldOption[]; // For dropdown, radio, checkbox
  order: number;
  stepId?: string; // For multi-step forms
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  fields: string[]; // Field IDs in this step
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  steps: FormStep[];
  isMultiStep: boolean;
  createdAt: string;
  updatedAt: string;
  isTemplate: boolean;
  templateName?: string;
  settings: FormSettings;
}

export interface FormSettings {
  allowEditing: boolean;
  requireAuth: boolean;
  collectEmail: boolean;
  thankYouMessage: string;
  redirectUrl?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  form: Omit<Form, "id" | "createdAt" | "updatedAt">;
  category: string;
  thumbnail?: string;
}

export type PreviewMode = "desktop" | "tablet" | "mobile";

export type DraggedItem = {
  type: "field" | "existing-field";
  fieldType?: FieldType;
  fieldId?: string;
};

// Form Builder State
export interface FormBuilderState {
  currentForm: Form | null;
  selectedFieldId: string | null;
  previewMode: PreviewMode;
  isDragging: boolean;
  draggedItem: DraggedItem | null;
  history: Form[];
  historyIndex: number;
  autoSaveEnabled: boolean;
  isDarkMode: boolean;
}

export type FormBuilderAction =
  | { type: "SET_FORM"; payload: Form }
  | { type: "ADD_FIELD"; payload: { field: FormField; stepId?: string } }
  | {
      type: "UPDATE_FIELD";
      payload: { fieldId: string; updates: Partial<FormField> };
    }
  | { type: "DELETE_FIELD"; payload: string }
  | {
      type: "REORDER_FIELDS";
      payload: { fieldId: string; newOrder: number; stepId?: string };
    }
  | { type: "SELECT_FIELD"; payload: string | null }
  | { type: "SET_PREVIEW_MODE"; payload: PreviewMode }
  | {
      type: "SET_DRAGGING";
      payload: { isDragging: boolean; draggedItem?: DraggedItem | null };
    }
  | { type: "ADD_STEP"; payload: FormStep }
  | {
      type: "UPDATE_STEP";
      payload: { stepId: string; updates: Partial<FormStep> };
    }
  | { type: "DELETE_STEP"; payload: string }
  | { type: "UPDATE_FORM_SETTINGS"; payload: Partial<Form> }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SAVE_TO_HISTORY" }
  | { type: "TOGGLE_THEME" }
  | { type: "TOGGLE_AUTO_SAVE" };
