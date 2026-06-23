"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { SimpleIcon } from "simple-icons";
import {
  siAmd,
  siApacheflink,
  siApachespark,
  siClaude,
  siDatabricks,
  siDeepseek,
  siDocker,
  siGooglegemini,
  siGooglecloud,
  siKubernetes,
  siLangchain,
  siMeta,
  siMistralai,
  siModal,
  siMoonshotai,
  siN8n,
  siNvidia,
  siOllama,
  siPostgresql,
  siQdrant,
  siQwen,
  siSnowflake,
  siWeightsandbiases,
} from "simple-icons";

const navLinks = [
  ["What we build", "#solutions"],
  ["How we work", "#work"],
  ["Stack", "#stack"],
  ["What you get", "#deliverables"],
] as const;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const logoPath = `${basePath}/newlogo.png`;

const cloudModels = [
  "Claude",
  "OpenAI GPT",
  "Google Gemini",
  "Llama",
  "Mistral",
  "Qwen",
];

const solutions = [
  [
    "RAG & knowledge assistants",
    "Answer engines grounded in your own docs and data — accurate and citable.",
  ],
  [
    "AI agents & automation",
    "Agents that take real actions across your tools and run multi-step workflows.",
  ],
  [
    "Chatbots & support AI",
    "Customer-facing assistants that resolve, escalate, and stay on-brand.",
  ],
  [
    "Document & data extraction",
    "Turn contracts, forms, and PDFs into clean structured data.",
  ],
  [
    "Evals & LLM testing",
    "Harnesses and regression tests so you ship AI changes without breakage.",
  ],
  [
    "Fine-tuning & custom models",
    "LoRA/QLoRA and adapters when off-the-shelf isn't enough — or costs too much.",
  ],
  [
    "Voice & speech AI",
    "Transcription, voice agents, and speech interfaces wired into your product.",
  ],
  [
    "Privacy & on-device AI",
    "Privacy-preserving, federated, and on-device deployments for sensitive data.",
  ],
] as const;

const rungs = [
  {
    role: "Consultancy",
    name: "Discovery",
    description:
      "A short diagnostic: we map your workflows and tell you which two or three are worth deploying AI into — and which aren't.",
    strong: "which two or three are worth deploying AI into",
    price: "fixed scope",
    research: false,
  },
  {
    role: "Studio",
    name: "Deployment Sprint",
    description:
      "A focused 2–4 week engagement to take one workflow into production.",
    strong: "one workflow into production",
    price: "2–4 weeks",
    research: false,
  },
  {
    role: "Studio",
    name: "Embedded",
    description:
      "Forward deployed engineering — our engineers embed inside your team and ship alongside you.",
    strong: "our engineers embed inside your team",
    price: "monthly retainer",
    research: false,
  },
  {
    role: "Studio",
    name: "Managed Ops",
    description:
      "Once your AI is live: monitoring, regression evals, and continuous model-cost optimisation.",
    strong: "continuous model-cost optimisation",
    price: "ongoing",
    research: false,
  },
  {
    role: "",
    name: "Applied Research",
    description:
      "For genuinely hard problems — privacy-preserving and federated deployments, custom evals, on-device AI.",
    strong: "",
    price: "project / grant",
    research: true,
  },
] as const;

type TechLogo = Pick<SimpleIcon, "path" | "title" | "hex"> & {
  viewBox?: string;
};

const openAiLogo = {
  title: "OpenAI",
  hex: "000000",
  viewBox: "0 0 16 16",
  path: "M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z",
} satisfies TechLogo;

const microsoftLogo = {
  title: "Microsoft",
  hex: "5E5E5E",
  viewBox: "0 0 16 16",
  path: "M7.462 0H0v7.19h7.462zM16 0H8.538v7.19H16zM7.462 8.211H0V16h7.462zm8.538 0H8.538V16H16z",
} satisfies TechLogo;

