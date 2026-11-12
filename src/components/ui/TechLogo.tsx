import { asset } from "@/lib/data";

/** Real brand marks (devicon "original" / simple-icons), copied into public/logos with their licences. */
const BRAND: Record<string, { file: string; tint: string }> = {
  Java: { file: "java", tint: "#f89820" },
  "Core Java": { file: "java", tint: "#f89820" },
  Python: { file: "python", tint: "#3776ab" },
  TypeScript: { file: "typescript", tint: "#3178c6" },
  JavaScript: { file: "javascript", tint: "#f7df1e" },
  "Spring Boot": { file: "spring", tint: "#6db33f" },
  "Spring MVC": { file: "spring", tint: "#6db33f" },
  "Spring Security": { file: "spring", tint: "#6db33f" },
  Hibernate: { file: "hibernate", tint: "#59666c" },
  PostgreSQL: { file: "postgresql", tint: "#336791" },
  MySQL: { file: "mysql", tint: "#00758f" },
  "SQL Server": { file: "microsoftsqlserver", tint: "#cc2927" },
  MongoDB: { file: "mongodb", tint: "#47a248" },
  Redis: { file: "redis", tint: "#dc382d" },
  Kafka: { file: "apachekafka", tint: "#6b6b6b" },
  RabbitMQ: { file: "rabbitmq", tint: "#ff6600" },
  AWS: { file: "aws", tint: "#ff9900" },
  Docker: { file: "docker", tint: "#2496ed" },
  Kubernetes: { file: "kubernetes", tint: "#326ce5" },
  Jenkins: { file: "jenkins", tint: "#d24939" },
  Maven: { file: "maven", tint: "#c71a36" },
  Git: { file: "git", tint: "#f05032" },
  Grafana: { file: "grafana", tint: "#f46800" },
  Splunk: { file: "splunk", tint: "#65a637" },
  JUnit: { file: "junit", tint: "#25a162" },
  React: { file: "react", tint: "#61dafb" },
  MCP: { file: "mcp", tint: "#6b6b6b" },
  Pydantic: { file: "pydantic", tint: "#e92063" },
  "GitHub Actions": { file: "githubactions", tint: "#2088ff" },
  Lua: { file: "lua", tint: "#000080" },
  SQLite: { file: "sqlite", tint: "#0f80cc" },
};

/** Thin line icons (24×24, 1.5 stroke) for skills that are concepts rather than products. */
const CONCEPT_PATHS: Record<string, string> = {
  db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  layers: "M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  api: "M8 5 3 12l5 7M16 5l5 7-5 7M13.5 4l-3 16",
  nodes: "M5 5h4v4H5zM15 5h4v4h-4zM10 15h4v4h-4zM9 7h6M7 9l4 6M17 9l-4 6",
  threads: "M4 6h16M4 12h16M4 18h16M8 4v4M14 10v4M10 16v4",
  parallel: "M7 3v18M17 3v18M7 8l10 4M17 16 7 12",
  queue: "M3 7h4v10H3zM10 7h4v10h-4zM17 7h4v10h-4zM5 4v3M12 4v3M19 4v3",
  pattern: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 17h6M17 14v6",
  blocks: "M3 14h8v7H3zM13 14h8v7h-8zM8 4h8v7H8z",
  schema: "M3 4h7v6H3zM14 14h7v6h-7zM14 4h7v6h-7zM6.5 10v7H14M17.5 10v4",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l4.5-6M4 17h2M18 17h2M12 9V7",
  index: "M4 5h3M4 12h3M4 19h3M10 5h10M10 12h10M10 19h10",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4",
  retry: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5",
  loop: "M7 8a5 5 0 1 0 0 8h10a5 5 0 1 0 0-8H7Zm8-3 2 3-2 3",
  check: "M4 4h16v16H4zM8 12l3 3 5-6",
  mock: "M5 4h14v16H5zM8 8h8M8 12h5M8 16h8",
  review: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  cycle: "M4 12a8 8 0 0 1 13.7-5.7L20 9M20 12a8 8 0 0 1-13.7 5.7L4 15M20 4v5h-5M4 20v-5h5",
  pulse: "M3 12h4l2-5 4 10 2-5h6",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2ZM10 20a2 2 0 0 0 4 0",
  people:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 20c0-3.3 3.1-6 7-6s7 2.7 7 6M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14c2.4.8 4 2.8 4 6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  docsearch: "M6 3h8l4 4v6M6 3v18h7M14 3v4h4M17 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.2 19.2 22 22",
  braces:
    "M8 4c-2 0-3 1-3 3v2c0 1.5-1 3-2 3 1 0 2 1.5 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5 1 3 2 3-1 0-2 1.5-2 3v2c0 2-1 3-3 3",
  graph: "M5 6a2 2 0 1 0 0-.01M19 6a2 2 0 1 0 0-.01M12 18a2 2 0 1 0 0-.01M7 6h10M6 8l5 8M18 8l-5 8",
  qlearn: "M3 20h18M5 20V12M10 20V7M15 20v-6M20 20V4",
  ml: "M5 6a2 2 0 1 0 0-.01M5 18a2 2 0 1 0 0-.01M12 12a2 2 0 1 0 0-.01M19 6a2 2 0 1 0 0-.01M19 18a2 2 0 1 0 0-.01M7 6.5l3.5 4.5M7 17.5l3.5-4.5M14 11l3.5-3.5M14 13l3.5 3.5",
};

const CONCEPT: Record<string, keyof typeof CONCEPT_PATHS> = {
  SQL: "db",
  JPA: "layers",
  "REST APIs": "api",
  Microservices: "nodes",
  Multithreading: "threads",
  Concurrency: "parallel",
  ExecutorService: "queue",
  "Design Patterns": "pattern",
  "SOLID Principles": "blocks",
  "Data Modeling": "schema",
  "Query Optimization": "gauge",
  Indexing: "index",
  "Event-Driven Architecture": "bolt",
  "API Integration": "plug",
  "Retry & Failure Recovery": "retry",
  "CI/CD": "loop",
  Mockito: "mock",
  "Unit & Integration Testing": "check",
  "Code Reviews": "review",
  Agile: "cycle",
  Monitoring: "pulse",
  "On-call": "bell",
  Mentoring: "people",
  "LLM Integration": "spark",
  RAG: "docsearch",
  "OpenAI API": "spark",
  "Structured Outputs": "braces",
  LangGraph: "graph",
  "Q-Learning": "qlearn",
  "Machine Learning": "ml",
};

export const isBrand = (name: string) => name in BRAND;
export const brandTint = (name: string) => BRAND[name]?.tint;

export function TechLogo({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const brand = BRAND[name];
  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(`/logos/${brand.file}.svg`)}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const key = CONCEPT[name];
  if (key) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
      >
        <path d={CONCEPT_PATHS[key]} />
      </svg>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-grid",
        placeItems: "center",
        borderRadius: 6,
        boxShadow: "var(--hair)",
        fontFamily: "var(--font-mono)",
        fontSize: size * 0.42,
        color: "var(--mute)",
      }}
    >
      {name.slice(0, 2)}
    </span>
  );
}
