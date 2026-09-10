import React, { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Opportunity {
  id: string;
  name: string;
  score: number;
  phase: string;
  value: string;
  readiness: string;
  description: string;
  createdAt: string;
}

interface WizardData {
  step1: {
    businessProblem: string;
    department: string;
    stakeholder: string;
    urgency: string;
    currentProcess: string;
    painPoints: string;
  };
  step2: {
    aiPattern: string;
    dataAvailability: string;
    integrationNeeds: string;
    humanInLoop: boolean;
    complianceReqs: string;
  };
  step3: {
    marketSize: string;
    competitors: string;
    differentiators: string;
    targetSegment: string;
    trendAlignment: string;
  };
  step4: {
    objectives: string;
    kpis: string;
    timeline: string;
    budget: string;
    risks: string;
    mitigations: string;
  };
  step5: {
    mvpScope: string;
    features: string;
    techStack: string;
    architecture: string;
    dataModel: string;
  };
  step6: {
    pilotScope: string;
    successCriteria: string;
    scalePlan: string;
    handoffChecklist: string;
    governanceModel: string;
  };
}

interface FeedbackData {
  rating: number;
  mostValuable: string;
  useAgain: string;
  suggestion: string;
}

// ─── Tooltip Component ──────────────────────────────────────────────────────
const Tooltip: React.FC<{
  text: string;
  children: React.ReactNode;
  dark: boolean;
}> = ({ text, children, dark }) => {
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: dark ? "#1e293b" : "#1f2937",
            color: "#f9fafb",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            whiteSpace: "pre-line",
            width: 220,
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            lineHeight: 1.5,
            border: `1px solid ${dark ? "#334155" : "#374151"}`,
          }}
        >
          {text}
          <span
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              border: "6px solid transparent",
              borderTopColor: dark ? "#1e293b" : "#1f2937",
            }}
          />
        </span>
      )}
    </span>
  );
};