const toolLogos: Partial<Record<string, TechLogo>> = {
  Claude: siClaude,
  "OpenAI GPT": openAiLogo,
  "Google Gemini": siGooglegemini,
  Llama: siMeta,
  Mistral: siMistralai,
  DeepSeek: siDeepseek,
  Qwen: siQwen,
  Kimi: siMoonshotai,
  Azure: microsoftLogo,
  "Google Cloud": siGooglecloud,
  Modal: siModal,
  Docker: siDocker,
  Kubernetes: siKubernetes,
  LangChain: siLangchain,
  LangGraph: siLangchain,
  n8n: siN8n,
  Databricks: siDatabricks,
  "Apache Spark": siApachespark,
  "Apache Flink": siApacheflink,
  Snowflake: siSnowflake,
  pgvector: siPostgresql,
  Qdrant: siQdrant,
  Ollama: siOllama,
  "Vertex AI": siGooglecloud,
  "Weights & Biases": siWeightsandbiases,
  "NeMo Guardrails": siNvidia,
  Presidio: microsoftLogo,
  NVIDIA: siNvidia,
  AMD: siAmd,
  "DGX Spark": siNvidia,
  RTX: siNvidia,
};

function TechLogoMark({ logo, brand = false }: { logo: TechLogo; brand?: boolean }) {
  const style = brand
    ? ({ "--tech-logo-color": `#${logo.hex}` } as CSSProperties)
    : undefined;

  return (
    <span
      className={brand ? "tech-logo brand-logo" : "tech-logo"}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox={logo.viewBox ?? "0 0 24 24"} focusable="false">
        <path d={logo.path} />
      </svg>
    </span>
  );
}

function ShiplineMark() {
  return (
    <span className="mk" aria-hidden="true">
      <img src={logoPath} alt="" />
    </span>
  );
}

const stackGroups = [
  [
    "Models",
    [
      "Claude",
      "OpenAI GPT",
      "Google Gemini",
      "Llama",
      "Mistral",
      "DeepSeek",
      "Qwen",
      "Kimi",
      "GLM",
    ],
  ],
  [
    "Cloud & infra",
    ["AWS", "Azure", "Google Cloud", "Modal", "Docker", "Kubernetes"],
  ],
  [
    "Orchestration",
    [
      "LangChain",
      "LlamaIndex",
      "LangGraph",
      "DSPy",
      "OpenClaw",
      "NemoClaw",
      "n8n",
    ],
  ],
  [
    "Data & processing",
    [
      "Databricks",
      "Apache Spark",
      "Apache Flink",
      "Snowflake",
      "Pinecone",
      "Weaviate",
      "pgvector",
      "Qdrant",
    ],
  ],
  [
    "Inference & serving",
    ["vLLM", "Ollama", "Bedrock", "Vertex AI", "Together", "Groq"],
  ],
  ["Ops & evals", ["LangSmith", "Langfuse", "Weights & Biases", "Ragas"]],
  [
    "Guardrails & privacy",
    ["NeMo Guardrails", "Presidio", "Differential privacy", "Federated learning"],
  ],
  ["Compute & hardware", ["NVIDIA", "AMD", "DGX Spark", "RTX"]],
] as const;

const why = [
  [
    "Forward deployed, not hands-off",
    "Our engineers embed inside your team and ship alongside you. No handoff, no slide deck that goes nowhere — production code you own.",
  ],
  [
    "No vendor lock-in",
    "Model-neutral by design. We route to the cheapest model that does the job, so your token bill doesn't outrun your growth.",
  ],
  [
    "You own the outcome",
    "We transfer knowledge and leave you with maintainable systems — not a black box that depends on us.",
  ],
  [
    "We handle the hard stuff",
    "A team that takes on the privacy-sensitive and research-grade problems generalist shops turn away.",
  ],
] as const;

