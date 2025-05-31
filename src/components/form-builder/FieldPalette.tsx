import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFormBuilder } from "@/context/FormBuilderContext";
import { useFormActions } from "@/context/FormBuilderContext";
import { FieldType } from "@/types/form";
import {
  Type,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Circle,
  Calendar,
  Mail,
  Phone,
  Hash,
} from "lucide-react";

interface FieldTypeConfig {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const fieldTypes: FieldTypeConfig[] = [
  {
    type: "text",
    label: "Text",
    icon: <Type className="w-4 h-4" />,
    description: "Single line text input",
  },
  {
    type: "textarea",
    label: "Textarea",
    icon: <AlignLeft className="w-4 h-4" />,
    description: "Multi-line text input",
  },
  {
    type: "email",
    label: "Email",
    icon: <Mail className="w-4 h-4" />,
    description: "Email address input",
  },
  {
    type: "phone",
    label: "Phone",
    icon: <Phone className="w-4 h-4" />,
    description: "Phone number input",
  },
  {
    type: "number",
    label: "Number",
    icon: <Hash className="w-4 h-4" />,
    description: "Numeric input",
  },
  {
    type: "dropdown",
    label: "Dropdown",
    icon: <ChevronDown className="w-4 h-4" />,
    description: "Select from options",
  },
  {
    type: "radio",
    label: "Radio",
    icon: <Circle className="w-4 h-4" />,
    description: "Single choice from options",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <CheckSquare className="w-4 h-4" />,
    description: "Multiple choice from options",
  },
  {
    type: "date",
    label: "Date",
    icon: <Calendar className="w-4 h-4" />,
    description: "Date picker input",
  },
];

interface FieldPaletteProps {
  currentStepId?: string;
}

export const FieldPalette: React.FC<FieldPaletteProps> = ({
  currentStepId,
}) => {
  const { state } = useFormBuilder();
  const { addField } = useFormActions();

  const handleAddField = (fieldType: FieldType) => {
    addField(fieldType, currentStepId);
  };

  const handleDragStart = (e: React.DragEvent, fieldType: FieldType) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: "field",
        fieldType,
      }),
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Field Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldTypes.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="outline"
            className="w-full justify-start h-auto p-3 text-left"
            draggable
            onDragStart={(e) => handleDragStart(e, fieldType.type)}
            onClick={() => handleAddField(fieldType.type)}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="mt-0.5 text-muted-foreground">
                {fieldType.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{fieldType.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {fieldType.description}
                </div>
              </div>
            </div>
          </Button>
        ))}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 Drag fields to the form canvas or click to add
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
