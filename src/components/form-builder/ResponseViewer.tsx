import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormResponse } from "@/types/form";
import { loadFormResponses, exportFormData } from "@/utils/formStorage";
import { Download, Eye, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ResponseViewerProps {
  form: Form;
  isOpen: boolean;
  onClose: () => void;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  form,
  isOpen,
  onClose,
}) => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadResponses();
    }
  }, [isOpen, form.id]);

  const loadResponses = () => {
    setLoading(true);
    const formResponses = loadFormResponses(form.id);
    setResponses(
      formResponses.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      ),
    );
    setLoading(false);
  };

  const handleExportData = () => {
    exportFormData(form, responses);
  };

  const getFieldValue = (response: FormResponse, fieldId: string) => {
    const value = response.responses[fieldId];

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    return value || "No response";
  };

  const getFieldLabel = (fieldId: string) => {
    const field = form.fields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Form Responses</DialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={responses.length === 0}
              >
                <Download className="w-4 h-4 mr-1" />
                Export Data
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{responses.length}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Responses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {responses.length > 0
                        ? Math.ceil(
                            responses.length /
                              Math.max(
                                1,
                                Math.ceil(
                                  (Date.now() -
                                    new Date(form.createdAt).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                ),
                              ),
                          )
                        : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg per Day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {responses.length > 0
                        ? formatDistanceToNow(
                            new Date(responses[0].submittedAt),
                          )
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Latest Response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading responses...</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No responses yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Share your form to start collecting responses
              </p>
            </div>
          ) : (
            <>
              {/* Responses List */}
              <div className="space-y-4">
                <h3 className="font-medium">Recent Responses</h3>
                <div className="space-y-3">
                  {responses.map((response, index) => (
                    <Card
                      key={response.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedResponse(response)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                #{responses.length - index}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(response.submittedAt),
                                  { addSuffix: true },
                                )}
                              </span>
                            </div>
                            <div className="text-sm">
                              {Object.entries(response.responses)
                                .slice(0, 3)
                                .map(([fieldId, value]) => (
                                  <span key={fieldId} className="mr-4">
                                    <strong>{getFieldLabel(fieldId)}:</strong>{" "}
                                    {String(value).slice(0, 50)}
                                    {String(value).length > 50 ? "..." : ""}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Response Detail Dialog */}
        <Dialog
          open={!!selectedResponse}
          onOpenChange={() => setSelectedResponse(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Response Details</DialogTitle>
            </DialogHeader>

            {selectedResponse && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Submitted:{" "}
                    {new Date(selectedResponse.submittedAt).toLocaleString()}
                  </span>
                  <Badge variant="outline">ID: {selectedResponse.id}</Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="font-medium">{field.label}</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm">
                          {getFieldValue(selectedResponse, field.id)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedResponse.metadata && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Metadata</h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        {selectedResponse.metadata.userAgent && (
                          <p>
                            <strong>User Agent:</strong>{" "}
                            {selectedResponse.metadata.userAgent}
                          </p>
                        )}
                        {selectedResponse.metadata.ipAddress && (
                          <p>
                            <strong>IP Address:</strong>{" "}
                            {selectedResponse.metadata.ipAddress}
                          </p>
                        )}
                        {selectedResponse.metadata.referrer && (
                          <p>
                            <strong>Referrer:</strong>{" "}
                            {selectedResponse.metadata.referrer}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
