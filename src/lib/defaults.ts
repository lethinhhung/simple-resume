import { ResumeData } from "./types";

export const DEFAULT_RESUME: ResumeData = {
  header: {
    name: "LE THINH HUNG",
    subtitle: "Software Engineer",
    contacts: [
      { id: "c1", value: "Can Tho, Viet Nam" },
      { id: "c2", value: "thung260803@gmail.com" },
      { id: "c3", value: "0907560403" },
      { id: "c4", value: "github.com/lethinhhung" },
    ],
  },
  sections: [
    {
      id: "s1",
      label: "Objective",
      enabled: true,
      data: {
        type: "text",
        content:
          "Software Engineer specializing in React Native and full-stack web development. Focused on solving complex problems, building reliable solutions, and leveraging modern AI tools to improve development speed and code quality.",
      },
    },
    {
      id: "s2",
      label: "Education",
      enabled: true,
      data: {
        type: "education",
        entries: [
          {
            id: "e1",
            institution: "CAN THO UNIVERSITY",
            location: "Can Tho, Viet Nam",
            degree: "Bachelor of Software Engineering",
            dates: "01/2026",
            gpa: "3.39/4.0",
            description:
              "Graduation Thesis: Designed and built an AI-powered note-taking application with authentication, semantic search, and Retrieval-Augmented Generation (RAG) workflows using Next.js, TypeScript, Supabase, MongoDB, and Pinecone.",
          },
        ],
      },
    },
    {
      id: "s3",
      label: "Technical Skills",
      enabled: true,
      data: {
        type: "skills",
        categories: [
          {
            id: "sk1",
            category: "Core",
            values: "TypeScript, JavaScript",
          },
          {
            id: "sk2",
            category: "Frontend/Mobile",
            values:
              "React, Next.js, React Native (Expo), Redux Toolkit, TanStack Query, TailwindCSS, Ant Design",
          },
          {
            id: "sk3",
            category: "Backend/DB",
            values: "Node.js, PostgreSQL, MongoDB",
          },
          {
            id: "sk4",
            category: "Cloud & Tools",
            values: "AWS S3, Supabase, Docker, GitHub Actions, Git",
          },
          {
            id: "sk5",
            category: "Development",
            values:
              "Spec-driven development, AI-assisted & agentic workflows (Claude Code, Cursor, MCP)",
          },
        ],
      },
    },
    {
      id: "s4",
      label: "Relevant Experience",
      enabled: true,
      data: {
        type: "entry",
        entries: [
          {
            id: "ex1",
            title: "STRAPBUILD",
            subtitle: "Software Engineer",
            location: "(Full-time remote) Seoul, Korea",
            dates: "07/2025 - Present",
            description: "",
            bullets: [
              "Built and maintained mobile/web applications using React Native, React, and TypeScript.",
              "Solved cross-layer issues across frontend, backend, APIs, and real-time systems.",
              "Collaborated with product, backend, and design teams to deliver production-ready features.",
              "Applied AI-assisted and agentic workflows to accelerate software delivery and improve developer productivity.",
            ],
          },
        ],
      },
    },
    {
      id: "s5",
      label: "Projects",
      enabled: true,
      data: {
        type: "entry",
        entries: [
          {
            id: "p0",
            title: "SIMPLE RESUME",
            subtitle: "github.com/lethinhhung/simple-resume",
            location: "",
            dates: "05/2026 - Present",
            description:
              "An ATS-friendly resume builder with real-time PDF preview and a minimalist Swiss-style UI.",
            bullets: [
              "Built a split-pane editor with live PDF generation using react-pdf/renderer and Zustand for state management.",
              "Designed a minimalist UI with sharp geometry, monochromatic palette, and custom scrollbar styling.",
              "Implemented flexible section system supporting text, entry, education, skills, and list types with reordering.",
            ],
          },
          {
            id: "p1",
            title: "FAST-CARDS",
            subtitle: "github.com/lethinhhung/fast-cards",
            location: "",
            dates: "05/2026 - Present",
            description:
              "A web-based flashcard study app for vocabulary learning with smart requeue for incorrect answers.",
            bullets: [
              "Built an interactive study system with a smart requeue algorithm that resurfaces incorrect cards for reinforcement.",
              "Implemented data portability with JSON/CSV export/import and cross-tab sync via localStorage observer pattern.",
              "Developed comprehensive test suite using Vitest and React Testing Library.",
            ],
          },
          {
            id: "p2",
            title: "NOTENODES",
            subtitle: "github.com/lethinhhung/notenodes",
            location: "",
            dates: "09/2025 - Present",
            description:
              "A modern note-taking web app with rich text editing, multi-format import/export, and visual customization.",
            bullets: [
              "Built a rich text editor using BlockNote with multi-format export/import support (Markdown, HTML, JSON, plain text).",
              "Implemented visual customization including glassmorphism backgrounds, grid overlays, and dark/light theme toggling.",
              "Added internationalization for English and Vietnamese using react-i18next with server-side rendering.",
              "Used Redux Toolkit for state management with localStorage persistence across sessions.",
            ],
          },
        ],
      },
    },
    {
      id: "s6",
      label: "Certification",
      enabled: true,
      data: {
        type: "list",
        items: [
          {
            id: "cert1",
            name: "IIG TOEIC (900/990)",
            detail: "",
            dates: "05/2024 - 05/2026",
          },
        ],
      },
    },
  ],
  pageSettings: {
    marginTop: 1.5,
    marginBottom: 1.5,
    marginLeft: 1.5,
    marginRight: 1.5,
    fontSize: 10,
    fontFamily: "Calibri",
  },
};
