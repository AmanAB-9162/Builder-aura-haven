import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  FormBuilderState,
  FormBuilderAction,
  Form,
  FormField,
  FormStep,
} from "@/types/form";
import {
  generateId,
  saveForm,
  loadSettings,
  saveSettings,
} from "@/utils/formStorage";

const initialState: FormBuilderState = {
  currentForm: null,
  selectedFieldId: null,
  previewMode: "desktop",
  isDragging: false,
  draggedItem: null,
  history: [],
  historyIndex: -1,
  autoSaveEnabled: true,
  isDarkMode: false,
};

const FormBuilderContext = createContext<{
  state: FormBuilderState;
  dispatch: React.Dispatch<FormBuilderAction>;
} | null>(null);

const formBuilderReducer = (
  state: FormBuilderState,
  action: FormBuilderAction,
): FormBuilderState => {
  switch (action.type) {
    case "SET_FORM": {
      const newState = {
        ...state,
        currentForm: action.payload,
        selectedFieldId: null,
      };

      // Add to history if it's a different form
      if (!state.currentForm || state.currentForm.id !== action.payload.id) {
        newState.history = [action.payload];
        newState.historyIndex = 0;
      }

      return newState;
    }

    case "ADD_FIELD": {
      if (!state.currentForm) return state;

      const { field, stepId } = action.payload;
      const updatedFields = [...state.currentForm.fields, field];

      let updatedSteps = state.currentForm.steps;
      if (stepId && state.currentForm.isMultiStep) {
        updatedSteps = state.currentForm.steps.map((step) =>
          step.id === stepId
            ? { ...step, fields: [...step.fields, field.id] }
            : step,
        );
      }

      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        steps: updatedSteps,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
        selectedFieldId: field.id,
      };
    }

    case "UPDATE_FIELD": {
      if (!state.currentForm) return state;

      const { fieldId, updates } = action.payload;
      const updatedFields = state.currentForm.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      );

      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
      };
    }

    case "DELETE_FIELD": {
      if (!state.currentForm) return state;

      const fieldId = action.payload;
      const updatedFields = state.currentForm.fields.filter(
        (field) => field.id !== fieldId,
      );

      // Remove field from steps
      const updatedSteps = state.currentForm.steps.map((step) => ({
        ...step,
        fields: step.fields.filter((id) => id !== fieldId),
      }));

      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        steps: updatedSteps,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
        selectedFieldId:
          state.selectedFieldId === fieldId ? null : state.selectedFieldId,
      };
    }

    case "REORDER_FIELDS": {
      if (!state.currentForm) return state;

      const { fieldId, newOrder, stepId } = action.payload;

      // Get fields for the specific step or all fields
      let fieldsToReorder = state.currentForm.fields;
      if (stepId && state.currentForm.isMultiStep) {
        const step = state.currentForm.steps.find((s) => s.id === stepId);
        if (step) {
          fieldsToReorder = state.currentForm.fields.filter((f) =>
            step.fields.includes(f.id),
          );
        }
      }

      // Update field orders
      const updatedFields = state.currentForm.fields.map((field) => {
        if (field.id === fieldId) {
          return { ...field, order: newOrder };
        }

        // If this field is in the same context and needs order adjustment
        const isInSameContext = stepId
          ? state
              .currentForm!.steps.find((s) => s.id === stepId)
              ?.fields.includes(field.id)
          : true;

        if (
          isInSameContext &&
          field.order >= newOrder &&
          field.id !== fieldId
        ) {
          return { ...field, order: field.order + 1 };
        }

        return field;
      });

      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
      };
    }

    case "SELECT_FIELD":
      return {
        ...state,
        selectedFieldId: action.payload,
      };

    case "SET_PREVIEW_MODE":
      return {
        ...state,
        previewMode: action.payload,
      };

    case "SET_DRAGGING":
      return {
        ...state,
        isDragging: action.payload.isDragging,
        draggedItem: action.payload.draggedItem || null,
      };

    case "ADD_STEP": {
      if (!state.currentForm) return state;

      const newStep = action.payload;
      const updatedSteps = [...state.currentForm.steps, newStep];

      const updatedForm = {
        ...state.currentForm,
        steps: updatedSteps,
        isMultiStep: true,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
      };
    }

    case "UPDATE_STEP": {
      if (!state.currentForm) return state;

      const { stepId, updates } = action.payload;
      const updatedSteps = state.currentForm.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step,
      );

      const updatedForm = {
        ...state.currentForm,
        steps: updatedSteps,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
      };
    }

    case "DELETE_STEP": {
      if (!state.currentForm) return state;

      const stepId = action.payload;
      const stepToDelete = state.currentForm.steps.find((s) => s.id === stepId);

      // Move fields from deleted step to first step or remove step assignment
      let updatedFields = state.currentForm.fields;
      if (stepToDelete && stepToDelete.fields.length > 0) {
        const remainingSteps = state.currentForm.steps.filter(
          (s) => s.id !== stepId,
        );
        const targetStepId =
          remainingSteps.length > 0 ? remainingSteps[0].id : null;

        updatedFields = state.currentForm.fields.map((field) => {
          if (stepToDelete.fields.includes(field.id)) {
            return { ...field, stepId: targetStepId || undefined };
          }
          return field;
        });
      }

      const updatedSteps = state.currentForm.steps.filter(
        (step) => step.id !== stepId,
      );

      const updatedForm = {
        ...state.currentForm,
        fields: updatedFields,
        steps: updatedSteps,
        isMultiStep: updatedSteps.length > 0,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
      };
    }

    case "UPDATE_FORM_SETTINGS": {
      if (!state.currentForm) return state;

      const updatedForm = {
        ...state.currentForm,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        currentForm: updatedForm,
      };
    }

    case "SAVE_TO_HISTORY": {
      if (!state.currentForm) return state;

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ ...state.currentForm });

      // Limit history to last 50 changes
      const limitedHistory = newHistory.slice(-50);

      return {
        ...state,
        history: limitedHistory,
        historyIndex: limitedHistory.length - 1,
      };
    }

    case "UNDO": {
      if (state.historyIndex <= 0) return state;

      const previousForm = state.history[state.historyIndex - 1];

      return {
        ...state,
        currentForm: previousForm,
        historyIndex: state.historyIndex - 1,
        selectedFieldId: null,
      };
    }

    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;

      const nextForm = state.history[state.historyIndex + 1];

      return {
        ...state,
        currentForm: nextForm,
        historyIndex: state.historyIndex + 1,
        selectedFieldId: null,
      };
    }

    case "TOGGLE_THEME":
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };

    case "TOGGLE_AUTO_SAVE":
      return {
        ...state,
        autoSaveEnabled: !state.autoSaveEnabled,
      };

    default:
      return state;
  }
};

