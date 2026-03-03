import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { auditApi } from "../services/api";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AuditPage() {
  const [logs, setLogs] = useState<{ _id: string; action: string; user?: { name: string; email: string }; file_id?: string; ip_address?: string; createdAt: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await auditApi.list({ page, limit: 20 });
        if (!cancelled && data.success && data.data) {
          setLogs(data.data.logs || []);
          setTotal(data.data.total || 0);
          setTotalPages(data.data.totalPages || 1);
        }
      } catch {
        if (!cancelled) setLogs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Audit Log</h1>
          <p className="text-white/80">System activity and access history (admin only)</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle>Recent activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No audit entries yet.</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Action</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">User</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">File ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-primary">IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id} className="border-b border-border hover:bg-accent/50">
                          <td className="px-4 py-3 text-sm text-foreground">{formatDate(log.createdAt)}</td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-foreground">{log.action}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {log.user ? `${log.user.name} (${log.user.email})` : "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-primary">{log.file_id || "—"}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{log.ip_address || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      Total: {total} • Page {page} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
