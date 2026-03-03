import { motion } from "motion/react";
import { useState } from "react";
import {
  Shield,
  Database,
  Thermometer,
  Users,
  Lock,
  FileCheck,
  Clipboard,
  AlertTriangle,
  Building2,
  UserCheck,
  Cloud,
  GraduationCap,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
  Clock,
  Archive,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

interface ComplianceSection {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  items: string[];
  status: "compliant" | "warning" | "action-required";
}

export function SystemOverviewPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const complianceSections: ComplianceSection[] = [
    {
      id: "security",
      title: "Security Assurance",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      description: "Comprehensive security measures to protect archived materials",
      status: "compliant",
      items: [
        "Multi-factor authentication for system access",
        "Role-based access control (RBAC) implementation",
        "Encrypted file storage and transmission (AES-256)",
        "Regular security audits and vulnerability assessments",
        "Intrusion detection and prevention systems",
        "Secure backup and disaster recovery protocols",
        "Physical security measures for archive facilities",
        "Video surveillance and access logging",
        "Firewall and network security configurations",
        "Regular security training for all staff members",
      ],
    },
    {
      id: "indexing",
      title: "Indexing Procedures",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      description: "Systematic indexing of physical and electronic records",
      status: "compliant",
      items: [
        "Unique File ID generation (ARC-YYYY-XXXXXX format)",
        "Metadata capture: filename, size, type, upload date",
        "Location tracking (Building and Room information)",
        "Retention period and expiry date calculation",
        "Status tracking (Active, Expiring Soon, Expired)",
        "Full-text search capability for electronic records",
        "Barcode/QR code labeling for physical materials",
        "Cross-referencing with study protocols and documents",
        "Batch indexing for bulk uploads",
        "Automated index updates and synchronization",
        "Version control for document revisions",
        "Taxonomy and classification system implementation",
      ],
    },
    {
      id: "storage",
      title: "Storage Conditions",
      icon: Thermometer,
      color: "from-orange-500 to-red-500",
      description: "Optimal environmental conditions for material preservation",
      status: "compliant",
      items: [
        "Temperature control: 20-25°C (68-77°F)",
        "Humidity control: 30-50% relative humidity",
        "24/7 environmental monitoring systems",
        "Automated alerts for condition deviations",
        "Fire suppression systems (FM-200 or equivalent)",
        "Water detection and protection systems",
        "Pest control and prevention measures",
        "UV light protection for sensitive materials",
        "Air quality monitoring and filtration",
        "Separate storage for different material types",
        "Climate-controlled cold storage for biological samples",
        "Backup power systems (UPS and generators)",
      ],
    },
    {
      id: "receipt",
      title: "Receipt Procedures",
      icon: Clipboard,
      color: "from-green-500 to-emerald-500",
      description: "Standardized procedures for accepting materials into archive",
      status: "compliant",
      items: [
        "Chain of custody documentation",
        "Receipt acknowledgment and tracking",
        "Material inspection and condition assessment",
        "Verification of metadata and documentation",
        "Quality control checks for completeness",
        "Digital signature and timestamp capture",
        "Automated email notifications to stakeholders",
        "Receipt reconciliation with expected deliveries",
        "Quarantine procedures for incomplete submissions",
        "Integration with study management systems",
        "Photo documentation of physical materials",
        "Receipt barcode scanning and logging",
      ],
    },
    {
      id: "access",
      title: "Access, Removal & Return",
      icon: Lock,
      color: "from-indigo-500 to-purple-500",
      description: "Controlled access and material handling procedures",
      status: "compliant",
      items: [
        "Access request approval workflow",
        "Authorized personnel list maintenance",
        "Check-out and check-in procedures",
        "Material removal authorization forms",
        "Temporary vs. permanent removal tracking",
        "Time-limited access with auto-expiration",
        "Audit trail of all access events",
        "Material return verification and inspection",
        "Overdue material tracking and reminders",
        "Emergency access procedures",
        "Remote access controls for electronic records",
        "Material loan agreements for third parties",
      ],
    },
    {
      id: "responsibilities",
      title: "Staff Responsibilities",
      icon: Users,
      color: "from-cyan-500 to-blue-500",
      description: "Clear definition of roles and responsibilities",
      status: "compliant",
      items: [
        "Archivist: Overall archive management and compliance",
        "Records Manager: Daily operations and material handling",
        "IT Administrator: System maintenance and security",
        "Quality Assurance: Audit and compliance verification",
        "Training Coordinator: Staff training and certification",
        "Backup Archivist: Coverage during absences",
        "Document Controller: Metadata and indexing accuracy",
        "Facility Manager: Environmental monitoring and maintenance",
        "Security Officer: Access control and surveillance",
        "Disaster Recovery Coordinator: Business continuity planning",
      ],
    },
    {
      id: "facility-security",
      title: "Archive Facility Security",
      icon: Building2,
      color: "from-red-500 to-orange-500",
      description: "Physical and digital security of archive facilities",
      status: "compliant",
      items: [
        "Restricted access zones with badge control",
        "24/7 security monitoring and alarm systems",
        "Visitor registration and escort requirements",
        "Separate secure areas for high-value materials",
        "Reinforced walls and secured entry points",
        "Monitored CCTV coverage of all archive areas",
        "Regular security drills and exercises",
        "Cyber security measures for network access",
        "Secure disposal of decommissioned materials",
        "Off-site backup storage in secure location",
        "Clean desk and clear screen policies",
        "Anti-theft measures and inventory controls",
      ],
    },
    {
      id: "climate",
      title: "Climate Control Systems",
      icon: Cloud,
      color: "from-teal-500 to-green-500",
      description: "Advanced climate monitoring and control",
      status: "compliant",
      items: [
        "HVAC systems with redundancy",
        "Real-time temperature and humidity sensors",
        "Automated climate adjustment systems",
        "Data logging for regulatory compliance",
        "Monthly calibration of monitoring equipment",
        "Alert systems for out-of-range conditions",
        "Emergency climate control procedures",
        "Backup cooling systems for critical areas",
        "Humidity dehumidification equipment",
        "Air circulation and ventilation systems",
        "Integration with building management systems",
        "Quarterly climate control system audits",
      ],
    },
    {
      id: "disposal",
      title: "Disposal Procedures",
      icon: AlertTriangle,
      color: "from-yellow-500 to-orange-500",
      description: "Secure and compliant material disposal processes",
      status: "compliant",
      items: [
        "Retention period expiry notification system",
        "Disposal authorization and approval workflow",
        "Certificate of destruction issuance",
        "Secure shredding for paper documents",
        "Certified data wiping for electronic media",
        "Physical destruction of storage media",
        "Photo/video documentation of disposal",
        "Third-party disposal service verification",
        "Regulatory compliance verification",
        "Disposal records retention (permanent)",
        "Sponsor notification for study materials",
        "Environmental disposal considerations",
      ],
    },
    {
      id: "contract",
      title: "Contract Archiving Services",
      icon: FileCheck,
      color: "from-pink-500 to-red-500",
      description: "Third-party archiving service management",
      status: "warning",
      items: [
        "Vendor qualification and selection process",
        "Service level agreements (SLAs)",
        "Quality agreements and audits",
        "Data protection and confidentiality agreements",
        "Transfer protocols and chain of custody",
        "Regular vendor performance reviews",
        "Compliance verification and inspections",
        "Incident reporting and resolution procedures",
        "Contract renewal and termination procedures",
        "Material retrieval and return procedures",
        "Cost tracking and invoice reconciliation",
        "Backup vendor identification",
      ],
    },
    {
      id: "transfer",
      title: "Transfer to Sponsors/Third Parties",
      icon: Archive,
      color: "from-violet-500 to-purple-500",
      description: "Procedures for transferring materials to external parties",
      status: "compliant",
      items: [
        "Transfer authorization and approval process",
        "Material inventory and verification",
        "Transfer agreements and documentation",
        "Secure packaging and transportation",
        "Chain of custody maintenance",
        "Receipt confirmation from receiving party",
        "Transfer records retention",
        "Insurance and liability considerations",
        "Data format conversion if needed",
        "Compliance with export regulations",
        "Post-transfer audit and verification",
        "Material return arrangements if applicable",
      ],
    },
    {
      id: "disaster-recovery",
      title: "Disaster Recovery & Business Continuity",
      icon: AlertTriangle,
      color: "from-red-600 to-orange-600",
      description: "Comprehensive disaster preparedness and recovery plans",
      status: "compliant",
      items: [
        "Business continuity plan (BCP) documentation",
        "Disaster recovery plan (DRP) with RTO/RPO",
        "Off-site backup storage facilities",
        "Automated daily backups (3-2-1 strategy)",
        "Regular backup restoration testing",
        "Emergency response team and contacts",
        "Evacuation procedures and training",
        "Data recovery procedures and timelines",
        "Alternative site identification and agreements",
        "Critical material prioritization",
        "Insurance coverage verification",
        "Annual disaster recovery drills",
        "Incident response and communication plans",
        "Post-incident review and improvement",
      ],
    },
    {
      id: "training",
      title: "Training Requirements",
      icon: GraduationCap,
      color: "from-blue-600 to-indigo-600",
      description: "Comprehensive training programs for archive staff",
      status: "compliant",
      items: [
        "New employee onboarding (40 hours minimum)",
        "Archive principles and regulations training",
        "Archive management best practices",
        "System operation and software training",
        "Security and access control procedures",
        "Emergency response and safety training",
        "Data integrity and audit trail principles",
        "Annual refresher training (8 hours minimum)",
        "Specialized training for new technologies",
        "Training records maintenance and verification",
        "Competency assessments and certifications",
        "External training and conferences",
        "Standard operating procedure (SOP) training",
        "Continuing education requirements",
      ],
    },
    {
      id: "archiving-frequency",
      title: "Archiving Frequency",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
      description: "Scheduled archiving procedures and timelines",
      status: "compliant",
      items: [
        "Real-time archiving for critical electronic records",
        "Daily archiving of completed documentation",
        "Weekly backup verification and testing",
        "Monthly non-study materials archiving",
        "Quarterly archive integrity checks",
        "Semi-annual comprehensive audits",
        "Annual archive facility inspections",
        "Event-triggered archiving (study completion, etc.)",
        "Automated scheduling and reminders",
        "Archiving performance metrics and KPIs",
        "Continuous improvement of archiving processes",
        "Compliance with regulatory timelines",
      ],
    },
    {
      id: "electronic-refresh",
      title: "Electronic Records Refreshing",
      icon: RefreshCw,
      color: "from-green-600 to-cyan-600",
      description: "Periodic refreshing to prevent data degradation",
      status: "compliant",
      items: [
        "Media migration every 5-7 years",
        "Format conversion for obsolete file types",
        "Storage media integrity testing",
        "Checksum verification and validation",
        "Metadata preservation during migration",
        "Technology refresh planning and budgeting",
        "Legacy system access maintenance",
        "Emulation or virtualization strategies",
        "Data quality assessment post-refresh",
        "Documentation of refresh activities",
        "Validation of refreshed data integrity",
        "Regulatory notification of major migrations",
        "Backup retention during refresh process",
        "User access continuity during migration",
      ],
    },
  ];

  const getStatusBadge = (status: ComplianceSection["status"]) => {
    switch (status) {
      case "compliant":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Compliant
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Review Needed
          </Badge>
        );
      case "action-required":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Action Required
          </Badge>
        );
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleDownloadReport = () => {
    // Generate compliance report
    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let reportContent = `SYSTEM OVERVIEW REPORT\n`;
    reportContent += `Generated: ${reportDate}\n`;
    reportContent += `Overall Compliance Score: ${compliancePercentage}%\n\n`;
    reportContent += `COMPLIANCE SUMMARY\n`;
    reportContent += `${"=".repeat(50)}\n`;
    reportContent += `Total Sections: ${totalSections}\n`;
    reportContent += `Compliant: ${compliantSections}\n`;
    reportContent += `Review Needed: ${warningSection}\n`;
    reportContent += `Action Required: ${actionRequiredSections}\n\n`;

    complianceSections.forEach((section, index) => {
      reportContent += `\n${index + 1}. ${section.title.toUpperCase()}\n`;
      reportContent += `${"-".repeat(50)}\n`;
      reportContent += `Status: ${section.status.toUpperCase()}\n`;
      reportContent += `Description: ${section.description}\n\n`;
      reportContent += `Requirements:\n`;
      section.items.forEach((item, idx) => {
        reportContent += `  ${idx + 1}. ${item}\n`;
      });
      reportContent += `\n`;
    });

    reportContent += `\n${"=".repeat(50)}\n`;
    reportContent += `End of Report\n`;
    reportContent += `© ${new Date().getFullYear()} Universal Archive Management System\n`;

    // Create and download the file
    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `System_Overview_Report_${new Date().toISOString().split("T")[0]}.txt`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Compliance report downloaded successfully!", {
      description: "Check your downloads folder",
    });
  };

  const handleRequestAudit = () => {
    toast.success("Audit request submitted!", {
      description:
        "Your Quality Assurance team will be notified and will contact you within 24 hours.",
      duration: 5000,
    });
  };

  // Calculate compliance statistics
  const totalSections = complianceSections.length;
  const compliantSections = complianceSections.filter((s) => s.status === "compliant").length;
  const warningSection = complianceSections.filter((s) => s.status === "warning").length;
  const actionRequiredSections = complianceSections.filter((s) => s.status === "action-required").length;
  const compliancePercentage = Math.round((compliantSections / totalSections) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                System Overview
              </h1>
              <p className="text-white/80 text-lg">
                Comprehensive archive compliance tracking and management system
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compliant</p>
                    <p className="text-2xl font-bold text-green-600">{compliantSections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Review Needed</p>
                    <p className="text-2xl font-bold text-yellow-600">{warningSection}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Action Required</p>
                    <p className="text-2xl font-bold text-red-600">{actionRequiredSections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className="text-2xl font-bold text-blue-600">{compliancePercentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Compliance Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-2xl">Compliance Requirements & Procedures</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Click on any section to view detailed compliance requirements and procedures
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {complianceSections.map((section, index) => {
                  const Icon = section.icon;
                  const isExpanded = expandedSection === section.id;

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-accent/30 to-accent/10 hover:from-accent/50 hover:to-accent/20 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-lg text-foreground">
                                {section.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {section.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(section.status)}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-6 border-t border-border"
                          >
                            <ul className="grid md:grid-cols-2 gap-3">
                              {section.items.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 p-2 rounded hover:bg-accent/30 transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-foreground">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Need to update compliance procedures?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Contact your Quality Assurance team or System Administrator for assistance
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="bg-white"
                    onClick={handleDownloadReport}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" onClick={handleRequestAudit}>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Request Audit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Toaster />
    </div>
  );
}