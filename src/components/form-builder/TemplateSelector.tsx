import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFormBuilder } from "@/context/FormBuilderContext";
import { FormTemplate, Form } from "@/types/form";
import { loadTemplates } from "@/utils/formStorage";
import { generateId } from "@/utils/formStorage";
import { FileText, Users, Calendar, Layout } from "lucide-react";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "general":
      return <FileText className="w-4 h-4" />;
    case "survey":
      return <Users className="w-4 h-4" />;
    case "events":
      return <Calendar className="w-4 h-4" />;
    default:
      return <Layout className="w-4 h-4" />;
  }
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
}) => {
  const { dispatch } = useFormBuilder();
  const [templates] = useState<FormTemplate[]>(loadTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    null,
  );

  const groupedTemplates = templates.reduce(
    (acc, template) => {
      const category = template.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    },
    {} as Record<string, FormTemplate[]>,
  );

  const handleSelectTemplate = (template: FormTemplate) => {
    const newForm: Form = {
      ...template.form,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: false,
    };

    dispatch({ type: "SET_FORM", payload: newForm });
    dispatch({ type: "SAVE_TO_HISTORY" });
    onClose();
  };

  const handleCreateBlank = () => {
    const blankForm: Form = {
      id: generateId(),
      title: "Untitled Form",
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

    dispatch({ type: "SET_FORM", payload: blankForm });
    dispatch({ type: "SAVE_TO_HISTORY" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create Blank Form */}
          <div>
            <h3 className="font-medium mb-3">Start Fresh</h3>
            <Card
              className="cursor-pointer hover:border-blue-500 transition-colors"
              onClick={handleCreateBlank}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Layout className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">Blank Form</h4>
                    <p className="text-sm text-muted-foreground">
                      Start with an empty form and build from scratch
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Template Categories */}
          {Object.entries(groupedTemplates).map(
            ([category, categoryTemplates]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  {getCategoryIcon(category)}
                  <h3 className="font-medium">{category}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {template.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {template.form.fields.length} fields
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {template.form.isMultiStep && (
                              <Badge variant="outline" className="text-xs">
                                Multi-step
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>

        {/* Template Preview Dialog */}
        <Dialog
          open={!!selectedTemplate}
          onOpenChange={() => setSelectedTemplate(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            </DialogHeader>

            {selectedTemplate && (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {selectedTemplate.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Fields included:</h4>
                  <div className="space-y-1">
                    {selectedTemplate.form.fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between text-sm p-2 bg-muted rounded"
                      >
                        <span>{field.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {field.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTemplate.form.isMultiStep && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Steps:</h4>
                    <div className="space-y-1">
                      {selectedTemplate.form.steps.map((step) => (
                        <div
                          key={step.id}
                          className="text-sm p-2 bg-muted rounded"
                        >
                          <div className="font-medium">{step.title}</div>
                          {step.description && (
                            <div className="text-muted-foreground text-xs mt-1">
                              {step.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-1">
                            {step.fields.length} fields
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSelectTemplate(selectedTemplate)}
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
