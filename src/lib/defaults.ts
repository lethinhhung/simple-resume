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
            id: "p1",
            title: "GUAVA MVP - HYPERLOCAL MARKETPLACE PLATFORM (STRAPBUILD)",
            subtitle: "Full-Stack Engineer",
            location: "",
            dates: "05/2026 - 06/2026",
            description:
              "Hyperlocal marketplace application inspired by neighborhood-based community commerce platforms.",
            bullets: [
              "Built end-to-end marketplace and neighborhood-based product features using React Native and TypeScript.",
              "Implemented location-based flows, listing systems, real-time interactions, and map integrations.",
              "Applied spec-driven and agentic workflows to improve development speed and consistency.",
            ],
          },
          {
            id: "p2",
            title:
              "PANTRY MVP - ANONYMOUS WORKPLACE COMMUNITY PLATFORM (STRAPBUILD)",
            subtitle: "Full-Stack Engineer",
            location: "",
            dates: "03/2026 - 05/2026",
            description:
              "Social platform for anonymous workplace communities, reviews, and messaging.",
            bullets: [
              "Built end-to-end product features across mobile, web, backend integrations, and infrastructure workflows.",
              "Successfully launched the app to Google Play and Apple App Store.",
              "Used agentic workflows extensively to speed up development, testing, debugging, and release processes.",
            ],
          },
          {
            id: "p3",
            title: "BOLTB MOBILE COMMERCE APP (STRAPBUILD)",
            subtitle: "React Native Engineer",
            location: "",
            dates: "07/2025 - 03/2026",
            description:
              "Live-commerce platform combining livestream shopping, marketplace, auctions, and real-time interactions.",
            bullets: [
              "Built React Native features for livestreaming, chat, and marketplace flows.",
              "Integrated WebSocket/OpenAPI services and fixed real-time synchronization issues.",
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
};
