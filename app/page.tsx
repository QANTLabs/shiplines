"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const navLinks = [
  ["What we build", "#solutions"],
  ["How we work", "#work"],
  ["Stack", "#stack"],
  ["What you get", "#deliverables"],
] as const;

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

const logoFor = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const toolLogos: Partial<Record<string, string>> = {
  Claude: logoFor("anthropic.com"),
  "OpenAI GPT": logoFor("openai.com"),
  "Google Gemini": logoFor("ai.google.dev"),
  Llama: logoFor("meta.com"),
  Mistral: logoFor("mistral.ai"),
  DeepSeek: logoFor("deepseek.com"),
  Qwen: logoFor("qwen.ai"),
  Kimi: logoFor("kimi.moonshot.cn"),
  GLM: logoFor("z.ai"),
  AWS: logoFor("aws.amazon.com"),
  Azure: logoFor("azure.microsoft.com"),
  "Google Cloud": logoFor("cloud.google.com"),
  Modal: logoFor("modal.com"),
  Docker: logoFor("docker.com"),
  Kubernetes: logoFor("kubernetes.io"),
  LangChain: logoFor("langchain.com"),
  LlamaIndex: logoFor("llamaindex.ai"),
  LangGraph: logoFor("langchain.com"),
  DSPy: logoFor("dspy.ai"),
  n8n: logoFor("n8n.io"),
  Databricks: logoFor("databricks.com"),
  "Apache Spark": logoFor("spark.apache.org"),
  "Apache Flink": logoFor("flink.apache.org"),
  Snowflake: logoFor("snowflake.com"),
  Pinecone: logoFor("pinecone.io"),
  Weaviate: logoFor("weaviate.io"),
  pgvector: logoFor("postgresql.org"),
  Qdrant: logoFor("qdrant.tech"),
  vLLM: logoFor("vllm.ai"),
  Ollama: logoFor("ollama.com"),
  Bedrock: logoFor("aws.amazon.com"),
  "Vertex AI": logoFor("cloud.google.com"),
  Together: logoFor("together.ai"),
  Groq: logoFor("groq.com"),
  LangSmith: logoFor("langchain.com"),
  Langfuse: logoFor("langfuse.com"),
  "Weights & Biases": logoFor("wandb.ai"),
  Ragas: logoFor("ragas.io"),
  "NeMo Guardrails": logoFor("nvidia.com"),
  Presidio: logoFor("microsoft.com"),
  NVIDIA: logoFor("nvidia.com"),
  AMD: logoFor("amd.com"),
  "DGX Spark": logoFor("nvidia.com"),
  RTX: logoFor("nvidia.com"),
};

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
      [' deploy --workload "summarise 200-page contract"', ""],
    ],
    delay: 0,
  },
  {
    parts: [["# analysing: long-context, reasoning-heavy", "dim"]],
    delay: 600,
  },
  {
    parts: [
      ["→ routing to", "route"],
      [" Claude ", "pick"],
      ["✓ best fit", "ok"],
    ],
    delay: 1100,
  },
  {
    parts: [
      ["$", "pre"],
      [' deploy --workload "classify 10k support tickets"', ""],
    ],
    delay: 1900,
  },
  {
    parts: [["# analysing: high-volume, low-complexity", "dim"]],
    delay: 2500,
  },
  {
    parts: [
      ["→ routing to", "route"],
      [" open model ", "pick"],
      ["✓ 94% cheaper", "ok"],
    ],
    delay: 3000,
  },
  {
    parts: [
      ["$", "pre"],
      [' deploy --workload "multimodal product search"', ""],
    ],
    delay: 3800,
  },
  {
    parts: [
      ["→ routing to", "route"],
      [" Gemini ", "pick"],
      ["✓ native vision", "ok"],
    ],
    delay: 4400,
  },
  {
    parts: [["● 3 workloads live · runway optimised", "ok"]],
    delay: 5100,
  },
] as const;

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
  const [visibleCount, setVisibleCount] = useState(reduce ? terminalLines.length : 0);

  useEffect(() => {
    if (reduce) {
      setVisibleCount(terminalLines.length);
      return undefined;
    }

    let index = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      setVisibleCount(index + 1);
      index += 1;

      if (index < terminalLines.length) {
        const nextDelay = terminalLines[index].delay - terminalLines[index - 1].delay;
        timeout = setTimeout(schedule, nextDelay);
      } else {
        timeout = setTimeout(() => {
          index = 0;
          setVisibleCount(0);
          timeout = setTimeout(schedule, 260);
        }, 3500);
      }
    };

    timeout = setTimeout(schedule, 300);
    return () => clearTimeout(timeout);
  }, [reduce]);

  const visibleLines = useMemo(
    () => terminalLines.slice(0, visibleCount),
    [visibleCount],
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
        <span className="ttl">router.deploy() — model-agnostic</span>
        <span className="badge">● live</span>
      </div>
      <div className="term-body">
        {visibleLines.map((line, index) => (
          <div className="term-line" key={`${index}-${visibleCount}`}>
            {line.parts.map(([text, cls], partIndex) => (
              <span className={cls} key={partIndex}>
                {text}
              </span>
            ))}
          </div>
        ))}
        <div className="term-line">
          {visibleCount >= terminalLines.length ? <span className="pre">$</span> : null}
          <span className="cursor" />
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
        Shipline AI — model-agnostic AI deployment for ANZ startups.{" "}
        <a href="#contact">Book a discovery call →</a>
      </div>

      <nav>
        <div className="nav-in">
          <a className="brand" href="#" aria-label="Shipline AI home">
            <span className="mk">[</span>
            Shipline<span>AI</span>
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
            <span className="tag">
              <span className="dot" /> forward deployed engineering
            </span>
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
          {cloudModels.map((model) => (
            <span className="tech" key={model}>
              {model}
            </span>
          ))}
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
                <li>A fraction of a full-time hire</li>
                <li>No hiring lag, no FTE risk</li>
                <li>You keep the code and the knowledge</li>
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
                      {logo ? (
                        <span className="tech-logo" aria-hidden="true">
                          <img src={logo} alt="" loading="lazy" />
                        </span>
                      ) : null}
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
          <a className="brand" href="#" aria-label="Shipline AI home">
            <span className="mk">[</span>
            Shipline<span>AI</span>
          </a>
          <div className="foot-meta">hello@shipline.ai · Melbourne, AU · © 2026</div>
        </div>
      </footer>
    </>
  );
}
