/**
 * Single source of content for the site.
 *
 * Everything here is taken from the résumé (public/GeethaPriyaKR.pdf), including the
 * hyperlinks embedded in it. The four open-source projects marked `source: "github"` are
 * not on the résumé; they were added at the owner's request and describe public repos.
 * Components only read from this file.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Prefix a /public path with the deploy base path (GitHub Pages project sites). */
export const asset = (path: string) => `${BASE}${path}`;

export const PROFILE = {
  name: "Geetha Priya Kanikireddy",
  firstName: "Geetha",
  greetingName: "Geetha Priya",
  initials: "GK",
  role: "Full Stack Software Engineer",
  email: "GeethaPriya.K@uga.edu",
  phone: "404-803-5632",
  phoneHref: "tel:+14048035632",
  location: "Atlanta, GA",
  github: "https://github.com/geethapriya1625",
  githubHandle: "geethapriya1625",
  linkedin: "https://www.linkedin.com/in/kanikireddy",
  resume: "/GeethaPriyaKR.pdf",
  resumeSummary:
    "Full Stack software engineer with 4 years shipping production software, strongest on the back end in Java, Spring Boot and Python. Designs REST APIs, microservices and data models, delivers the interfaces in React and TypeScript, and integrates LLM and RAG features into products. Owns work end to end, from requirements to production support.",
  extraLine: "Currently completing a Master of Science in Computer Science at the University of Georgia, GPA 3.9/4.0.",
  /** Paraphrase of the résumé summary, not a new claim. */
  quote: "Strongest on the back end, and I own the work end to end, from requirements to production support.",
  graduation: "Dec 2026",
  graduationYear: "2026",
  dept: "Computer Science",
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ skills */

export type SkillFamily =
  | "Languages"
  | "Frameworks"
  | "Concurrency & Design"
  | "Databases"
  | "Messaging"
  | "Cloud & DevOps"
  | "Testing & Practices"
  | "AI & Frontend";

export type Skill = {
  name: string;
  symbol: string;
  family: SkillFamily;
  /** extra words that count as a mention when finding where the skill was used */
  aliases?: string[];
  note?: string;
};

/** Résumé "Technical Skills" groups, in résumé order. Group labels are shortened. */
export const SKILL_GROUPS: { family: SkillFamily; resumeLabel: string; skills: Skill[] }[] = [
  {
    family: "Languages",
    resumeLabel: "Languages",
    skills: [
      { name: "Java", symbol: "Ja", family: "Languages", note: "Java 8/11/17" },
      { name: "Python", symbol: "Py", family: "Languages" },
      { name: "SQL", symbol: "Sq", family: "Languages" },
      { name: "TypeScript", symbol: "Ts", family: "Languages" },
      { name: "JavaScript", symbol: "Js", family: "Languages" },
    ],
  },
  {
    family: "Frameworks",
    resumeLabel: "Core Java and Frameworks",
    skills: [
      { name: "Core Java", symbol: "Cj", family: "Frameworks", aliases: ["Java"] },
      { name: "Spring Boot", symbol: "Sb", family: "Frameworks" },
      { name: "Spring MVC", symbol: "Sm", family: "Frameworks" },
      { name: "Spring Security", symbol: "Ss", family: "Frameworks" },
      { name: "Hibernate", symbol: "Hb", family: "Frameworks" },
      { name: "JPA", symbol: "Jp", family: "Frameworks" },
      { name: "REST APIs", symbol: "Ra", family: "Frameworks", aliases: ["REST"] },
      { name: "Microservices", symbol: "Ms", family: "Frameworks" },
    ],
  },
  {
    family: "Concurrency & Design",
    resumeLabel: "Concurrency and Design",
    skills: [
      { name: "Multithreading", symbol: "Mt", family: "Concurrency & Design" },
      { name: "Concurrency", symbol: "Cc", family: "Concurrency & Design", aliases: ["concurrent"] },
      { name: "ExecutorService", symbol: "Es", family: "Concurrency & Design" },
      { name: "Design Patterns", symbol: "Dp", family: "Concurrency & Design" },
      { name: "SOLID Principles", symbol: "So", family: "Concurrency & Design" },
    ],
  },
  {
    family: "Databases",
    resumeLabel: "Databases",
    skills: [
      { name: "PostgreSQL", symbol: "Pg", family: "Databases" },
      { name: "MySQL", symbol: "My", family: "Databases" },
      { name: "SQL Server", symbol: "Mq", family: "Databases" },
      { name: "MongoDB", symbol: "Mg", family: "Databases" },
      { name: "Redis", symbol: "Rd", family: "Databases" },
      { name: "Data Modeling", symbol: "Dm", family: "Databases", aliases: ["data model"] },
      { name: "Query Optimization", symbol: "Qo", family: "Databases", aliases: ["tuning queries", "slow query"] },
      { name: "Indexing", symbol: "Ix", family: "Databases", aliases: ["indexes"] },
    ],
  },
  {
    family: "Messaging",
    resumeLabel: "Messaging and Integration",
    skills: [
      { name: "Kafka", symbol: "Kf", family: "Messaging" },
      { name: "RabbitMQ", symbol: "Rq", family: "Messaging" },
      { name: "Event-Driven Architecture", symbol: "Ed", family: "Messaging", aliases: ["event driven"] },
      { name: "API Integration", symbol: "Ap", family: "Messaging", aliases: ["integration"] },
      { name: "Retry & Failure Recovery", symbol: "Rr", family: "Messaging", aliases: ["retry"] },
    ],
  },
  {
    family: "Cloud & DevOps",
    resumeLabel: "Cloud and DevOps",
    skills: [
      { name: "AWS", symbol: "Aw", family: "Cloud & DevOps", note: "EC2, ECS, S3, Lambda" },
      { name: "Docker", symbol: "Dk", family: "Cloud & DevOps" },
      { name: "Kubernetes", symbol: "K8", family: "Cloud & DevOps" },
      { name: "Jenkins", symbol: "Jn", family: "Cloud & DevOps" },
      { name: "Maven", symbol: "Mv", family: "Cloud & DevOps" },
      { name: "CI/CD", symbol: "Ci", family: "Cloud & DevOps" },
      { name: "Git", symbol: "Gt", family: "Cloud & DevOps" },
      { name: "Grafana", symbol: "Gf", family: "Cloud & DevOps" },
      { name: "Splunk", symbol: "Sp", family: "Cloud & DevOps" },
    ],
  },
  {
    family: "Testing & Practices",
    resumeLabel: "Testing and Practices",
    skills: [
      { name: "JUnit", symbol: "Ju", family: "Testing & Practices" },
      { name: "Mockito", symbol: "Mo", family: "Testing & Practices" },
      { name: "Unit & Integration Testing", symbol: "Ut", family: "Testing & Practices", aliases: ["integration tests"] },
      { name: "Code Reviews", symbol: "Cr", family: "Testing & Practices", aliases: ["reviewed"] },
      { name: "Agile", symbol: "Ag", family: "Testing & Practices" },
      { name: "Monitoring", symbol: "Mn", family: "Testing & Practices", aliases: ["dashboards"] },
      { name: "On-call", symbol: "Oc", family: "Testing & Practices", aliases: ["on call"] },
      { name: "Mentoring", symbol: "Me", family: "Testing & Practices", aliases: ["mentored"] },
    ],
  },
  {
    family: "AI & Frontend",
    resumeLabel: "AI and Frontend",
    skills: [
      { name: "LLM Integration", symbol: "Ll", family: "AI & Frontend", aliases: ["LLM"] },
      { name: "RAG", symbol: "Rg", family: "AI & Frontend" },
      { name: "OpenAI API", symbol: "Oa", family: "AI & Frontend" },
      { name: "Structured Outputs", symbol: "St", family: "AI & Frontend", aliases: ["schema validated", "structured output"] },
      { name: "React", symbol: "Re", family: "AI & Frontend" },
    ],
  },
];

export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);
export const FAMILIES: SkillFamily[] = SKILL_GROUPS.map((g) => g.family);

