import { Form, FormResponse, FormTemplate } from "@/types/form";

const STORAGE_KEYS = {
  FORMS: "formBuilder_forms",
  RESPONSES: "formBuilder_responses",
  TEMPLATES: "formBuilder_templates",
  SETTINGS: "formBuilder_settings",
} as const;

// Form Management
export const saveForms = (forms: Form[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
  } catch (error) {
    console.error("Failed to save forms:", error);
  }
};

export const loadForms = (): Form[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FORMS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load forms:", error);
    return [];
  }
};

export const saveForm = (form: Form): void => {
  const forms = loadForms();
  const existingIndex = forms.findIndex((f) => f.id === form.id);

  if (existingIndex >= 0) {
    forms[existingIndex] = { ...form, updatedAt: new Date().toISOString() };
  } else {
    forms.push(form);
  }

  saveForms(forms);
};

export const loadForm = (formId: string): Form | null => {
  const forms = loadForms();
  return forms.find((f) => f.id === formId) || null;
};

export const deleteForm = (formId: string): void => {
  const forms = loadForms();
  const filteredForms = forms.filter((f) => f.id !== formId);
  saveForms(filteredForms);

  // Also delete related responses
  const responses = loadFormResponses(formId);
  if (responses.length > 0) {
    deleteFormResponses(formId);
  }
};

// Response Management
export const saveFormResponse = (response: FormResponse): void => {
  try {
    const allResponses = loadAllResponses();
    allResponses.push(response);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(allResponses));
  } catch (error) {
    console.error("Failed to save form response:", error);
  }
};

export const loadFormResponses = (formId: string): FormResponse[] => {
  try {
    const allResponses = loadAllResponses();
    return allResponses.filter((r) => r.formId === formId);
  } catch (error) {
    console.error("Failed to load form responses:", error);
    return [];
  }
};

export const loadAllResponses = (): FormResponse[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load responses:", error);
    return [];
  }
};

export const deleteFormResponses = (formId: string): void => {
  try {
    const allResponses = loadAllResponses();
    const filteredResponses = allResponses.filter((r) => r.formId !== formId);
    localStorage.setItem(
      STORAGE_KEYS.RESPONSES,
      JSON.stringify(filteredResponses),
    );
  } catch (error) {
    console.error("Failed to delete form responses:", error);
  }
};

// Template Management
export const loadTemplates = (): FormTemplate[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (stored) {
      return JSON.parse(stored);
    }

    // Return default templates if none exist
    const defaultTemplates = getDefaultTemplates();
    saveTemplates(defaultTemplates);
    return defaultTemplates;
  } catch (error) {
    console.error("Failed to load templates:", error);
    return getDefaultTemplates();
  }
};

