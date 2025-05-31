import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/types/form";
import { generateShareableUrl, saveForm } from "@/utils/formStorage";
import { Copy, ExternalLink, Settings, QrCode, Download } from "lucide-react";

interface ShareModalProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  form,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [shareableUrl] = useState(generateShareableUrl(form.id));
  const [embedCode] = useState(
    `<iframe src="${generateShareableUrl(form.id)}" width="100%" height="600" frameborder="0"></iframe>`,
  );
  const [formSettings, setFormSettings] = useState(form.settings);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast({
        title: "Copied!",
        description: "Form URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the embed code manually",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = () => {
    const updatedForm = {
      ...form,
      settings: formSettings,
      updatedAt: new Date().toISOString(),
    };

    saveForm(updatedForm);
    toast({
      title: "Settings saved",
      description: "Form sharing settings have been updated",
    });
  };

  const handleOpenForm = () => {
    window.open(shareableUrl, "_blank");
  };

  const generateQRCode = () => {
    // In a real app, you'd use a QR code library
    // For now, we'll just open a QR code generator service
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableUrl)}`;
    window.open(qrUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Form</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form Info */}
          <div className="space-y-2">
            <h3 className="font-medium">Form: {form.title}</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{form.fields.length} fields</Badge>
              {form.isMultiStep && (
                <Badge variant="outline">{form.steps.length} steps</Badge>
              )}
              <Badge variant="secondary">Form ID: {form.id}</Badge>
            </div>
          </div>

          <Separator />

          {/* Shareable URL */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Shareable URL
            </h3>
            <div className="flex gap-2">
              <Input
                value={shareableUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenForm}>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this URL to allow others to fill out your form
            </p>
          </div>

          {/* Embed Code */}
          <div className="space-y-3">
            <h3 className="font-medium">Embed Code</h3>
            <Textarea
              value={embedCode}
              readOnly
              rows={3}
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyEmbed}>
                <Copy className="w-4 h-4 mr-1" />
                Copy Embed Code
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Embed this form directly into your website
            </p>
          </div>

          <Separator />

          {/* Additional Options */}
          <div className="space-y-3">
            <h3 className="font-medium">Additional Options</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={generateQRCode}>
                <QrCode className="w-4 h-4 mr-1" />
                Generate QR Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Download form as JSON
                  const dataStr = JSON.stringify(form, null, 2);
                  const dataBlob = new Blob([dataStr], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `form-${form.title.replace(/\s+/g, "-").toLowerCase()}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Export JSON
              </Button>
            </div>
          </div>

          <Separator />

          {/* Form Settings */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Form Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Response Editing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to edit their responses after submission
                  </p>
                </div>
                <Switch
                  checked={formSettings.allowEditing}
                  onCheckedChange={(checked) =>
                    setFormSettings((prev) => ({
                      ...prev,
                      allowEditing: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require users to log in before filling the form
                  </p>
                </div>
                <Switch
                  checked={formSettings.requireAuth}
                  onCheckedChange={(checked) =>
                    setFormSettings((prev) => ({
                      ...prev,
                      requireAuth: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Collect Email Addresses</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically collect respondent email addresses
                  </p>
                </div>
                <Switch
                  checked={formSettings.collectEmail}
                  onCheckedChange={(checked) =>
                    setFormSettings((prev) => ({
                      ...prev,
                      collectEmail: checked,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thank-you-message">Thank You Message</Label>
                <Textarea
                  id="thank-you-message"
                  value={formSettings.thankYouMessage}
                  onChange={(e) =>
                    setFormSettings((prev) => ({
                      ...prev,
                      thankYouMessage: e.target.value,
                    }))
                  }
                  placeholder="Message to show after form submission"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
                <Input
                  id="redirect-url"
                  type="url"
                  value={formSettings.redirectUrl || ""}
                  onChange={(e) =>
                    setFormSettings((prev) => ({
                      ...prev,
                      redirectUrl: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/thank-you"
                />
                <p className="text-sm text-muted-foreground">
                  Redirect users to this URL after form submission
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