/* ---------------------------------------------------------------- projects */

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[];
  github?: string;
  source: "resume" | "github";
};

export const PROJECTS: Project[] = [
  {
    id: "soc-agent",
    index: "01",
    title: "Forensic Triage Agent for Security Operations Centers",
    kicker: "Master's project · Jan 2026 – Present",
    description:
      "Master's project: a multi-agent system that turns ambiguous security logs into prioritized directives, with tool use, structured outputs and a human approval gate.",
    features: [
      "Multi-agent system",
      "Ambiguous logs in",
      "Prioritized directives out",
      "Tool use",
      "Structured outputs",
      "Human approval gate",
    ],
    tech: ["Python", "LangGraph", "OpenAI API", "RAG", "MCP"],
    source: "resume",
  },
  {
    id: "approval-workflow",
    index: "02",
    title: "Approval Workflow Service",
    kicker: "Open source · Java",
    description:
      "A multi-step approval API: rules enforced in the domain, safe retries, no lost updates, and events that cannot go missing.",
    features: [
      "Segregation of duties",
      "Idempotency keys",
      "Optimistic locking",
      "Transactional outbox to Kafka",
      "JWT with role-based access",
      "Testcontainers integration tests",
    ],
    tech: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Docker"],
    github: "https://github.com/geethapriya1625/approval-workflow-service",
    source: "github",
  },
  {
    id: "rate-limiter",
    index: "03",
    title: "Distributed Rate Limiter",
    kicker: "Open source · Java",
    description:
      "Distributed token-bucket rate limiting for Spring Boot: one Redis round trip per request, exact under concurrency, consistent across app instances.",
    features: [
      "Atomic Redis Lua script",
      "Redis clock, not app clocks",
      "RateLimit headers + 429",
      "Fail-open or fail-closed",
      "Race test: exactly 50 of 640",
      "Benchmarked in CI",
    ],
    tech: ["Java", "Spring Boot", "Redis", "Lua"],
    github: "https://github.com/geethapriya1625/redis-rate-limiter",
    source: "github",
  },
  {
    id: "eval-harness",
    index: "04",
    title: "LLM Eval Harness",
    kicker: "Open source · Python",
    description:
      "Regression tests for LLM features that return structured data, so a prompt or model change gets the same safety net as any other code change.",
    features: [
      "Strict JSON Schema per task",
      "Validate-and-repair retries",
      "Field-level scoring",
      "Confusion matrices",
      "Baselines + fingerprints",
      "CI gate on regressions",
    ],
    tech: ["Python", "Pydantic", "OpenAI API", "GitHub Actions"],
    github: "https://github.com/geethapriya1625/llm-eval-harness",
    source: "github",
  },
  {
    id: "sql-guard",
    index: "05",
    title: "SQL Guard MCP Server",
    kicker: "Open source · Python",
    description:
      "A read-only SQL Model Context Protocol server that lets AI agents query SQLite or PostgreSQL safely, behind three independent safety layers.",
    features: ["AST guard (sqlglot)", "Read-only connection", "Database time box", "Column masking", "Row caps", "Audit log"],
    tech: ["Python", "MCP", "PostgreSQL", "SQLite"],
    github: "https://github.com/geethapriya1625/sql-guard-mcp",
    source: "github",
  },
  {
    id: "bitcoin",
    index: "06",
    title: "Bitcoin Price Movement Prediction from Twitter Signals",
    kicker: "Machine learning · Jan 2023",
    description:
      "Built end to end in Python: a Q-learning model trained on tweet engagement signals to predict short term price movement.",
    features: ["Built end to end in Python", "Q-learning model", "Tweet engagement signals", "Short term price movement"],
    tech: ["Python", "Q-Learning", "Machine Learning"],
    source: "resume",
  },
];

