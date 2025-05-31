import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormBuilder } from "@/context/FormBuilderContext";
import { FormTemplate, Form } from "@/types/form";
import { loadTemplates, saveTemplate, generateId } from "@/utils/formStorage";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Users,
  Calendar,
  Layout,
  Plus,
  ArrowLeft,
  Save,
  Eye,
} from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "general":
      return <FileText className="w-5 h-5" />;
    case "survey":
      return <Users className="w-5 h-5" />;
    case "events":
      return <Calendar className="w-5 h-5" />;
    default:
      return <Layout className="w-5 h-5" />;
  }
};

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useFormBuilder();
  const { toast } = useToast();

  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    null,
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    loadTemplateData();
  }, []);

  const loadTemplateData = () => {
    const templateData = loadTemplates();
    setTemplates(templateData);
  };

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

  const handleUseTemplate = (template: FormTemplate) => {
    const newForm: Form = {
      ...template.form,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: false,
    };

    dispatch({ type: "SET_FORM", payload: newForm });
    dispatch({ type: "SAVE_TO_HISTORY" });
    navigate("/builder");
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
    navigate("/builder");
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }

    const template: FormTemplate = {
      id: generateId(),
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      form: {
        title: newTemplate.name,
        description: newTemplate.description,
        fields: [],
        steps: [],
        isMultiStep: false,
        isTemplate: false,
        settings: {
          allowEditing: false,
          requireAuth: false,
          collectEmail: false,
          thankYouMessage: "Thank you for your submission!",
        },
      },
    };

    saveTemplate(template);
    loadTemplateData();
    setShowCreateDialog(false);
    setNewTemplate({ name: "", description: "", category: "General" });

    toast({
      title: "Template Created",
      description: "Your new template has been created successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Form Templates</h1>
                <p className="text-sm text-muted-foreground">
                  Choose from pre-built templates or create your own
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Create Blank Form */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Start Fresh</h2>
            <Card
              className="cursor-pointer hover:border-blue-500 transition-colors max-w-md"
              onClick={handleCreateBlank}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Layout className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Blank Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Start with an empty form and build from scratch
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Categories */}
          {Object.entries(groupedTemplates).map(
            ([category, categoryTemplates]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  {getCategoryIcon(category)}
                  <h2 className="text-lg font-semibold">{category}</h2>
                  <Badge variant="secondary">{categoryTemplates.length}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg">
                              {template.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplate(template);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{template.form.fields.length} fields</span>
                          </div>
                          {template.form.isMultiStep && (
                            <div className="flex items-center gap-1">
                              <Layout className="w-4 h-4" />
                              <span>{template.form.steps.length} steps</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          {template.form.isMultiStep && (
                            <Badge variant="outline" className="text-xs">
                              Multi-step
                            </Badge>
                          )}
                        </div>

                        <Button
                          onClick={() => handleUseTemplate(template)}
                          className="w-full"
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          )}

          {templates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first template to get started
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Create Template
              </Button>
            </div>
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
              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground mb-4">
                    {selectedTemplate.description}
                  </p>

                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{selectedTemplate.category}</Badge>
                    <Badge variant="secondary">
                      {selectedTemplate.form.fields.length} fields
                    </Badge>
                    {selectedTemplate.form.isMultiStep && (
                      <Badge variant="secondary">
                        {selectedTemplate.form.steps.length} steps
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Fields included:</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {selectedTemplate.form.fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between text-sm p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{field.label}</span>
                          {field.helpText && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {field.helpText}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {field.type}
                          </Badge>
                          {field.validation.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTemplate.form.isMultiStep && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Steps:</h4>
                    <div className="space-y-2">
                      {selectedTemplate.form.steps.map((step, index) => (
                        <div key={step.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              Step {index + 1}
                            </Badge>
                            <span className="font-medium text-sm">
                              {step.title}
                            </span>
                          </div>
                          {step.description && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {step.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {step.fields.length} fields in this step
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleUseTemplate(selectedTemplate);
                      setSelectedTemplate(null);
                    }}
                  >
                    Use This Template
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Template Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter template name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this template is for"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-category">Category</Label>
                <Input
                  id="template-category"
                  value={newTemplate.category}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="e.g., General, Survey, Events"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>
                  <Save className="w-4 h-4 mr-1" />
                  Create Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};
