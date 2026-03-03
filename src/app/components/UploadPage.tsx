import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Upload, FileText, CheckCircle2, Building2, DoorOpen, Calendar, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { filesApi } from "../services/api";

interface UploadFormData {
  file: FileList;
  retentionPeriod: number;
  building: string;
  room: string;
}

export function UploadPage() {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [generatedFileId, setGeneratedFileId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UploadFormData>();

  const onSubmit = async (data: UploadFormData) => {
    const file = data.file[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("retention_years", String(data.retentionPeriod));
      formData.append("building", data.building || "");
      formData.append("room", data.room || "");

      const { data: res } = await filesApi.upload(formData);
      if (res.success && res.data?.file) {
        setGeneratedFileId(res.data.file.file_id);
        setUploadSuccess(true);
        toast.success("File uploaded successfully!", {
          description: `File ID: ${res.data.file.file_id}`,
          duration: 5000,
        });
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Toaster />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-display text-primary">Upload File to Archive</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your document with retention and location details. Supports PDF, DOCX, XLSX, CSV, images, and more.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {uploadSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-green-600 mb-3">File Uploaded Successfully!</h3>
                <p className="text-lg text-foreground/80 mb-4">Your unique File ID has been generated:</p>
                <div className="inline-block bg-accent border-2 border-primary px-8 py-4 rounded-lg">
                  <code className="text-2xl font-bold text-primary">{generatedFileId}</code>
                </div>
                <p className="text-sm text-muted-foreground mt-6">Please save this ID for future reference</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    <Link to="/myfiles">
                      <FileText className="w-5 h-5 mr-2" />
                      View My Files
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      setUploadSuccess(false);
                      setSelectedFile(null);
                      reset();
                    }}
                    size="lg"
                    variant="outline"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Another File
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Select File *
                  </Label>
                  <div className="relative">
                    <Input
                      id="file"
                      type="file"
                      {...register("file", { required: "Please select a file to upload" })}
                      onChange={handleFileChange}
                      className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                    />
                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-accent rounded-lg flex items-center gap-3"
                      >
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  {errors.file && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.file.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Retention Period (years) *
                  </Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="e.g., 5"
                    {...register("retentionPeriod", {
                      required: "Retention period is required",
                      min: { value: 1, message: "At least 1 year" },
                    })}
                    className="bg-input-background"
                  />
                  {errors.retentionPeriod && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.retentionPeriod.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Building
                    </Label>
                    <Input
                      id="building"
                      placeholder="e.g., B1"
                      {...register("building")}
                      className="bg-input-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room" className="flex items-center gap-2">
                      <DoorOpen className="w-4 h-4" />
                      Room
                    </Label>
                    <Input
                      id="room"
                      placeholder="e.g., R3"
                      {...register("room")}
                      className="bg-input-background"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Information</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800">
                        <li>A unique File ID (ARC-YYYY-XXXXXX) will be generated upon upload</li>
                        <li>Supported: PDF, DOCX, XLSX, CSV, images, and more</li>
                        <li>Retention and expiry are calculated automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {uploading ? "Uploading..." : "Upload File to Archive"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-white/80 text-sm"
        >
          <p>Archive responsibly • Compliance matters</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