/* ------------------------------------------------------- experience + education */

export type TimelineStop = {
  kind: "education" | "work";
  start: string;
  end: string;
  year: string;
  title: string;
  place: string;
  location: string;
  detail?: string;
  bullets?: string[];
};

export const EDUCATION: TimelineStop[] = [
  {
    kind: "education",
    start: "Jun 2019",
    end: "May 2023",
    year: "2019",
    title: "Bachelor of Engineering in Computer Science",
    place: "Nagarjuna College of Engineering and Technology",
    location: "Bangalore, India",
  },
  {
    kind: "education",
    start: "Aug 2025",
    end: "Dec 2026",
    year: "2025",
    title: "Master of Science in Computer Science",
    place: "University of Georgia",
    location: "Athens, GA",
    detail: "GPA 3.9/4.0",
  },
];

export const EXPERIENCE: TimelineStop[] = [
  {
    kind: "work",
    start: "Aug 2022",
    end: "Jul 2025",
    year: "2022",
    title: "Software Engineer",
    place: "CrimsonLogic Pvt. Ltd",
    location: "Bangalore, India",
    bullets: [
      "Engineered 30+ REST APIs and microservices in Java 8/11/17 and Spring Boot across 8 enterprise workflows.",
      "Optimized the Hibernate and JPA layer and second level cache by reading the generated SQL rather than trusting the abstraction, restoring low latency responses.",
      "Architected data models across PostgreSQL, SQL Server and MongoDB, tuning queries and indexes for throughput.",
      "Engineered event driven integration with Kafka and RabbitMQ, designing retry and recovery for failed messages.",
      "Hardened services with OAuth 2.0, JWT and Spring Security, covered by JUnit and Mockito unit and integration tests.",
      "Spearheaded delivery through Git, Maven, Jenkins and Docker onto AWS and Kubernetes, with Grafana and Splunk dashboards.",
      "Delivered the React, Angular and TypeScript front ends on top of the APIs, with Node.js and Express services behind them.",
      "Reviewed other engineers' code, mentored new joiners and carried production on call in an Agile team.",
    ],
  },
  {
    kind: "work",
    start: "Aug 2025",
    end: "Present",
    year: "2025",
    title: "Software Engineering Intern",
    place: "University of Georgia",
    location: "Athens, GA",
    bullets: [
      "Engineered Spring Boot REST APIs and microservices behind a platform 4 teams use daily, as the sole engineer.",
      "Architected the persistence layer in Hibernate and JPA over a 22-table data model, tuning entity mapping, fetch strategies and second level cache.",
      "Optimized database access by profiling slow query paths and reworking indexes, cutting repeated round trips out of the hot path.",
      "Delivered the React and TypeScript front end on top of those APIs, including the authoring and review screens users work in daily.",
      "Built 9 data pipelines feeding the services, with LLM extraction, schema validated output and a human approval step.",
      "Owned the full lifecycle: requirements from non-technical users, weekly releases on their feedback, and on call and end user support after launch.",
    ],
  },
];

