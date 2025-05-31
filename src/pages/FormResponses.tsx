import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormResponse } from "@/types/form";
import {
  loadForm,
  loadFormResponses,
  exportFormData,
} from "@/utils/formStorage";
import {
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  BarChart3,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const FormResponses: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>(
    [],
  );
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [filterBy, setFilterBy] = useState<"all" | "recent" | "week" | "month">(
    "all",
  );

  useEffect(() => {
    if (formId) {
      loadData();
    }
  }, [formId]);

  useEffect(() => {
    filterAndSortResponses();
  }, [responses, searchTerm, sortBy, filterBy]);

  const loadData = () => {
    if (!formId) return;

    const formData = loadForm(formId);
    if (!formData) {
      navigate("/");
      return;
    }

    setForm(formData);
    const formResponses = loadFormResponses(formId);
    setResponses(formResponses);
    setLoading(false);
  };

  const filterAndSortResponses = () => {
    let filtered = [...responses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((response) =>
        Object.values(response.responses).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }

    // Apply date filter
    const now = new Date();
    switch (filterBy) {
      case "recent":
        filtered = filtered.filter((response) => {
          const responseDate = new Date(response.submittedAt);
          return now.getTime() - responseDate.getTime() < 24 * 60 * 60 * 1000; // 24 hours
        });
        break;
      case "week":
        filtered = filtered.filter((response) => {
          const responseDate = new Date(response.submittedAt);
          return (
            now.getTime() - responseDate.getTime() < 7 * 24 * 60 * 60 * 1000
          ); // 7 days
        });
        break;
      case "month":
        filtered = filtered.filter((response) => {
          const responseDate = new Date(response.submittedAt);
          return (
            now.getTime() - responseDate.getTime() < 30 * 24 * 60 * 60 * 1000
          ); // 30 days
        });
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredResponses(filtered);
  };

  const getFieldValue = (response: FormResponse, fieldId: string): string => {
    const value = response.responses[fieldId];

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    return value ? String(value) : "No response";
  };

  const getFieldLabel = (fieldId: string): string => {
    const field = form?.fields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  const handleExportData = () => {
    if (form) {
      exportFormData(form, filteredResponses);
    }
  };

  const getResponseSummary = (response: FormResponse): string => {
    if (!form) return "";

    // Get first few field responses for summary
    const summaryFields = form.fields.slice(0, 3);
    const summaryParts = summaryFields.map((field) => {
      const value = getFieldValue(response, field.id);
      return value.length > 30 ? value.substring(0, 30) + "..." : value;
    });

    return summaryParts.join(" • ");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading responses...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Form Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The form you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Form Responses</h1>
                <p className="text-sm text-muted-foreground">{form.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                disabled={filteredResponses.length === 0}
              >
                <Download className="w-4 h-4 mr-1" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      {
                        responses.filter((r) => {
                          const responseDate = new Date(r.submittedAt);
                          return (
                            Date.now() - responseDate.getTime() <
                            24 * 60 * 60 * 1000
                          );
                        }).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
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
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {responses.length > 0
                        ? formatDistanceToNow(
                            new Date(responses[0].submittedAt),
                          )
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Latest</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search responses</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Search by response content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <Label>Sort by</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(value: any) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Filter by</Label>
                    <Select
                      value={filterBy}
                      onValueChange={(value: any) => setFilterBy(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="recent">Last 24h</SelectItem>
                        <SelectItem value="week">Last week</SelectItem>
                        <SelectItem value="month">Last month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responses List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Responses ({filteredResponses.length})</CardTitle>
                {filteredResponses.length !== responses.length && (
                  <Badge variant="secondary">
                    Filtered from {responses.length} total
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredResponses.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No responses found</p>
                  {searchTerm || filterBy !== "all" ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search or filters
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      Share your form to start collecting responses
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResponses.map((response, index) => (
                    <Card
                      key={response.id}
                      className="cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedResponse(response)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                #{filteredResponses.length - index}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(response.submittedAt),
                                  { addSuffix: true },
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  response.submittedAt,
                                ).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">
                              {getResponseSummary(response)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Response Detail Dialog */}
        <Dialog
          open={!!selectedResponse}
          onOpenChange={() => setSelectedResponse(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Response Details</DialogTitle>
            </DialogHeader>

            {selectedResponse && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline">ID: {selectedResponse.id}</Badge>
                  <span className="text-muted-foreground">
                    Submitted:{" "}
                    {new Date(selectedResponse.submittedAt).toLocaleString()}
                  </span>
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
      </main>
    </div>
  );
};