const steps = [
  [
    "Discover",
    "We map your workflows and pin down the two or three worth deploying AI into.",
  ],
  [
    "Scope",
    "A fixed-scope plan for one workflow: the model, the architecture, the success metric.",
  ],
  [
    "Build & ship",
    "Our engineers embed and take it to production in weeks — tested, evaluated, live.",
  ],
  [
    "Hand over",
    "You get the code, the docs, and the knowledge. Run it yourself, or keep us on for ops.",
  ],
] as const;

const deliverables = [
  [
    "Production AI, deployed",
    "A working system live in your environment — not a prototype or a proof of concept.",
  ],
  [
    "Source code you own",
    "Clean, documented, maintainable code in your repository. No proprietary wrapper.",
  ],
  [
    "An evaluation harness",
    "Tests and metrics so you can change models or prompts later without breaking things.",
  ],
  [
    "Knowledge transfer",
    "Your team understands how it works and how to extend it — we don't leave you dependent.",
  ],
  [
    "A model-cost view",
    "Clear picture of what each workload costs to run, and where it can be optimised as you scale.",
  ],
  [
    "A path to what's next",
    "An honest read on the next workflow worth deploying — or whether you even need us again.",
  ],
] as const;

const principles = [
  [
    "Model-agnostic, always",
    "We pick the model that fits the workload and your budget — Claude, GPT, Gemini, or open. Never tied to one vendor.",
  ],
  [
    "You own everything we build",
    "Code, docs, and knowledge transfer at handover. We build to leave you independent, not dependent.",
  ],
  [
    "We ship, we don't just advise",
    "Forward deployed engineering — our people embed and put working AI into production alongside your team.",
  ],
  [
    "Honest about what's worth it",
    "If a workflow isn't worth deploying AI into, we'll tell you. We'd rather scope less and ship what matters.",
  ],
] as const;

const terminalLines = [
  {
    parts: [
      ["$", "pre"],
      [" shipline deploy workflows/intake-agent.yaml --env prod", ""],
    ],
    delay: 0,
  },
  {
    parts: [
      ["12:04:18", "dim"],
      ["load", "route"],
      [" client: anz-b2b-saas · workflow: support_intake_v3", ""],
    ],
    delay: 520,
  },
  {
    parts: [
      ["12:04:19", "dim"],
      ["sources", "route"],
      [" zendesk: 41k tickets · notion: 186 docs · postgres: read-only", ""],
    ],
    delay: 980,
  },
  {
    parts: [
      ["12:04:21", "dim"],
      ["privacy", "route"],
      [" Presidio PII redaction enabled · AU region locked", "ok"],
    ],
    delay: 1480,
  },
  {
    parts: [
      ["12:04:24", "dim"],
      ["index", "route"],
      [" pgvector/hnsw · chunks: 128,944 · p95 retrieval: 143ms", ""],
    ],
    delay: 1960,
  },
  {
    parts: [
      ["12:04:28", "dim"],
      ["eval", "route"],
      [" rag_regression_v17: faithfulness .94 · answer_recall .91", "ok"],
    ],
    delay: 2480,
  },
  {
    parts: [
      ["12:04:31", "dim"],
      ["router", "route"],
      [" triage → Llama 3.1 8B · refunds → GPT-4.1 · contracts → Claude", "pick"],
    ],
    delay: 3040,
  },
  {
    parts: [
      ["12:04:34", "dim"],
      ["guardrails", "route"],
      [" citations required · human approval for account changes", ""],
    ],
    delay: 3580,
  },
  {
    parts: [
      ["12:04:38", "dim"],
      ["actions", "route"],
      [" create Linear issue · draft CRM note · Slack escalation", ""],
    ],
    delay: 4100,
  },
  {
    parts: [
      ["12:04:43", "dim"],
      ["canary", "route"],
      [" 5% traffic · p95 latency 1.82s · cost $0.021/request", "ok"],
    ],
    delay: 4700,
  },
  {
    parts: [
      ["12:04:47", "dim"],
      ["handover", "route"],
      [" repo + runbook + eval harness + cost dashboard", ""],
    ],
    delay: 5280,
  },
  {
    parts: [["● production workflow live · traces streaming to Langfuse", "ok"]],
    delay: 5860,
  },
] as const;