/** Education and experience as one chronological path. */
export const TIMELINE: TimelineStop[] = [EDUCATION[0], EXPERIENCE[0], EDUCATION[1], EXPERIENCE[1]];

/* No certifications or achievements are listed on the résumé, so those sections are omitted. */
export const CERTIFICATIONS: { title: string; issuer: string; href?: string }[] = [];
export const ACHIEVEMENTS: { label: string; value: number; caption: string; detail: string }[] = [];

/* ------------------------------------------------------------- ID card */

export const ID_CARD = {
  rows: [
    { k: "Handle", v: "@geethapriya1625" },
    { k: "Dept.", v: PROFILE.dept },
    { k: "Valid till", v: PROFILE.graduationYear },
  ],
  back: [
    "Full Stack software engineer",
    "MS Computer Science, University of Georgia · GPA 3.9/4.0",
    "30+ REST APIs across 8 enterprise workflows",
    "Sole engineer on a platform 4 teams use daily",
    "Master's project: Forensic Triage Agent for SOCs",
  ],
};

/* ----------------------------------------------------------- derived */

const corpus = [
  ...EXPERIENCE.map((e) => ({ label: `${e.title}, ${e.place}`, text: (e.bullets ?? []).join(" ") })),
  ...PROJECTS.map((p) => ({ label: p.title, text: `${p.tech.join(" ")} ${p.description} ${p.features.join(" ")}` })),
];

/** Roles and projects whose text mentions the skill (or one of its aliases). */
export function usedIn(skill: Skill): string[] {
  const needles = [skill.name, ...(skill.aliases ?? [])].map((n) => n.toLowerCase());
  return corpus
    .filter((c) => {
      const hay = c.text.toLowerCase();
      return needles.some((n) => new RegExp(`(^|[^a-z])${n.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}([^a-z]|$)`).test(hay));
    })
    .map((c) => c.label);
}