export const FormBuilderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(formBuilderReducer, initialState);

  // Load settings on mount
  useEffect(() => {
    const settings = loadSettings();
    if (settings.theme === "dark") {
      dispatch({ type: "TOGGLE_THEME" });
    }
    if (!settings.autoSave) {
      dispatch({ type: "TOGGLE_AUTO_SAVE" });
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (state.autoSaveEnabled && state.currentForm) {
      const saveTimeout = setTimeout(() => {
        saveForm(state.currentForm!);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(saveTimeout);
    }
  }, [state.currentForm, state.autoSaveEnabled]);

  // Save settings when they change
  useEffect(() => {
    saveSettings({
      theme: state.isDarkMode ? "dark" : "light",
      autoSave: state.autoSaveEnabled,
    });
  }, [state.isDarkMode, state.autoSaveEnabled]);

  // Apply dark mode class to document
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.isDarkMode]);

  return (
    <FormBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
};

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
};

// Helper hooks for common operations
export const useFormActions = () => {
  const { dispatch } = useFormBuilder();

  const createNewForm = (title: string = "Untitled Form") => {
    const newForm: Form = {
      id: generateId(),
      title,
      description: "",
      fields: [],
      steps: [],
      isMultiStep: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: false,
      settings: {
        allowEditing: false,
        requireAuth: false,
        collectEmail: false,
        thankYouMessage: "Thank you for your submission!",
      },
    };

    dispatch({ type: "SET_FORM", payload: newForm });
    return newForm;
  };

  const addField = (fieldType: string, stepId?: string) => {
    const newField: FormField = {
      id: generateId(),
      type: fieldType as any,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: "",
      helpText: "",
      validation: { required: false },
      order: Date.now(), // Simple ordering based on creation time
      stepId,
    };

    // Add default options for dropdown, radio, and checkbox fields
    if (["dropdown", "radio", "checkbox"].includes(fieldType)) {
      newField.options = [
        { id: generateId(), label: "Option 1", value: "option1" },
        { id: generateId(), label: "Option 2", value: "option2" },
      ];
    }

    dispatch({ type: "ADD_FIELD", payload: { field: newField, stepId } });
    dispatch({ type: "SELECT_FIELD", payload: newField.id });
    dispatch({ type: "SAVE_TO_HISTORY" });
  };

  const addStep = (title: string = "New Step") => {
    const newStep: FormStep = {
      id: generateId(),
      title,
      description: "",
      order: Date.now(),
      fields: [],
    };

    dispatch({ type: "ADD_STEP", payload: newStep });
    dispatch({ type: "SAVE_TO_HISTORY" });
  };

  const saveFormChanges = (form: Form) => {
    saveForm(form);
    dispatch({ type: "SAVE_TO_HISTORY" });
  };

  return {
    createNewForm,
    addField,
    addStep,
    saveFormChanges,
  };
};
