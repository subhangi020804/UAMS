import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Folder, Eye, Copy, Trash2, Filter, SortAsc, FileText, MapPin, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { filesApi, type FileRecord } from "../services/api";
import { useAuth } from "../context/AuthContext";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Expiring Soon":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Expired":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function MyFilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await filesApi.list({
        page,
        limit,
        status: statusFilter === "all" ? undefined : statusFilter,
        sort: sortBy,
        search: debouncedSearch.trim() || undefined,
      });
      if (data.success && data.data) {
        setFiles(data.data.files);
        setTotal(data.data.total);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, sortBy, debouncedSearch]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleDelete = async (fileId: string) => {
    if (!isAdmin || !confirm("Are you sure you want to delete this file? This cannot be undone.")) return;
    try {
      await filesApi.delete(fileId);
      toast.success("File deleted");
      loadFiles();
      setShowModal(false);
      setSelectedFile(null);
    } catch {
      toast.error("Failed to delete file");
    }
  };

  const handleCopyFileId = (fileId: string) => {
    navigator.clipboard.writeText(fileId);
    toast.success("File ID copied!");
  };

  const activeCount = files.filter((f) => f.status === "Active").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Toaster />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">My Uploaded Files</h1>
            <p className="text-white/80">View and manage your archived files</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <Link to="/upload">
              <FileText className="w-4 h-4 mr-2" />
              Upload New File
            </Link>
          </Button>
        </div>
      </motion.div>

      <Card className="bg-white/95 backdrop-blur-sm shadow-xl mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-semibold text-foreground">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="px-3 py-1.5 border border-border rounded-md bg-input-background text-sm font-medium"
                >
                  <option value="all">All</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-muted-foreground" />
                <label className="text-sm font-semibold text-foreground">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="px-3 py-1.5 border border-border rounded-md bg-input-background text-sm font-medium"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="expiry">Expiry</option>
                  <option value="name">Name</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Search by ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 border border-border rounded-md bg-input-background text-sm max-w-[200px]"
              />
            </div>
            <div className="flex gap-6 text-sm">
              <span className="text-muted-foreground">Total: <span className="font-bold text-foreground">{total}</span></span>
              <span className="text-muted-foreground">Active: <span className="font-bold text-green-600">{activeCount}</span></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card className="bg-white/95">
          <CardContent className="p-12 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : files.length === 0 ? (
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="text-center py-16">
            <Folder className="w-12 h-12 text-primary mx-auto mb-6 opacity-60" />
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">No Files Found</h3>
            <p className="text-muted-foreground text-lg mb-6">Upload a file or adjust filters</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Link to="/upload">
                <FileText className="w-5 h-5 mr-2" />
                Upload File
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">File ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">File Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Upload Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Expiry</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <motion.tr
                      key={file.file_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-sm font-semibold text-primary font-mono">{file.file_id}</code>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{file.file_name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-foreground">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {file.location || `${file.building || ""} ${file.room || ""}`.trim() || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{file.createdAt ? formatDate(file.createdAt) : "—"}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{formatDate(file.expiry_date)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(file.status)}`}>
                          {file.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setSelectedFile(file); setShowModal(true); }}
                            className="text-xs"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive/50 hover:bg-destructive/10 text-xs"
                              onClick={() => handleDelete(file.file_id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-white/80">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {showModal && selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => { setShowModal(false); setSelectedFile(null); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-display font-bold text-primary">File Details</h2>
              </div>
              <button onClick={() => { setShowModal(false); setSelectedFile(null); }} className="p-2 hover:bg-accent rounded-lg">
                <AlertCircle className="w-5 h-5 text-muted-foreground rotate-45" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">File ID</p>
                  <p className="text-lg font-semibold text-primary font-mono">{selectedFile.file_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">File Name</p>
                  <p className="text-lg font-semibold text-foreground">{selectedFile.file_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">File Size</p>
                  <p className="text-lg font-semibold text-foreground">{formatFileSize(selectedFile.file_size)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Building / Room</p>
                  <p className="text-lg font-semibold text-foreground">{selectedFile.building || "—"} / {selectedFile.room || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Upload Date</p>
                  <p className="text-lg font-semibold text-foreground">{selectedFile.createdAt ? formatDate(selectedFile.createdAt) : "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Retention</p>
                  <p className="text-lg font-semibold text-foreground">{selectedFile.retention_years} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expiry Date</p>
                  <p className="text-lg font-semibold text-foreground">{formatDate(selectedFile.expiry_date)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusBadgeClass(selectedFile.status)}`}>
                    {selectedFile.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-border p-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCopyFileId(selectedFile.file_id)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy File ID
              </Button>
              {isAdmin && (
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedFile.file_id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete File
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
