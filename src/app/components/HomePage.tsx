import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Upload,
  Search,
  Fingerprint,
  FolderTree,
  HourglassIcon,
  Crosshair,
  Clock,
  ClipboardList,
  Database,
  Info,
  Workflow,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function HomePage() {
  const workflowSteps = [
    {
      icon: Upload,
      text: "Upload a file with retention details",
      color: "text-blue-400",
    },
    {
      icon: Fingerprint,
      text: "System generates a unique File ID",
      color: "text-purple-400",
    },
    {
      icon: FolderTree,
      text: "File is stored with mapped location",
      color: "text-green-400",
    },
    {
      icon: HourglassIcon,
      text: "Retention period is tracked automatically",
      color: "text-orange-400",
    },
    {
      icon: Search,
      text: "File can be retrieved using File ID",
      color: "text-pink-400",
    },
  ];

  const features = [
    {
      icon: Crosshair,
      title: "Accurate Retrieval",
      description: "Instant access using structured identifiers.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Retention Tracking",
      description: "Automated lifecycle and expiry control.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: ClipboardList,
      title: "Audit Ready",
      description: "Complete traceability with logs and timestamps.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Database,
      title: "Structured Storage",
      description: "Digital and physical archive mapping.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Shield,
      title: "System Overview",
      description: "Full system compliance and overview.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: LayoutDashboard,
      title: "Real-Time Dashboard",
      description: "Live statistics and monitoring.",
      gradient: "from-teal-500 to-green-500",
    },
  ];

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-2xl">
              <Database className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
            Universal Archive Management
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Secure • Traceable • Retention Controlled
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            A secure and structured archival platform designed to manage files
            using unique identification, retention tracking, and audit-ready
            metadata.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mt-10"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 py-6"
            >
              <Link to="/upload">
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="!border-2 !border-white !text-white bg-white/5 hover:!bg-white/20 text-lg px-8 py-6 font-semibold shadow-lg"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                View Dashboard
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="!border-2 !border-white !text-white bg-white/5 hover:!bg-white/20 text-lg px-8 py-6 font-semibold shadow-lg"
            >
              <Link to="/search">
                <Search className="w-5 h-5 mr-2" />
                Search Archive
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 mb-20"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold text-primary">
                  About the System
                </h2>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                A secure and structured archival platform designed to manage
                files using unique identification, retention tracking, and
                audit-ready metadata.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Unique File ID generation",
                  "Exact file location tracking",
                  "Retention & expiry management",
                  "Audit-ready design",
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-medium text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Workflow Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-4 mb-20"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-8">
                <Workflow className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-display font-bold text-primary">
                  How the System Works
                </h2>
              </div>

              <div className="space-y-4">
                {workflowSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent/30 to-transparent rounded-lg hover:from-accent/50 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg font-medium text-foreground">
                        {step.text}
                      </span>
                      {idx < workflowSteps.length - 1 && (
                        <div className="hidden md:block ml-auto text-secondary">
                          →
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-display font-bold text-white text-center mb-12"
        >
          Key Features
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-transparent hover:border-t-primary">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-display font-bold text-primary mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-foreground/70">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 text-center"
      >
        <Card className="bg-gradient-to-br from-primary to-secondary text-white shadow-2xl">
          <CardContent className="p-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Upload your files securely or search through your archive with
              ease.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/upload">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 py-6"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload File
                </Button>
              </Link>

              <Link to="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="!border-2 !border-white !text-white bg-white/10 hover:!bg-white/25 text-lg px-8 py-6 font-semibold shadow-lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Archive
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}