// ─── Main App ────────────────────────────────────────────────────────────────
const AIOpportunityStudio: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [wizardStep, setWizardStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    "Executive Summary",
    "Business Case",
    "Architecture Blueprint",
    "Opportunity Canvas",
    "Pilot Plan",
    "Enterprise Handoff",
    "Leadership Deck",
  ]);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    rating: 0,
    mostValuable: "",
    useAgain: "",
    suggestion: "",
  });
  const [wizardData, setWizardData] = useState<WizardData>({
    step1: {
      businessProblem: "",
      department: "",
      stakeholder: "",
      urgency: "medium",
      currentProcess: "",
      painPoints: "",
    },
    step2: {
      aiPattern: "",
      dataAvailability: "",
      integrationNeeds: "",
      humanInLoop: true,
      complianceReqs: "",
    },
    step3: {
      marketSize: "",
      competitors: "",
      differentiators: "",
      targetSegment: "",
      trendAlignment: "",
    },
    step4: {
      objectives: "",
      kpis: "",
      timeline: "",
      budget: "",
      risks: "",
      mitigations: "",
    },
    step5: {
      mvpScope: "",
      features: "",
      techStack: "",
      architecture: "",
      dataModel: "",
    },
    step6: {
      pilotScope: "",
      successCriteria: "",
      scalePlan: "",
      handoffChecklist: "",
      governanceModel: "",
    },
  });

  const opportunities: Opportunity[] = [
    {
      id: "1",
      name: "Invoice Automation",
      score: 87,
      phase: "Pilot",
      value: "$4.3M",
      readiness: "Enterprise Ready",
      description: "Automate invoice generation and processing using AI agents",
      createdAt: "2025-01-15",
    },
    {
      id: "2",
      name: "Customer Onboarding AI",
      score: 92,
      phase: "Build",
      value: "$2.8M",
      readiness: "Design Complete",
      description: "AI-driven customer onboarding experience",
      createdAt: "2025-02-01",
    },
    {
      id: "3",
      name: "Predictive Maintenance",
      score: 78,
      phase: "Design",
      value: "$6.1M",
      readiness: "Qualified",
      description: "ML-based equipment failure prediction system",
      createdAt: "2025-02-20",
    },
    {
      id: "4",
      name: "Contract Analysis Agent",
      score: 95,
      phase: "Enterprise",
      value: "$3.5M",
      readiness: "Scaled",
      description: "NLP-powered contract review and risk assessment",
      createdAt: "2024-11-10",
    },
    {
      id: "5",
      name: "Supply Chain Optimizer",
      score: 71,
      phase: "Qualified",
      value: "$8.2M",
      readiness: "Assessed",
      description: "AI optimization for supply chain logistics",
      createdAt: "2025-03-05",
    },
    {
      id: "6",
      name: "HR Resume Screener",
      score: 83,
      phase: "Ideas",
      value: "$1.2M",
      readiness: "New",
      description: "Automated resume screening with bias detection",
      createdAt: "2025-03-18",
    },
  ];

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoSaveStatus("Saving...");
      setTimeout(() => setAutoSaveStatus("Saved ✓"), 800);
    }, 2000);
    return () => clearTimeout(timer);
  }, [wizardData]);

  const overallProgress = Math.round(((wizardStep - 1) / 6) * 100);

  // ─── Theme Colors ────────────────────────────────────────────────────────
  const theme = {
    bg: dark ? "#0f172a" : "#f8fafc",
    surface: dark ? "#1e293b" : "#ffffff",
    surfaceHover: dark ? "#253348" : "#f1f5f9",
    border: dark ? "#334155" : "#e2e8f0",
    text: dark ? "#f1f5f9" : "#1e293b",
    textSecondary: dark ? "#94a3b8" : "#64748b",
    textMuted: dark ? "#64748b" : "#94a3b8",
    primary: "#6366f1",
    primaryHover: "#818cf8",
    primaryLight: dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
    success: "#10b981",
    successLight: dark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.08)",
    warning: "#f59e0b",
    warningLight: dark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.08)",
    danger: "#ef4444",
    dangerLight: dark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.08)",
    accent: "#8b5cf6",
    accentLight: dark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.08)",
    sidebar: dark ? "#0f172a" : "#1e293b",
    sidebarText: "#cbd5e1",
    sidebarActive: "rgba(99,102,241,0.2)",
    cardShadow: dark
      ? "0 4px 24px rgba(0,0,0,0.4)"
      : "0 1px 3px rgba(0,0,0,0.08), 0 4px 24px rgba(0,0,0,0.04)",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  };

  // ─── Styles ────────────────────────────────────────────────────────────────
  const buttonStyle = (
    variant: "primary" | "secondary" | "ghost" | "danger" = "primary",
    size: "sm" | "md" | "lg" = "md"
  ): React.CSSProperties => ({
    padding:
      size === "sm" ? "6px 12px" : size === "lg" ? "12px 28px" : "8px 20px",
    borderRadius: 10,
    border:
      variant === "secondary"
        ? `1px solid ${theme.border}`
        : variant === "ghost"
        ? "1px solid transparent"
        : "none",
    background:
      variant === "primary"
        ? theme.gradient
        : variant === "danger"
        ? theme.danger
        : variant === "ghost"
        ? "transparent"
        : theme.surface,
    color:
      variant === "primary" || variant === "danger"
        ? "#ffffff"
        : theme.text,
    cursor: "pointer",
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.2s",
    letterSpacing: 0.2,
    fontFamily: "inherit",
  });

  const cardStyle: React.CSSProperties = {
    background: theme.surface,
    borderRadius: 16,
    padding: 24,
    border: `1px solid ${theme.border}`,
    boxShadow: theme.cardShadow,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    background: dark ? "#0f172a" : "#f8fafc",
    color: theme.text,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 80,
    resize: "vertical" as const,
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${
      dark ? "%2394a3b8" : "%2364748b"
    }' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 36,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: theme.text,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  // ─── Navigation Items ──────────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "wizard", icon: "➕", label: "New Opportunity" },
    { id: "opportunities", icon: "📁", label: "Opportunities" },
    { id: "leadership", icon: "📊", label: "Leadership View" },
    { id: "deliverables", icon: "📄", label: "Deliverables" },
    { id: "knowledge", icon: "📚", label: "Knowledge Library" },
    { id: "feedback", icon: "💬", label: "Feedback" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];

  const wizardSteps = [
    { num: 1, label: "Intake", icon: "📥" },
    { num: 2, label: "Alignment", icon: "🤖" },
    { num: 3, label: "Analysis", icon: "📊" },
    { num: 4, label: "Strategy", icon: "🎯" },
    { num: 5, label: "Product", icon: "🔧" },
    { num: 6, label: "Pilot", icon: "🚀" },
  ];

  // ─── Field Change Handler ──────────────────────────────────────────────────
  const handleFieldChange = useCallback(
    (step: keyof WizardData, field: string, value: string | boolean) => {
      setWizardData((prev) => ({
        ...prev,
        [step]: { ...prev[step], [field]: value },
      }));
    },
    []
  );

  // ─── Dashboard Stats ──────────────────────────────────────────────────────
  const dashboardStats = [
    {
      label: "Total Opportunities",
      value: "47",
      icon: "💡",
      change: "+12%",
      color: theme.primary,
      bg: theme.primaryLight,
    },
    {
      label: "Qualified",
      value: "28",
      icon: "✅",
      change: "+8%",
      color: theme.success,
      bg: theme.successLight,
    },
    {
      label: "Active Pilots",
      value: "12",
      icon: "🚀",
      change: "+23%",
      color: theme.accent,
      bg: theme.accentLight,
    },
    {
      label: "Enterprise Handoffs",
      value: "6",
      icon: "🏢",
      change: "+3",
      color: theme.warning,
      bg: theme.warningLight,
    },
    {
      label: "Estimated Savings",
      value: "$24.1M",
      icon: "💰",
      change: "+$5.2M",
      color: theme.success,
      bg: theme.successLight,
    },
    {
      label: "Cycle Time Reduction",
      value: "67%",
      icon: "⏱",
      change: "+12%",
      color: theme.primary,
      bg: theme.primaryLight,
    },
    {
      label: "Automation Rate",
      value: "78%",
      icon: "⚡",
      change: "+9%",
      color: theme.accent,
      bg: theme.accentLight,
    },
    {
      label: "ROI Pipeline",
      value: "$42M",
      icon: "📈",
      change: "+18%",
      color: theme.warning,
      bg: theme.warningLight,
    },
  ];

  // ─── Knowledge Library Data ────────────────────────────────────────────────
  const knowledgeCategories = [
    {
      title: "AI Patterns",
      icon: "🧠",
      items: [
        "Human-in-the-Loop Agent",
        "RAG Pipeline Pattern",
        "Multi-Agent Orchestration",
        "Agentic Workflow",
        "Supervised Classification",
      ],
      color: theme.primary,
    },
    {
      title: "Agent Templates",
      icon: "🤖",
      items: [
        "Customer Service Bot",
        "Document Processor",
        "Data Analyst Agent",
        "Code Review Assistant",
        "Research Summarizer",
      ],
      color: theme.accent,
    },
    {
      title: "Prompt Templates",
      icon: "📝",
      items: [
        "System Prompt Framework",
        "Chain-of-Thought Template",
        "Few-Shot Learning Setup",
        "Guardrails Template",
        "Evaluation Prompt",
      ],
      color: theme.success,
    },
    {
      title: "Past Projects",
      icon: "📂",
      items: [
        "Invoice Automation v2",
        "Claims Processing AI",
        "Chatbot for HR",
        "Supply Chain ML",
        "Fraud Detection System",
      ],
      color: theme.warning,
    },
    {
      title: "Architecture Examples",
      icon: "🏗",
      items: [
        "Event-Driven AI Pipeline",
        "Microservices + LLM",
        "Edge AI Deployment",
        "Hybrid Cloud AI",
        "Real-time Inference",
      ],
      color: theme.danger,
    },
    {
      title: "Pilot Playbooks",
      icon: "📋",
      items: [
        "4-Week Pilot Sprint",
        "A/B Testing Framework",
        "Stakeholder Alignment",
        "Success Metrics Guide",
        "Scale Decision Matrix",
      ],
      color: "#06b6d4",
    },
  ];

  // ─── Pipeline Phases ───────────────────────────────────────────────────────
  const pipelinePhases = [
    "Ideas",
    "Qualified",
    "Design",
    "Build",
    "Pilot",
    "Enterprise",
  ];

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      Ideas: "#94a3b8",
      Qualified: "#6366f1",
      Design: "#8b5cf6",
      Build: "#f59e0b",
      Pilot: "#06b6d4",
      Enterprise: "#10b981",
    };
    return colors[phase] || theme.textSecondary;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return theme.success;
    if (score >= 70) return theme.warning;
    return theme.danger;
  };

  // ─── AI Panel Data ─────────────────────────────────────────────────────────
  const aiRecommendations: Record<
    number,
    {
      pattern: string;
      confidence: number;
      mvp: string;
      timeToValue: string;
      tips: string[];
    }
  > = {
    1: {
      pattern: "Human-in-the-Loop Agent",
      confidence: 92,
      mvp: "Invoice Generation Assistant",
      timeToValue: "4 Weeks",
      tips: [
        "Focus on quantifiable pain points for stronger business cases",
        "Include cycle time and error rate in current process analysis",
        "Identify 3+ stakeholders for broader alignment",
      ],
    },
    2: {
      pattern: "RAG-Enhanced Workflow",
      confidence: 88,
      mvp: "Document Processing Pipeline",
      timeToValue: "6 Weeks",
      tips: [
        "Evaluate data quality before committing to a pattern",
        "Human-in-the-loop reduces risk for sensitive decisions",
        "Start with structured data for faster time-to-value",
      ],
    },
    3: {
      pattern: "Multi-Agent System",
      confidence: 85,
      mvp: "Competitive Intelligence Bot",
      timeToValue: "5 Weeks",
      tips: [
        "Cross-reference internal data with market trends",
        "TAM/SAM/SOM analysis strengthens the business case",
        "Identify regulatory constraints early",
      ],
    },
    4: {
      pattern: "Orchestrated AI Pipeline",
      confidence: 90,
      mvp: "Strategy Recommendation Engine",
      timeToValue: "8 Weeks",
      tips: [
        "Align KPIs with executive OKRs for sponsorship",
        "Build risk mitigations into the timeline, not after",
        "Use phased budgeting for stakeholder comfort",
      ],
    },
    5: {
      pattern: "Agentic Workflow",
      confidence: 87,
      mvp: "Feature Prioritization Agent",
      timeToValue: "3 Weeks",
      tips: [
        "Limit MVP to 3 core features for speed",
        "Use proven tech stacks unless the problem demands novelty",
        "Design data model for scale from day one",
      ],
    },
    6: {
      pattern: "Scalable AI Platform",
      confidence: 94,
      mvp: "Pilot Dashboard & Metrics",
      timeToValue: "2 Weeks",
      tips: [
        "Define clear success/failure criteria before launch",
        "Use pilot metrics to auto-generate the enterprise handoff doc",
        "Build governance into the CI/CD pipeline",
      ],
    },
  };

  // ─── Scoring Data ──────────────────────────────────────────────────────────
  const scoringCriteria = [
    { label: "Business Impact", weight: 30, score: 88, icon: "💼" },
    { label: "AI Feasibility", weight: 25, score: 91, icon: "🤖" },
    { label: "Time to Value", weight: 20, score: 85, icon: "⏱" },
    { label: "Scalability", weight: 15, score: 82, icon: "📈" },
    { label: "Reusability", weight: 10, score: 90, icon: "♻️" },
  ];

  const overallScore = Math.round(
    scoringCriteria.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0)
  );

  // ─── Export Handler ────────────────────────────────────────────────────────
  const handleExport = (format: string) => {
    setShowExportMenu(false);
    alert(
      `Exporting ${selectedDeliverables.length} deliverables as ${format}...\n\n${selectedDeliverables.join(
        "\n"
      )}`
    );
  };

  const toggleDeliverable = (name: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER SECTIONS
  // ═════════════════════════════════════════════════════════════════════════

  // ─── Top Bar ───────────────────────────────────────────────────────────────
  const renderTopBar = () => (
    <div
      style={{
        height: 64,
        background: theme.surface,
        borderBottom: `1px solid ${theme.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 16,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: dark
          ? "0 1px 3px rgba(0,0,0,0.3)"
          : "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        style={{
          background: "none",
          border: "none",
          color: theme.textSecondary,
          cursor: "pointer",
          fontSize: 20,
          padding: 4,
          display: "flex",
          fontFamily: "inherit",
        }}
      >
        ☰
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 700,
          fontSize: 16,
          color: theme.text,
          background: theme.gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          whiteSpace: "nowrap",
        }}
      >
        ✦ AI-Native Opportunity Studio
      </div>

      <div style={{ flex: 1, maxWidth: 400, margin: "0 20px" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              ...inputStyle,
              paddingLeft: 36,
              height: 38,
              borderRadius: 20,
              fontSize: 13,
            }}
          />
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: theme.textMuted,
            }}
          >
            🔍
          </span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {activePage === "wizard" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            color: theme.textSecondary,
          }}
        >
          <span>Progress:</span>
          <div
            style={{
              width: 120,
              height: 6,
              background: dark ? "#334155" : "#e2e8f0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${overallProgress}%`,
                height: "100%",
                background: theme.gradient,
                borderRadius: 3,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span style={{ fontWeight: 600 }}>{overallProgress}%</span>
          <span
            style={{
              fontSize: 11,
              color: theme.success,
              marginLeft: 4,
            }}
          >
            {autoSaveStatus}
          </span>
        </div>
      )}

      <Tooltip text="Toggle between dark and light theme" dark={dark}>
        <button
          onClick={() => setDark(!dark)}
          style={{
            background: dark ? "#334155" : "#f1f5f9",
            border: "none",
            borderRadius: 20,
            width: 44,
            height: 26,
            cursor: "pointer",
            position: "relative",
            transition: "background 0.3s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: dark ? 21 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: dark ? "#6366f1" : "#ffffff",
              transition: "left 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            {dark ? "🌙" : "☀️"}
          </span>
        </button>
      </Tooltip>

      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: theme.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        JD
      </div>
    </div>
  );

  // ─── Left Sidebar ──────────────────────────────────────────────────────────
  const renderSidebar = () => (
    <div
      style={{
        width: sidebarCollapsed ? 64 : 240,
        background: theme.sidebar,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "16px 12px", flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActivePage(item.id);
              if (item.id === "wizard") setWizardStep(1);
            }}
            style={{
              width: "100%",
              padding: sidebarCollapsed ? "12px 0" : "10px 14px",
              background:
                activePage === item.id ? theme.sidebarActive : "transparent",
              border: "none",
              borderRadius: 10,
              color:
                activePage === item.id ? "#818cf8" : theme.sidebarText,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 14,
              fontWeight: activePage === item.id ? 600 : 400,
              marginBottom: 4,
              transition: "all 0.2s",
              justifyContent: sidebarCollapsed ? "center" : "flex-start",
              fontFamily: "inherit",
              textAlign: "left",
              borderLeft:
                activePage === item.id
                  ? "3px solid #6366f1"
                  : "3px solid transparent",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {!sidebarCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {!sidebarCollapsed && (
        <div
          style={{
            padding: 16,
            borderTop: `1px solid ${dark ? "#1e293b" : "#334155"}`,
            fontSize: 11,
            color: theme.textMuted,
            textAlign: "center",
          }}
        >
          AI-Native Opportunity Studio
          <br />
          v2.0 — Enterprise Edition
        </div>
      )}
    </div>
  );

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: theme.text,
            marginBottom: 8,
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: theme.textSecondary, fontSize: 15 }}>
          Overview of your AI opportunity pipeline and key metrics
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              ...cardStyle,
              padding: 20,
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  marginBottom: 4,
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: theme.text,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: stat.color,
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Opportunities */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 16,
            }}
          >
            Recent Opportunities
          </h3>
          {opportunities.slice(0, 4).map((opp) => (
            <div
              key={opp.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: `1px solid ${theme.border}`,
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: getPhaseColor(opp.phase),
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    color: theme.text,
                    fontSize: 14,
                  }}
                >
                  {opp.name}
                </div>
                <div
                  style={{ fontSize: 12, color: theme.textSecondary }}
                >
                  {opp.description}
                </div>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: getScoreColor(opp.score),
                  background:
                    opp.score >= 85
                      ? theme.successLight
                      : opp.score >= 70
                      ? theme.warningLight
                      : theme.dangerLight,
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                {opp.score}
              </div>
              <span
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: theme.primaryLight,
                  color: theme.primary,
                  fontWeight: 600,
                }}
              >
                {opp.phase}
              </span>
            </div>
          ))}
        </div>

        {/* Scoring Summary */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 16,
            }}
          >
            Opportunity Scoring
          </h3>
          {scoringCriteria.map((c) => (
            <div key={c.label} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  fontSize: 13,
                }}
              >
                <span style={{ color: theme.text, fontWeight: 500 }}>
                  {c.icon} {c.label}{" "}
                  <span style={{ color: theme.textMuted }}>({c.weight}%)</span>
                </span>
                <span style={{ fontWeight: 700, color: theme.text }}>
                  {c.score}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: 6,
                  background: dark ? "#334155" : "#e2e8f0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${c.score}%`,
                    height: "100%",
                    background: getScoreColor(c.score),
                    borderRadius: 3,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          ))}
          <div
            style={{
              marginTop: 20,
              padding: 16,
              background: theme.successLight,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 4 }}
            >
              Overall Score
            </div>
            <div
              style={{ fontSize: 36, fontWeight: 800, color: theme.success }}
            >
              {overallScore}
              <span style={{ fontSize: 16 }}> / 100</span>
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: theme.success,
                marginTop: 4,
              }}
            >
              ✓ Proceed Immediately
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Wizard ────────────────────────────────────────────────────────────────
  const renderWizard = () => {
    const currentAI = aiRecommendations[wizardStep];

    const renderStepContent = () => {
      switch (wizardStep) {
        case 1:
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Business Problem
                  <Tooltip
                    text={
                      "Describe the current business pain,\nmanual effort, delays, defects,\nor customer impact."
                    }
                    dark={dark}
                  >
                    <span
                      style={{
                        cursor: "help",
                        background: theme.primaryLight,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: theme.primary,
                        fontWeight: 700,
                      }}
                    >
                      ?
                    </span>
                  </Tooltip>
                </label>
                <textarea
                  style={textareaStyle}
                  placeholder="Describe the business problem or opportunity..."
                  value={wizardData.step1.businessProblem}
                  onChange={(e) =>
                    handleFieldChange("step1", "businessProblem", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Department
                  <Tooltip text="Which department owns this problem?" dark={dark}>
                    <span
                      style={{
                        cursor: "help",
                        background: theme.primaryLight,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: theme.primary,
                        fontWeight: 700,
                      }}
                    >
                      ?
                    </span>
                  </Tooltip>
                </label>
                <select
                  style={selectStyle}
                  value={wizardData.step1.department}
                  onChange={(e) =>
                    handleFieldChange("step1", "department", e.target.value)
                  }
                >
                  <option value="">Select department...</option>
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>HR</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Legal</option>
                  <option>Customer Success</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Primary Stakeholder</label>
                <input
                  style={inputStyle}
                  placeholder="Name and role..."
                  value={wizardData.step1.stakeholder}
                  onChange={(e) =>
                    handleFieldChange("step1", "stakeholder", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Urgency
                  <Tooltip
                    text="How urgent is this problem?\nCritical: blocking revenue\nHigh: impacting SLA\nMedium: efficiency loss\nLow: nice to have"
                    dark={dark}
                  >
                    <span
                      style={{
                        cursor: "help",
                        background: theme.primaryLight,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: theme.primary,
                        fontWeight: 700,
                      }}
                    >
                      ?
                    </span>
                  </Tooltip>
                </label>
                <select
                  style={selectStyle}
                  value={wizardData.step1.urgency}
                  onChange={(e) =>
                    handleFieldChange("step1", "urgency", e.target.value)
                  }
                >
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Current Process</label>
                <textarea
                  style={textareaStyle}
                  placeholder="How is this handled today?"
                  value={wizardData.step1.currentProcess}
                  onChange={(e) =>
                    handleFieldChange("step1", "currentProcess", e.target.value)
                  }
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Key Pain Points</label>
                <textarea
                  style={textareaStyle}
                  placeholder="List the main pain points..."
                  value={wizardData.step1.painPoints}
                  onChange={(e) =>
                    handleFieldChange("step1", "painPoints", e.target.value)
                  }
                />
              </div>
            </div>
          );

        case 2:
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div>
                <label style={labelStyle}>
                  AI Pattern
                  <Tooltip
                    text="Select the AI design pattern\nthat best fits the problem.\nThe AI advisor will also suggest one."
                    dark={dark}
                  >
                    <span
                      style={{
                        cursor: "help",
                        background: theme.primaryLight,
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: theme.primary,
                        fontWeight: 700,
                      }}
                    >
                      ?
                    </span>
                  </Tooltip>
                </label>
                <select
                  style={selectStyle}
                  value={wizardData.step2.aiPattern}
                  onChange={(e) =>
                    handleFieldChange("step2", "aiPattern", e.target.value)
                  }
                >
                  <option value="">Select pattern...</option>
                  <option>Human-in-the-Loop Agent</option>
                  <option>RAG Pipeline</option>
                  <option>Multi-Agent Orchestration</option>
                  <option>Agentic Workflow</option>
                  <option>Supervised Classification</option>
                  <option>Conversational AI</option>
                  <option>Predictive Analytics</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Data Availability</label>
                <select
                  style={selectStyle}
                  value={wizardData.step2.dataAvailability}
                  onChange={(e) =>
                    handleFieldChange("step2", "dataAvailability", e.target.value)
                  }
                >
                  <option value="">Select...</option>
                  <option>Readily Available — Clean</option>
                  <option>Available — Needs Cleaning</option>
                  <option>Partially Available</option>
                  <option>Not Available — Needs Collection</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Integration Requirements</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Describe required system integrations..."
                  value={wizardData.step2.integrationNeeds}
                  onChange={(e) =>
                    handleFieldChange("step2", "integrationNeeds", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Human-in-the-Loop Required?</label>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      onClick={() =>
                        handleFieldChange("step2", "humanInLoop", val)
                      }
                      style={{
                        ...buttonStyle(
                          wizardData.step2.humanInLoop === val
                            ? "primary"
                            : "secondary",
                          "sm"
                        ),
                      }}
                    >
                      {val ? "✓ Yes" : "✗ No"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Compliance Requirements</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Any regulatory or compliance needs..."
                  value={wizardData.step2.complianceReqs}
                  onChange={(e) =>
                    handleFieldChange("step2", "complianceReqs", e.target.value)
                  }
                />
              </div>
            </div>
          );

        case 3:
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div>
                <label style={labelStyle}>Market Size (TAM)</label>
                <input
                  style={inputStyle}
                  placeholder="e.g., $2.5B addressable market"
                  value={wizardData.step3.marketSize}
                  onChange={(e) =>
                    handleFieldChange("step3", "marketSize", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Target Segment</label>
                <input
                  style={inputStyle}
                  placeholder="Primary customer segment..."
                  value={wizardData.step3.targetSegment}
                  onChange={(e) =>
                    handleFieldChange("step3", "targetSegment", e.target.value)
                  }
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Competitive Landscape</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Key competitors and their approaches..."
                  value={wizardData.step3.competitors}
                  onChange={(e) =>
                    handleFieldChange("step3", "competitors", e.target.value)
                  }
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Key Differentiators</label>
                <textarea
                  style={textareaStyle}
                  placeholder="What makes this opportunity unique?"
                  value={wizardData.step3.differentiators}
                  onChange={(e) =>
                    handleFieldChange("step3", "differentiators", e.target.value)
                  }
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Trend Alignment</label>
                <textarea
                  style={textareaStyle}
                  placeholder="How does this align with market trends?"
                  value={wizardData.step3.trendAlignment}
                  onChange={(e) =>
                    handleFieldChange("step3", "trendAlignment", e.target.value)
                  }
                />
              </div>
            </div>
          );

        case 4:
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Strategic Objectives</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Define 3-5 strategic objectives..."
                  value={wizardData.step4.objectives}
                  onChange={(e) =>
                    handleFieldChange("step4", "objectives", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Key Performance Indicators</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Define measurable KPIs..."
                  value={wizardData.step4.kpis}
                  onChange={(e) =>
                    handleFieldChange("step4", "kpis", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Timeline</label>
                <select
                  style={selectStyle}
                  value={wizardData.step4.timeline}
                  onChange={(e) =>
                    handleFieldChange("step4", "timeline", e.target.value)
                  }
                >
                  <option value="">Select timeline...</option>
                  <option>2-4 Weeks (Quick Win)</option>
                  <option>1-2 Months (Short-term)</option>
                  <option>3-6 Months (Medium-term)</option>
                  <option>6-12 Months (Long-term)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Budget Estimate</label>
                <input
                  style={inputStyle}
                  placeholder="Estimated budget range..."
                  value={wizardData.step4.budget}
                  onChange={(e) =>
                    handleFieldChange("step4", "budget", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Key Risks</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Identify potential risks..."
                  value={wizardData.step4.risks}
                  onChange={(e) =>
                    handleFieldChange("step4", "risks", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Risk Mitigations</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Mitigation strategies..."
                  value={wizardData.step4.mitigations}
                  onChange={(e) =>
                    handleFieldChange("step4", "mitigations", e.target.value)
                  }
                />
              </div>
            </div>
          );

        case 5:
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>MVP Scope</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Define the minimum viable product scope..."
                  value={wizardData.step5.mvpScope}
                  onChange={(e) =>
                    handleFieldChange("step5", "mvpScope", e.target.value)
                  }
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Core Features (Priority Order)</label>
                <textarea
                  style={{ ...textareaStyle, minHeight: 100 }}
                  placeholder="1. Feature one&#10;2. Feature two&#10;3. Feature three"
                  value={wizardData.step5.features}
                  onChange={(e) =>
                    handleFieldChange("step5", "features", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Tech Stack</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Recommended technologies..."
                  value={wizardData.step5.techStack}
                  onChange={(e) =>
                    handleFieldChange("step5", "techStack", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Architecture</label>
                <select
                  style={selectStyle}
                  value={wizardData.step5.architecture}
                  onChange={(e) =>
                    handleFieldChange("step5", "architecture", e.target.value)
                  }
                >
                  <option value="">Select architecture...</option>
                  <option>Event-Driven AI Pipeline</option>
                  <option>Microservices + LLM</option>
                  <option>Edge AI Deployment</option>
                  <option>Hybrid Cloud AI</option>
                  <option>Real-time Inference</option>
                  <option>Monolith with AI Module</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Data Model</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Key data entities and relationships..."
                  value={wizardData.step5.dataModel}
                  onChange={(e) =>
                    handleFieldChange("step5", "dataModel", e.target.value)
                  }
                />
              </div>
            </div>
          );

        case 6:
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Pilot Scope & Duration</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Define pilot boundaries, users, and duration..."
                  value={wizardData.step6.pilotScope}
                  onChange={(e) =>
                    handleFieldChange("step6", "pilotScope", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Success Criteria</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Measurable criteria for pilot success..."
                  value={wizardData.step6.successCriteria}
                  onChange={(e) =>
                    handleFieldChange("step6", "successCriteria", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Scale Plan</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Plan for scaling from pilot to enterprise..."
                  value={wizardData.step6.scalePlan}
                  onChange={(e) =>
                    handleFieldChange("step6", "scalePlan", e.target.value)
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Enterprise Handoff Checklist</label>
                <textarea
                  style={{ ...textareaStyle, minHeight: 100 }}
                  placeholder="☐ Documentation complete&#10;☐ Training materials ready&#10;☐ Support model defined&#10;☐ SLA established"
                  value={wizardData.step6.handoffChecklist}
                  onChange={(e) =>
                    handleFieldChange(
                      "step6",
                      "handoffChecklist",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>Governance Model</label>
                <textarea
                  style={textareaStyle}
                  placeholder="AI governance and oversight approach..."
                  value={wizardData.step6.governanceModel}
                  onChange={(e) =>
                    handleFieldChange("step6", "governanceModel", e.target.value)
                  }
                />
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div
        style={{
          padding: 32,
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 24,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Main Wizard Area */}
        <div>
          {/* Step Progress */}
          <div
            style={{
              ...cardStyle,
              padding: 20,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {wizardSteps.map((step, i) => (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => setWizardStep(step.num)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background:
                          wizardStep === step.num
                            ? theme.gradient
                            : wizardStep > step.num
                            ? theme.success
                            : dark
                            ? "#334155"
                            : "#e2e8f0",
                        color:
                          wizardStep >= step.num ? "#fff" : theme.textMuted,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        transition: "all 0.3s",
                        boxShadow:
                          wizardStep === step.num
                            ? "0 0 0 4px rgba(99,102,241,0.2)"
                            : "none",
                      }}
                    >
                      {wizardStep > step.num ? "✓" : step.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: wizardStep === step.num ? 700 : 500,
                        color:
                          wizardStep === step.num
                            ? theme.primary
                            : theme.textSecondary,
                      }}
                    >
                      {step.label}
                    </span>
                  </button>
                  {i < wizardSteps.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background:
                          wizardStep > step.num
                            ? theme.success
                            : dark
                            ? "#334155"
                            : "#e2e8f0",
                        margin: "0 4px",
                        marginBottom: 20,
                        transition: "background 0.3s",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: theme.text,
                    margin: 0,
                  }}
                >
                  Step {wizardStep}:{" "}
                  {wizardSteps[wizardStep - 1].label}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: theme.textSecondary,
                    margin: "4px 0 0",
                  }}
                >
                  Complete the fields below. AI recommendations appear on the
                  right.
                </p>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: theme.success,
                  fontWeight: 500,
                }}
              >
                💾 {autoSaveStatus}
              </span>
            </div>

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 32,
                paddingTop: 20,
                borderTop: `1px solid ${theme.border}`,
              }}
            >
              <button
                onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
                disabled={wizardStep === 1}
                style={{
                  ...buttonStyle("secondary"),
                  opacity: wizardStep === 1 ? 0.4 : 1,
                  cursor: wizardStep === 1 ? "not-allowed" : "pointer",
                }}
              >
                ← Previous
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={buttonStyle("ghost", "sm")}>
                  Save Draft
                </button>
                {wizardStep < 6 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep + 1)}
                    style={buttonStyle("primary")}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActivePage("deliverables");
                    }}
                    style={buttonStyle("primary", "lg")}
                  >
                    🚀 Generate Deliverables
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Advisor Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* AI Recommendations */}
          <div
            style={{
              ...cardStyle,
              background: dark
                ? "linear-gradient(135deg, #1e1b4b, #1e293b)"
                : "linear-gradient(135deg, #eef2ff, #f8fafc)",
              border: `1px solid ${dark ? "#312e81" : "#c7d2fe"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 20 }}>🤖</span>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: theme.text,
                  margin: 0,
                }}
              >
                AI Recommendations
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: theme.textSecondary,
                    marginBottom: 2,
                    fontWeight: 500,
                  }}
                >
                  Suggested Pattern
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: theme.primary,
                  }}
                >
                  {currentAI.pattern}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: theme.textSecondary,
                    marginBottom: 4,
                    fontWeight: 500,
                  }}
                >
                  Confidence
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: dark ? "#334155" : "#e2e8f0",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${currentAI.confidence}%`,
                        height: "100%",
                        background: theme.gradient,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: theme.text,
                    }}
                  >
                    {currentAI.confidence}%
                  </span>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: theme.textSecondary,
                    marginBottom: 2,
                    fontWeight: 500,
                  }}
                >
                  Recommended MVP
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme.text,
                  }}
                >
                  {currentAI.mvp}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: theme.textSecondary,
                    marginBottom: 2,
                    fontWeight: 500,
                  }}
                >
                  Expected Time-to-Value
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme.success,
                  }}
                >
                  ⚡ {currentAI.timeToValue}
                </div>
              </div>
            </div>
          </div>

          {/* AI Tips */}
          <div style={cardStyle}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 12,
              }}
            >
              💡 AI Tips for This Step
            </h4>
            {currentAI.tips.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 10,
                  fontSize: 12,
                  color: theme.textSecondary,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: theme.primary, flexShrink: 0 }}>•</span>
                {tip}
              </div>
            ))}
          </div>

          {/* Scoring Preview */}
          <div style={cardStyle}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 12,
              }}
            >
              📊 Live Scoring
            </h4>
            {scoringCriteria.map((c) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 8,
                  alignItems: "center",
                }}
              >
                <span style={{ color: theme.textSecondary }}>
                  {c.icon} {c.label} ({c.weight}%)
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: getScoreColor(c.score),
                  }}
                >
                  {c.score}
                </span>
              </div>
            ))}
            <div
              style={{
                borderTop: `1px solid ${theme.border}`,
                paddingTop: 10,
                marginTop: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: 13, fontWeight: 700, color: theme.text }}
              >
                Overall Score
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: getScoreColor(overallScore),
                }}
              >
                {overallScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Deliverables ──────────────────────────────────────────────────────────
  const renderDeliverables = () => {
    const deliverableItems = [
      { name: "Executive Summary", icon: "📋", status: "Ready" },
      { name: "Business Case", icon: "💼", status: "Ready" },
      { name: "Architecture Blueprint", icon: "🏗", status: "Ready" },
      { name: "Opportunity Canvas", icon: "🎨", status: "Ready" },
      { name: "Pilot Plan", icon: "🚀", status: "Ready" },
      { name: "Enterprise Handoff", icon: "🏢", status: "Draft" },
      { name: "Leadership Deck", icon: "📊", status: "Draft" },
    ];

    return (
      <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Deliverables Center
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: 15 }}>
            Generate and export standardized deliverables from your opportunity
            analysis
          </p>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: theme.text,
                margin: 0,
              }}
            >
              Select Deliverables
            </h3>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() =>
                  setSelectedDeliverables(deliverableItems.map((d) => d.name))
                }
                style={buttonStyle("ghost", "sm")}
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedDeliverables([])}
                style={buttonStyle("ghost", "sm")}
              >
                Clear
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {deliverableItems.map((item) => (
              <button
                key={item.name}
                onClick={() => toggleDeliverable(item.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `2px solid ${
                    selectedDeliverables.includes(item.name)
                      ? theme.primary
                      : theme.border
                  }`,
                  background: selectedDeliverables.includes(item.name)
                    ? theme.primaryLight
                    : "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "all 0.2s",
                  color: theme.text,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${
                      selectedDeliverables.includes(item.name)
                        ? theme.primary
                        : theme.border
                    }`,
                    background: selectedDeliverables.includes(item.name)
                      ? theme.primary
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {selectedDeliverables.includes(item.name) ? "✓" : ""}
                </span>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {item.name}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 12,
                    background:
                      item.status === "Ready"
                        ? theme.successLight
                        : theme.warningLight,
                    color:
                      item.status === "Ready" ? theme.success : theme.warning,
                    fontWeight: 600,
                  }}
                >
                  {item.status}
                </span>
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <div
            style={{
              borderTop: `1px solid ${theme.border}`,
              paddingTop: 20,
            }}
          >
            <h4
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: theme.text,
                marginBottom: 12,
              }}
            >
              Export Format
            </h4>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { format: "PDF", icon: "📕", color: "#ef4444" },
                { format: "DOCX", icon: "📘", color: "#3b82f6" },
                { format: "PPTX", icon: "📙", color: "#f59e0b" },
                { format: "JSON", icon: "📗", color: "#10b981" },
              ].map((exp) => (
                <button
                  key={exp.format}
                  onClick={() => handleExport(exp.format)}
                  style={{
                    ...buttonStyle("secondary", "md"),
                    minWidth: 140,
                    justifyContent: "center",
                  }}
                >
                  {exp.icon} Export {exp.format}
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: 12,
                color: theme.textSecondary,
                marginTop: 12,
              }}
            >
              {selectedDeliverables.length} deliverable
              {selectedDeliverables.length !== 1 ? "s" : ""} selected for export
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ─── Opportunities (Pipeline) ──────────────────────────────────────────────
  const renderOpportunities = () => {
    const filtered = opportunities.filter(
      (o) =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Opportunity Pipeline
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: 15 }}>
            Track and manage all AI opportunities across lifecycle stages
          </p>
        </div>

        {/* Pipeline View */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${pipelinePhases.length}, 1fr)`,
            gap: 12,
            marginBottom: 32,
          }}
        >
          {pipelinePhases.map((phase) => {
            const phaseOpps = filtered.filter((o) => o.phase === phase);
            return (
              <div key={phase}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: getPhaseColor(phase),
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: theme.text,
                    }}
                  >
                    {phase}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: theme.textMuted,
                      marginLeft: "auto",
                    }}
                  >
                    {phaseOpps.length}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minHeight: 200,
                  }}
                >
                  {phaseOpps.map((opp) => (
                    <div
                      key={opp.id}
                      style={{
                        ...cardStyle,
                        padding: 14,
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: theme.text,
                          marginBottom: 6,
                        }}
                      >
                        {opp.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: theme.textSecondary,
                          marginBottom: 8,
                          lineHeight: 1.4,
                        }}
                      >
                        {opp.description}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: getScoreColor(opp.score),
                          }}
                        >
                          Score: {opp.score}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: theme.success,
                          }}
                        >
                          {opp.value}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: theme.textMuted,
                          marginTop: 6,
                          padding: "3px 8px",
                          background: theme.primaryLight,
                          borderRadius: 8,
                          display: "inline-block",
                        }}
                      >
                        {opp.readiness}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ─── Leadership Dashboard ──────────────────────────────────────────────────
  const renderLeadership = () => (
    <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: theme.text,
            marginBottom: 8,
          }}
        >
          Leadership Dashboard
        </h1>
        <p style={{ color: theme.textSecondary, fontSize: 15 }}>
          Executive view of AI opportunity portfolio and strategic metrics
        </p>
      </div>

      {/* Executive KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: "Total Pipeline Value",
            value: "$42M",
            icon: "💰",
            trend: "+18% QoQ",
          },
          {
            label: "Active Opportunities",
            value: "47",
            icon: "📈",
            trend: "+12 this quarter",
          },
          {
            label: "Avg. Time to Pilot",
            value: "6.2 wks",
            icon: "⏱",
            trend: "-23% vs target",
          },
          {
            label: "Success Rate",
            value: "89%",
            icon: "🎯",
            trend: "+7% vs benchmark",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              ...cardStyle,
              textAlign: "center",
              padding: 24,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{kpi.icon}</div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: theme.text,
                marginBottom: 4,
              }}
            >
              {kpi.value}
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.textSecondary,
                marginBottom: 4,
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{
                fontSize: 12,
                color: theme.success,
                fontWeight: 600,
              }}
            >
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: theme.text,
            marginBottom: 20,
          }}
        >
          Pipeline Funnel
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {pipelinePhases.map((phase, i) => {
            const count = opportunities.filter(
              (o) => o.phase === phase
            ).length;
            const widthPercent = 100 - i * 12;
            return (
              <div
                key={phase}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: `${widthPercent}%`,
                    height: 48,
                    background: getPhaseColor(phase),
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 18,
                    opacity: 0.9,
                  }}
                >
                  {count}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: theme.textSecondary,
                    marginTop: 6,
                    fontWeight: 600,
                  }}
                >
                  {phase}
                </span>
                {i < pipelinePhases.length - 1 && (
                  <span
                    style={{
                      position: "absolute",
                      color: theme.textMuted,
                      fontSize: 16,
                    }}
                  >
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Opportunities Table */}
      <div style={cardStyle}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: theme.text,
            marginBottom: 16,
          }}
        >
          Top Opportunities
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {[
                  "Opportunity",
                  "Score",
                  "Phase",
                  "Value",
                  "Readiness",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderBottom: `2px solid ${theme.border}`,
                      color: theme.textSecondary,
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...opportunities]
                .sort((a, b) => b.score - a.score)
                .map((opp) => (
                  <tr
                    key={opp.id}
                    style={{
                      borderBottom: `1px solid ${theme.border}`,
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: 600,
                        color: theme.text,
                      }}
                    >
                      {opp.name}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: getScoreColor(opp.score),
                          background:
                            opp.score >= 85
                              ? theme.successLight
                              : opp.score >= 70
                              ? theme.warningLight
                              : theme.dangerLight,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                        }}
                      >
                        {opp.score}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          color: theme.text,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: getPhaseColor(opp.phase),
                          }}
                        />
                        {opp.phase}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        fontWeight: 600,
                        color: theme.success,
                      }}
                    >
                      {opp.value}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: theme.primaryLight,
                          color: theme.primary,
                          fontWeight: 600,
                        }}
                      >
                        {opp.readiness}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─── Knowledge Library ─────────────────────────────────────────────────────
  const renderKnowledge = () => (
    <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: theme.text,
            marginBottom: 8,
          }}
        >
          Knowledge Library
        </h1>
        <p style={{ color: theme.textSecondary, fontSize: 15 }}>
          Reusable patterns, templates, and resources for AI opportunity
          development
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {knowledgeCategories.map((cat) => (
          <div key={cat.title} style={cardStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 24 }}>{cat.icon}</span>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: theme.text,
                  margin: 0,
                }}
              >
                {cat.title}
              </h3>
              <span
                style={{
                  fontSize: 11,
                  background: theme.primaryLight,
                  color: theme.primary,
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontWeight: 600,
                  marginLeft: "auto",
                }}
              >
                {cat.items.length}
              </span>
            </div>
            {cat.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "background 0.2s",
                  marginBottom: 2,
                  fontSize: 13,
                  color: theme.text,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    theme.surfaceHover)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                <span style={{ color: cat.color, fontSize: 8 }}>●</span>
                {item}
                <span
                  style={{
                    marginLeft: "auto",
                    color: theme.textMuted,
                    fontSize: 14,
                  }}
                >
                  →
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Feedback ──────────────────────────────────────────────────────────────
  const renderFeedback = () => {
    if (feedbackSubmitted) {
      return (
        <div
          style={{
            padding: 32,
            maxWidth: 600,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...cardStyle,
              padding: 48,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: theme.text,
                marginBottom: 8,
              }}
            >
              Thank You!
            </h2>
            <p style={{ color: theme.textSecondary, fontSize: 15 }}>
              Your feedback helps us improve the AI-Native Opportunity Studio.
            </p>
            <button
              onClick={() => {
                setFeedbackSubmitted(false);
                setFeedbackData({
                  rating: 0,
                  mostValuable: "",
                  useAgain: "",
                  suggestion: "",
                });
              }}
              style={{ ...buttonStyle("secondary"), marginTop: 20 }}
            >
              Submit Another
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: theme.text,
              marginBottom: 8,
            }}
          >
            Feedback
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: 15 }}>
            Takes less than 20 seconds. Help us make this better!
          </p>
        </div>

        <div style={cardStyle}>
          {/* Star Rating */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>
              Rate your experience
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setFeedbackData({ ...feedbackData, rating: star })
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 32,
                    transition: "transform 0.2s",
                    transform:
                      feedbackData.rating >= star ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {feedbackData.rating >= star ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          </div>

          {/* Most Valuable */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>
              Most valuable?
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {["Guidance", "Architecture", "AI Suggestions", "Deliverables"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setFeedbackData({
                        ...feedbackData,
                        mostValuable: opt,
                      })
                    }
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: `2px solid ${
                        feedbackData.mostValuable === opt
                          ? theme.primary
                          : theme.border
                      }`,
                      background:
                        feedbackData.mostValuable === opt
                          ? theme.primaryLight
                          : "transparent",
                      color: theme.text,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: feedbackData.mostValuable === opt ? 600 : 400,
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `2px solid ${
                          feedbackData.mostValuable === opt
                            ? theme.primary
                            : theme.border
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {feedbackData.mostValuable === opt && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: theme.primary,
                          }}
                        />
                      )}
                    </span>
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Use Again */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>
              Would you use again?
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setFeedbackData({ ...feedbackData, useAgain: opt })
                  }
                  style={{
                    ...buttonStyle(
                      feedbackData.useAgain === opt ? "primary" : "secondary"
                    ),
                    minWidth: 80,
                    justifyContent: "center",
                  }}
                >
                  {opt === "Yes" ? "👍" : "👎"} {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Suggestion */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Suggestion (Optional)</label>
            <textarea
              style={textareaStyle}
              placeholder="Any ideas to make this better?"
              value={feedbackData.suggestion}
              onChange={(e) =>
                setFeedbackData({
                  ...feedbackData,
                  suggestion: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={() => setFeedbackSubmitted(true)}
            style={{
              ...buttonStyle("primary", "lg"),
              width: "100%",
              justifyContent: "center",
            }}
          >
            Submit Feedback →
          </button>
        </div>
      </div>
    );
  };

  // ─── Settings ──────────────────────────────────────────────────────────────
  const renderSettings = () => (
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: theme.text,
            marginBottom: 8,
          }}
        >
          Settings
        </h1>
        <p style={{ color: theme.textSecondary, fontSize: 15 }}>
          Customize your AI-Native Opportunity Studio experience
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Appearance */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 16,
            }}
          >
            🎨 Appearance
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            <div>
              <div
                style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}
              >
                Dark Mode
              </div>
              <div style={{ fontSize: 12, color: theme.textSecondary }}>
                Switch between light and dark themes
              </div>
            </div>
            <button
              onClick={() => setDark(!dark)}
              style={{
                background: dark ? "#6366f1" : "#e2e8f0",
                border: "none",
                borderRadius: 20,
                width: 48,
                height: 28,
                cursor: "pointer",
                position: "relative",
                transition: "background 0.3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: dark ? 23 : 3,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.3s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
            }}
          >
            <div>
              <div
                style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}
              >
                Compact Sidebar
              </div>
              <div style={{ fontSize: 12, color: theme.textSecondary }}>
                Collapse the sidebar to icons only
              </div>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: sidebarCollapsed ? "#6366f1" : "#e2e8f0",
                border: "none",
                borderRadius: 20,
                width: 48,
                height: 28,
                cursor: "pointer",
                position: "relative",
                transition: "background 0.3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: sidebarCollapsed ? 23 : 3,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.3s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 16,
            }}
          >
            🔔 Notifications
          </h3>
          {[
            "Email notifications for opportunity updates",
            "AI recommendation alerts",
            "Pipeline stage change notifications",
            "Weekly summary reports",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom:
                  i < 3 ? `1px solid ${theme.border}` : "none",
              }}
            >
              <span style={{ fontSize: 13, color: theme.text }}>{item}</span>
              <div
                style={{
                  background: "#6366f1",
                  border: "none",
                  borderRadius: 20,
                  width: 48,
                  height: 28,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: 23,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* About */}
        <div
          style={{
            ...cardStyle,
            background: dark
              ? "linear-gradient(135deg, #1e1b4b, #1e293b)"
              : "linear-gradient(135deg, #eef2ff, #faf5ff)",
            border: `1px solid ${dark ? "#312e81" : "#c7d2fe"}`,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 12,
            }}
          >
            ✦ About
          </h3>
          <p
            style={{
              fontSize: 13,
              color: theme.textSecondary,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            <strong style={{ color: theme.text }}>
              AI-Native Opportunity Studio
            </strong>{" "}
            is a productization operating system that guides teams from idea
            intake through AI-native design, MVP creation, pilot execution, and
            enterprise handoff — while automatically generating standardized
            deliverables and governance artifacts.
          </p>
          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: theme.textMuted,
            }}
          >
            Version 2.0 · Enterprise Edition · Built with React
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Page Router ───────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();
      case "wizard":
        return renderWizard();
      case "opportunities":
        return renderOpportunities();
      case "leadership":
        return renderLeadership();
      case "deliverables":
        return renderDeliverables();
      case "knowledge":
        return renderKnowledge();
      case "feedback":
        return renderFeedback();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        background: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {renderTopBar()}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {renderSidebar()}
        <main
          style={{
            flex: 1,
            overflow: "auto",
            height: "calc(100vh - 64px)",
          }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AIOpportunityStudio;