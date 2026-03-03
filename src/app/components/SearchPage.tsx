import { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  FileText,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Copy,
  Clock,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { filesApi } from "../services/api";

const ARC_ID_REGEX = /^ARC-\d{4}-\d{6}$/;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{
    file_id: string;
    file_name: string;
    status: string;
    expiry_date: string;
    location: string;
    building?: string;
    room?: string;
    upload_date?: string;
    retention_years: number;
  } | null>(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setSearchError("");
    setSearchResult(null);
    if (!searchQuery.trim()) {
      setSearchError("Please enter a File ID or search term");
      return;
    }
    setIsSearching(true);
    try {
      const trimmed = searchQuery.trim();
      if (ARC_ID_REGEX.test(trimmed)) {
        const { data } = await filesApi.getById(trimmed);
        if (data.success && data.data?.file) {
          const f = data.data.file;
          setSearchResult({
            file_id: f.file_id,
            file_name: f.file_name,
            status: f.status,
            expiry_date: f.expiry_date,
            location: f.location || `${f.building || ""} ${f.room || ""}`.trim(),
            building: f.building,
            room: f.room,
            upload_date: f.createdAt,
            retention_years: f.retention_years,
          });
          toast.success("File found!", { description: `Status: ${f.status}` });
        } else {
          setSearchError("File ID not found in the archive");
          toast.error("File not found");
        }
      } else {
        const { data } = await filesApi.list({ search: trimmed, limit: 1 });
        if (data.success && data.data?.files?.length) {
          const f = data.data.files[0];
          setSearchResult({
            file_id: f.file_id,
            file_name: f.file_name,
            status: f.status,
            expiry_date: f.expiry_date,
            location: f.location || `${f.building || ""} ${f.room || ""}`.trim(),
            building: f.building,
            room: f.room,
            upload_date: f.createdAt,
            retention_years: f.retention_years,
          });
          toast.success("File found!");
        } else {
          setSearchError("No matching files found");
          toast.error("No results");
        }
      }
    } catch {
      setSearchError("Search failed. Please try again.");
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Toaster />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-display text-primary">Search Archive</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter a File ID (ARC-YYYY-XXXXXX) or search by name
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-4 mb-8">
              <Label htmlFor="searchInput" className="text-lg">File ID or Search</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    id="searchInput"
                    type="text"
                    placeholder="ARC-2025-XXXXXX or filename"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="text-lg py-6 bg-input-background"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  disabled={isSearching}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 px-8"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>

              {searchError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
                >
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-medium">{searchError}</p>
                </motion.div>
              )}
            </div>

            {searchResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-primary/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl">File Details</CardTitle>
                      </div>
                      <Badge
                        className={
                          searchResult.status === "Active"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : searchResult.status === "Expiring Soon"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-red-100 text-red-800 border-red-300"
                        }
                      >
                        {searchResult.status === "Active" && <CheckCircle2 className="w-4 h-4 mr-1" />}
                        {searchResult.status === "Expiring Soon" && <CheckCircle2 className="w-4 h-4 mr-1" />}
                        {searchResult.status === "Expired" && <XCircle className="w-4 h-4 mr-1" />}
                        {searchResult.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between p-4 bg-accent rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">File ID</p>
                          <p className="text-2xl font-bold font-mono text-primary">{searchResult.file_id}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(searchResult.file_id)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5 text-secondary" />
                            <p className="font-semibold text-foreground">Location</p>
                          </div>
                          <p className="text-lg text-foreground/80">{searchResult.location || "—"}</p>
                          {(searchResult.building || searchResult.room) && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Building: {searchResult.building || "—"} • Room: {searchResult.room || "—"}
                            </p>
                          )}
                        </div>

                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-secondary" />
                            <p className="font-semibold text-foreground">Expiry Date</p>
                          </div>
                          <p className="text-lg text-foreground/80">{formatDate(searchResult.expiry_date)}</p>
                          <p className="text-sm text-muted-foreground mt-1">Retention: {searchResult.retention_years} years</p>
                        </div>

                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-secondary" />
                            <p className="font-semibold text-foreground">Upload Date</p>
                          </div>
                          <p className="text-lg text-foreground/80">
                            {searchResult.upload_date ? formatDate(searchResult.upload_date) : "—"}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchResult(null);
                            setSearchQuery("");
                          }}
                        >
                          Search Another
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-white/80 text-sm"
        >
          <p>Fast • Accurate • Traceable</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
