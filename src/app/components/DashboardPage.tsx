import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FileText,
  TrendingUp,
  Archive,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { dashboardApi } from "../services/api";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{
    totalFiles: number;
    activeFiles: number;
    expiringSoonFiles: number;
    expiredFiles: number;
    storageUsedBytes: number;
  } | null>(null);
  const [fileTypeDistribution, setFileTypeDistribution] = useState<{ name: string; value: number; color: string }[]>([]);
  const [recentUploads, setRecentUploads] = useState<{ file_id: string; file_name: string; status: string; upload_date?: string; uploaded_by?: { name: string } }[]>([]);
  const [expiringSoonAlerts, setExpiringSoonAlerts] = useState<{ file_id: string; file_name: string; expiry_date: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        setError("");
        const { data } = await dashboardApi.stats();
        if (!cancelled && data.success && data.data) {
          setStats(data.data.stats);
          const dist = (data.data.fileTypeDistribution || []).map((d: { _id: string; count: number }, i: number) => ({
            name: d._id.split("/").pop() || d._id,
            value: d.count,
            color: ["#0a1f44", "#153a7a", "#2e7d32", "#f57c00", "#c62828"][i % 5],
          }));
          setFileTypeDistribution(dist);
          setRecentUploads(data.data.recentUploads || []);
          setExpiringSoonAlerts(data.data.expiringSoonAlerts || []);
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load dashboard stats.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[400px]">
        <p className="text-white/80">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Card className="bg-white/95">
          <CardContent className="p-6 text-center text-destructive">{error || "No data"}</CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    { title: "Total Files", value: stats.totalFiles, change: "", icon: FileText, color: "from-blue-500 to-cyan-500" },
    { title: "Active Files", value: stats.activeFiles, change: "", icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { title: "Expiring Soon", value: stats.expiringSoonFiles, change: "", icon: AlertTriangle, color: "from-orange-500 to-red-500" },
    { title: "Expired Files", value: stats.expiredFiles, change: "", icon: XCircle, color: "from-red-500 to-pink-500" },
  ];

  const statusData = [
    { name: "Active", value: stats.activeFiles || 1, color: "#2e7d32" },
    { name: "Expiring Soon", value: stats.expiringSoonFiles || 0, color: "#f57c00" },
    { name: "Expired", value: stats.expiredFiles || 0, color: "#c62828" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">Archive Dashboard</h1>
          <p className="text-white/80">Overview of your archive management system</p>
          {stats.storageUsedBytes > 0 && (
            <p className="text-white/60 text-sm mt-1">Storage used: {formatBytes(stats.storageUsedBytes)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle>Storage &amp; File Types</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={fileTypeDistribution.length ? fileTypeDistribution : [{ name: "No data", value: 1, color: "#ccc" }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(fileTypeDistribution.length ? fileTypeDistribution : [{ color: "#ccc" }]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Archive className="w-5 h-5 text-primary" />
                <CardTitle>Status Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUploads.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No recent uploads</p>
                ) : (
                  recentUploads.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="font-mono text-sm font-semibold text-foreground">{activity.file_id}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.file_name} {activity.uploaded_by?.name && `• ${activity.uploaded_by.name}`}
                        </p>
                      </div>
                      <Badge className={activity.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-l-4 border-orange-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-orange-900">Expiring Soon</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringSoonAlerts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No files expiring in the next 30 days</p>
                ) : (
                  expiringSoonAlerts.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <p className="font-mono text-sm font-semibold text-foreground">{file.file_id}</p>
                        <p className="text-xs text-muted-foreground">{file.file_name}</p>
                        <p className="text-xs text-muted-foreground">Expires: {formatDate(file.expiry_date)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