const typingSpeed = 14;
const linePause = 120;

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

function formatNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function SectionMarker({
  index,
  label,
  detail,
}: {
  index: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="marker">
      <span className="idx">{index}</span>
      <span className="sep">·</span>
      <span className="lbl">{label}</span>
      <span className="sep">//</span>
      <span className="lbl">{detail}</span>
    </div>
  );
}

function AnimatedSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className ? `wrap ${className}` : "wrap"}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      variants={reveal}
    >
      {children}
    </motion.section>
  );
}

function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -3 }}
    >
      {children}
    </motion.div>
  );
}

function Terminal() {
  const reduce = useReducedMotion();
  const [activeLine, setActiveLine] = useState(reduce ? terminalLines.length : 0);
  const [activeChars, setActiveChars] = useState(0);

  useEffect(() => {
    if (reduce) {
      setActiveLine(terminalLines.length);
      setActiveChars(0);
      return undefined;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const lineLength = terminalLines[lineIndex].parts.reduce(
        (total, [text]) => total + text.length,
        0,
      );

      setActiveLine(lineIndex);
      setActiveChars(charIndex);

      if (charIndex < lineLength) {
        charIndex += 1;
        timeout = setTimeout(schedule, typingSpeed);
        return;
      }

      lineIndex += 1;
      charIndex = 0;

      if (lineIndex < terminalLines.length) {
        timeout = setTimeout(schedule, linePause);
        return;
      }

      setActiveLine(terminalLines.length);
      timeout = setTimeout(() => {
        lineIndex = 0;
        charIndex = 0;
        setActiveLine(0);
        setActiveChars(0);
        timeout = setTimeout(schedule, 260);
      }, 3500);
    };

    timeout = setTimeout(schedule, 300);
    return () => clearTimeout(timeout);
  }, [reduce]);

  const visibleLines = useMemo(() => terminalLines.slice(0, activeLine + 1), [
    activeLine,
  ]);

  const renderParts = (
    parts: (typeof terminalLines)[number]["parts"],
    lineIndex: number,
  ) => {
    if (lineIndex < activeLine || reduce) {
      return parts;
    }

    let remaining = activeChars;

    return parts
      .map(([text, cls]) => {
        const visibleText = text.slice(0, Math.max(0, remaining));
        remaining -= text.length;
        return [visibleText, cls] as const;
      })
      .filter(([text]) => text.length > 0);
  };

  const isComplete = reduce || activeLine >= terminalLines.length;
  const isTyping = !isComplete;

  const renderedLines = useMemo(
    () =>
      visibleLines.map((line, lineIndex) => ({
        parts: renderParts(line.parts, lineIndex),
        typing: isTyping && lineIndex === activeLine,
      })),
    [activeChars, activeLine, isTyping, reduce, visibleLines],
  );

  return (
    <motion.div
      className="terminal"
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="term-bar">
        <div className="dots">
          <i />
          <i />
          <i />
        </div>
        <span className="ttl">shipline@prod / forward-deployed-ai</span>
        <span className="badge">● canary</span>
      </div>
      <div className="term-body">
        {renderedLines.map((line, index) => (
          <div className="term-line" key={index}>
            {line.parts.map(([text, cls], partIndex) => (
              <span className={cls} key={partIndex}>
                {text}
              </span>
            ))}
            {line.typing ? <span className="cursor" /> : null}
          </div>
        ))}
        <div className="term-line">
          {isComplete ? <span className="pre">$</span> : null}
          {isComplete ? <span className="cursor" /> : null}
        </div>
      </div>
    </motion.div>
  );
}

function StrongText({
  text,
  strong,
}: {
  text: string;
  strong?: string;
}) {
  if (!strong || !text.includes(strong)) {
    return <>{text}</>;
  }

  const [before, after] = text.split(strong);
  return (
    <>
      {before}
      <b>{strong}</b>
      {after}
    </>
  );
}

