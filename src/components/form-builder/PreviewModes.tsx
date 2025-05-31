import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormBuilder } from "@/context/FormBuilderContext";
import { PreviewMode } from "@/types/form";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const previewModes: {
  mode: PreviewMode;
  label: string;
  icon: React.ReactNode;
  width: string;
}[] = [
  {
    mode: "desktop",
    label: "Desktop",
    icon: <Monitor className="w-4 h-4" />,
    width: "100%",
  },
  {
    mode: "tablet",
    label: "Tablet",
    icon: <Tablet className="w-4 h-4" />,
    width: "768px",
  },
  {
    mode: "mobile",
    label: "Mobile",
    icon: <Smartphone className="w-4 h-4" />,
    width: "375px",
  },
];

interface PreviewModesProps {
  children: React.ReactNode;
}

export const PreviewModes: React.FC<PreviewModesProps> = ({ children }) => {
  const { state, dispatch } = useFormBuilder();

  const setPreviewMode = (mode: PreviewMode) => {
    dispatch({ type: "SET_PREVIEW_MODE", payload: mode });
  };

  const currentModeConfig = previewModes.find(
    (m) => m.mode === state.previewMode,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Form Preview</CardTitle>
          <div className="flex gap-1 bg-muted rounded-md p-1">
            {previewModes.map((mode) => (
              <Button
                key={mode.mode}
                variant={state.previewMode === mode.mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode(mode.mode)}
                className="h-8"
              >
                {mode.icon}
                <span className="ml-1 hidden sm:inline">{mode.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div
            className={cn(
              "transition-all duration-300 border rounded-lg bg-background shadow-sm",
              state.previewMode === "mobile" && "border-2",
              state.previewMode === "tablet" && "border-2",
            )}
            style={{
              width: currentModeConfig?.width,
              maxWidth: "100%",
            }}
          >
            <div
              className={cn(
                "p-6",
                state.previewMode === "mobile" && "p-4",
                state.previewMode === "tablet" && "p-5",
              )}
            >
              {children}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Viewing in {currentModeConfig?.label.toLowerCase()} mode
          {state.previewMode !== "desktop" && ` (${currentModeConfig?.width})`}
        </div>
      </CardContent>
    </Card>
  );
};