export const saveTemplates = (templates: FormTemplate[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (error) {
    console.error("Failed to save templates:", error);
  }
};

export const saveTemplate = (template: FormTemplate): void => {
  const templates = loadTemplates();
  const existingIndex = templates.findIndex((t) => t.id === template.id);

  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  saveTemplates(templates);
};

// Default Templates
const getDefaultTemplates = (): FormTemplate[] => {
  return [
    {
      id: "contact-us",
      name: "Contact Us",
      description: "A simple contact form with name, email, and message fields",
      category: "General",
      form: {
        title: "Contact Us",
        description: "Get in touch with us",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            validation: { required: true },
            order: 0,
          },
          {
            id: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            validation: { required: true },
            order: 1,
          },
          {
            id: "subject",
            type: "text",
            label: "Subject",
            placeholder: "What is this about?",
            validation: { required: true },
            order: 2,
          },
          {
            id: "message",
            type: "textarea",
            label: "Message",
            placeholder: "Tell us more...",
            validation: { required: true, minLength: 10 },
            order: 3,
          },
        ],
        steps: [],
        isMultiStep: false,
        isTemplate: false,
        settings: {
          allowEditing: false,
          requireAuth: false,
          collectEmail: true,
          thankYouMessage:
            "Thank you for contacting us! We will get back to you soon.",
        },
      },
    },
    {
      id: "survey",
      name: "Customer Satisfaction Survey",
      description: "Multi-step survey to collect customer feedback",
      category: "Survey",
      form: {
        title: "Customer Satisfaction Survey",
        description: "Help us improve our services by sharing your feedback",
        fields: [
          {
            id: "rating",
            type: "radio",
            label: "How would you rate our service?",
            validation: { required: true },
            options: [
              { id: "1", label: "Excellent", value: "5" },
              { id: "2", label: "Good", value: "4" },
              { id: "3", label: "Average", value: "3" },
              { id: "4", label: "Poor", value: "2" },
              { id: "5", label: "Very Poor", value: "1" },
            ],
            order: 0,
            stepId: "step1",
          },
          {
            id: "recommend",
            type: "radio",
            label: "Would you recommend us to others?",
            validation: { required: true },
            options: [
              { id: "1", label: "Yes", value: "yes" },
              { id: "2", label: "No", value: "no" },
              { id: "3", label: "Maybe", value: "maybe" },
            ],
            order: 1,
            stepId: "step1",
          },
          {
            id: "improvements",
            type: "textarea",
            label: "What can we improve?",
            placeholder: "Share your suggestions...",
            validation: { required: false },
            order: 2,
            stepId: "step2",
          },
          {
            id: "contact",
            type: "email",
            label: "Email (optional)",
            placeholder: "Enter your email for follow-up",
            validation: { required: false },
            order: 3,
            stepId: "step2",
          },
        ],
        steps: [
          {
            id: "step1",
            title: "Rate Our Service",
            description: "Please rate your experience",
            order: 0,
            fields: ["rating", "recommend"],
          },
          {
            id: "step2",
            title: "Additional Feedback",
            description: "Help us improve further",
            order: 1,
            fields: ["improvements", "contact"],
          },
        ],
        isMultiStep: true,
        isTemplate: false,
        settings: {
          allowEditing: false,
          requireAuth: false,
          collectEmail: false,
          thankYouMessage: "Thank you for your valuable feedback!",
        },
      },
    },
    {
      id: "registration",
      name: "Event Registration",
      description: "Registration form for events with detailed information",
      category: "Events",
      form: {
        title: "Event Registration",
        description: "Register for our upcoming event",
        fields: [
          {
            id: "firstName",
            type: "text",
            label: "First Name",
            placeholder: "Enter your first name",
            validation: { required: true },
            order: 0,
          },
          {
            id: "lastName",
            type: "text",
            label: "Last Name",
            placeholder: "Enter your last name",
            validation: { required: true },
            order: 1,
          },
          {
            id: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            validation: { required: true },
            order: 2,
          },
          {
            id: "phone",
            type: "phone",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            validation: { required: true },
            order: 3,
          },
          {
            id: "organization",
            type: "text",
            label: "Organization",
            placeholder: "Company or organization name",
            validation: { required: false },
            order: 4,
          },
          {
            id: "dietaryRestrictions",
            type: "checkbox",
            label: "Dietary Restrictions",
            validation: { required: false },
            options: [
              { id: "1", label: "Vegetarian", value: "vegetarian" },
              { id: "2", label: "Vegan", value: "vegan" },
              { id: "3", label: "Gluten-free", value: "gluten-free" },
              { id: "4", label: "No restrictions", value: "none" },
            ],
            order: 5,
          },
        ],
        steps: [],
        isMultiStep: false,
        isTemplate: false,
        settings: {
          allowEditing: true,
          requireAuth: false,
          collectEmail: true,
          thankYouMessage:
            "Registration successful! You will receive a confirmation email shortly.",
        },
      },
    },
  ];
};

// Generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate shareable URL
export const generateShareableUrl = (formId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/form/${formId}`;
};

// Export form data
export const exportFormData = (form: Form, responses: FormResponse[]): void => {
  const data = {
    form,
    responses,
    exportedAt: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `form-${form.title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Settings Management
export const saveSettings = (settings: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
};

export const loadSettings = (): any => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : { theme: "light", autoSave: true };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return { theme: "light", autoSave: true };
  }
};