export default function Home() {
  const reduce = useReducedMotion();

  return (
    <>
      <div className="page-texture" aria-hidden="true" />
      <div className="banner">
        Shiplines AI — model-agnostic AI deployment, from first prototype to production.{" "}
        <a href="#contact">Book a discovery call →</a>
      </div>

      <nav>
        <div className="nav-in">
          <a className="brand" href="#" aria-label="Shiplines AI home">
            <ShiplineMark />
            Shiplines<span>AI</span>
          </a>
          <div className="nav-links">
            {navLinks.map(([label, href]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
            <a href="#contact" className="nav-cta">
              Book a call
            </a>
          </div>
        </div>
      </nav>

      <header className="hero wrap">
        <motion.div
          className="hero-copy"
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          <motion.div className="tags-row" variants={fadeUp}>
            <span className="tag accent">[ AI DEPLOYMENT COMPANY ]</span>
            <span className="tag">[ Forward deployed engineering ]</span>
          </motion.div>
          <motion.h1 variants={fadeUp}>
            Ship production AI <span className="hl">at startup speed.</span>
          </motion.h1>
          <motion.p className="lede" variants={fadeUp}>
            We decide what AI is worth building, then we build it — and route
            every workload to the right model, so your runway lasts. One team
            from strategy to shipped code.
          </motion.p>
          <motion.div className="hero-actions" variants={fadeUp}>
            <a href="#contact" className="btn btn-primary">
              Start a sprint
            </a>
            <a href="#solutions" className="btn btn-ghost">
              See what we build
            </a>
          </motion.div>
        </motion.div>
        <Terminal />
      </header>

      <motion.div
        className="cloud wrap"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <p>We deploy across every major model — never locked to one</p>
        <div className="cloud-track">
          {cloudModels.map((model) => {
            const logo = toolLogos[model];

            return (
              <span className="tech" key={model}>
                {logo ? <TechLogoMark logo={logo} /> : null}
                <span className="tech-name">{model}</span>
              </span>
            );
          })}
        </div>
      </motion.div>

      <AnimatedSection>
        <SectionMarker index="01/ 08" label="The problem" detail="Why now" />
        <div className="sec-head">
          <h2>The math on hiring doesn&apos;t work.</h2>
        </div>
        <div className="math">
          <div className="math-grid">
            <div className="math-col bad">
              <div className="mtag">Hire a senior AI engineer</div>
              <div className="math-big">
                $180K<span>/yr</span>
              </div>
              <div className="math-sub">and six months to even find one</div>
              <ul className="math-list">
                <li>Your backlog grows while you search</li>
                <li>Your best engineers get pulled onto it anyway</li>
                <li>Runway keeps shrinking</li>
              </ul>
            </div>
            <div className="math-col good">
              <div className="mtag">Bring us in</div>
              <div className="math-big">Weeks</div>
              <div className="math-sub">to AI running in production</div>
              <ul className="math-list">
                <li>&nbsp;A fraction of a full-time hire</li>
                <li> No hiring lag, no FTE risk</li>
                <li> You keep the code and the knowledge</li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="solutions">
        <SectionMarker index="02/ 08" label="What we build" detail="Full range" />
        <div className="sec-head">
          <h2>The full range of AI we deploy.</h2>
          <p>
            From the first knowledge assistant to privacy-grade systems most
            shops won&apos;t touch. We scope to what moves your business — and
            skip what doesn&apos;t.
          </p>
        </div>
        <motion.div
          className="solutions"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
        >
          {solutions.map(([title, text], index) => (
            <MotionCard className="sol" key={title}>
              <div className="snum">{formatNumber(index)}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </MotionCard>
          ))}
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="work">
        <SectionMarker index="03/ 08" label="How we work" detail="One pipeline" />
        <div className="sec-head">
          <h2>Forward deployed engineering, from one team.</h2>
          <p>
            We don&apos;t hand over a strategy deck and leave. Our engineers
            embed inside your team and ship production AI alongside you — from
            deciding what&apos;s worth building to running it in production.
          </p>
        </div>
        <div className="ladder">
          {rungs.map((rung) => (
            <motion.div
              className={rung.research ? "rung research" : "rung"}
              key={rung.name}
              whileHover={reduce ? undefined : { y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rung-name">
                {rung.role ? <span className="rung-role">{rung.role}</span> : null}
                {rung.name}
              </div>
              <div className="rung-desc">
                <StrongText text={rung.description} strong={rung.strong} />
              </div>
              <div className="rung-price">{rung.price}</div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="stack">
        <SectionMarker index="04/ 08" label="Our stack" detail="Model-agnostic" />
        <div className="sec-head">
          <h2>The tools we deploy with.</h2>
          <p>
            Model-agnostic across every layer — we choose the stack that fits
            your workflow and your runway.
          </p>
        </div>
        <div className="stack">
          {stackGroups.map(([label, chips]) => (
            <div className="stack-group" key={label}>
              <div className="stack-label">{label}</div>
              <div className="chips">
                {chips.map((chip) => {
                  const logo = toolLogos[chip];

                  return (
                    <span className="tech" key={chip}>
                      {logo ? <TechLogoMark logo={logo} brand /> : null}
                      <span className="tech-name">{chip}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <SectionMarker index="05/ 08" label="Why us" detail="Built for runway" />
        <div className="sec-head">
          <h2>Built for runway, not lock-in.</h2>
        </div>
        <motion.div
          className="why"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {why.map(([title, text], index) => (
            <MotionCard className="why-cell" key={title}>
              <span className="wn">{formatNumber(index)}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </MotionCard>
          ))}
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="cases">
        <SectionMarker
          index="06 / 08"
          label="How an engagement runs"
          detail="Process"
        />
        <div className="sec-head">
          <h2>From first call to live in production.</h2>
          <p>
            A clear path, not a black box. Most engagements start with Discovery
            and move through to AI running in your product.
          </p>
        </div>
        <motion.div
          className="steps"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {steps.map(([title, text], index) => (
            <MotionCard className="step" key={title}>
              <div className="snum">{formatNumber(index)}</div>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="arrow">→</span>
            </MotionCard>
          ))}
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="deliverables">
        <SectionMarker index="07 / 08" label="What you get" detail="Deliverables" />
        <div className="sec-head">
          <h2>What&apos;s in your hands at the end.</h2>
          <p>
            No black boxes, no lock-in. Everything we build is yours to run,
            change, and own.
          </p>
        </div>
        <motion.div
          className="gets"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
        >
          {deliverables.map(([title, text]) => (
            <MotionCard className="get" key={title}>
              <div className="chk">✓</div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </MotionCard>
          ))}
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="principles">
        <SectionMarker index="08 / 08" label="How we operate" detail="Principles" />
        <div className="sec-head">
          <h2>How we operate.</h2>
          <p>The commitments behind every engagement.</p>
        </div>
        <motion.div
          className="principles"
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {principles.map(([title, text], index) => (
            <MotionCard className="principle" key={title}>
              <span className="pn">{formatNumber(index)}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </MotionCard>
          ))}
        </motion.div>
      </AnimatedSection>

      <AnimatedSection id="contact">
        <div className="final">
          <h2>Tell us what you&apos;re trying to ship.</h2>
          <p>
            A 30-minute call. We&apos;ll tell you straight whether a sprint can
            get it to production — and roughly what it&apos;d cost.
          </p>
          <a href="mailto:hello@shiplines.ai" className="btn btn-primary">
            Book a discovery call
          </a>
        </div>
      </AnimatedSection>

      <footer className="wrap">
        <div className="foot-in">
          <a className="brand" href="#" aria-label="Shiplines AI home">
            <ShiplineMark />
            Shiplines<span>AI</span>
          </a>
          <div className="foot-meta">hello@shiplines.ai · Melbourne, AU · © 2026</div>
        </div>
      </footer>
    </>
  );
}
