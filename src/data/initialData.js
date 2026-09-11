export const initialPortfolioData = {
  profile: {
    name: "Yagya Mahajan",
    role: "FULL-STACK & AI SYSTEMS ARCHITECTURE",
    tagline: "Building high-performance web systems and intelligent autonomous architectures.",
    bio: "I am a Full-Stack Software Developer & AI Systems Engineer dedicated to forging robust web architectures, scalable distributed backends, and breathing life into complex data systems through intelligent generative models.",
    status: "Open to Opportunities",
    statusSub: "Specializing in Full-Stack Engineering, Generative AI, and Distributed Cloud Systems.",
    location: "Punjab, India",
    email: "yagyamahajan16@gmail.com",
    avatar: "/profile-avatar.png",
    avatarScale: 127,
    avatarX: 1,
    avatarY: 1,
    linkedin: "https://linkedin.com/in/yagya-mahajan",
    github: "https://github.com/YagyaMhjn",
    resumeUrl: "#",
    cvUrl: "#",
    socials: [
      { id: "soc_1", platform: "GitHub", url: "https://github.com/YagyaMhjn", label: "GitHub" },
      { id: "soc_2", platform: "LinkedIn", url: "https://linkedin.com/in/yagya-mahajan", label: "LinkedIn" },
      { id: "soc_3", platform: "Instagram", url: "https://instagram.com/yagyamahajan", label: "Instagram" },
      { id: "soc_4", platform: "Email", url: "mailto:yagyamahajan16@gmail.com", label: "Email" },
      { id: "soc_5", platform: "Download CV", url: "#", label: "Download CV" }
    ],
    primaryTech: [
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "Node.js",
      "Tailwind CSS",
      "FastAPI",
      "PostgreSQL",
      "Docker"
    ],
    principles: [
      {
        quote: "Simplicity is the ultimate sophistication. Clean code combined with intuitive architecture delivers lasting value.",
        author: "Design Standard"
      },
      {
        quote: "AI is not a replacement, but an amplifier of human capability. Thoughtfully designed models turn raw data into actionable intelligence.",
        author: "Engineering Philosophy"
      },
      {
        quote: "Resilient systems demand robust architecture, sub-second latency, and user-centric interfaces crafted with meticulous attention to detail.",
        author: "Architectural Standard"
      }
    ]
  },
  categories: [
    "All",
    "Frontend",
    "Backend & Cloud",
    "AI & Data Science",
    "Tools & Systems"
  ],
  skills: [
    { id: "s1", name: "React.js", category: "Frontend", level: "Expert" },
    { id: "s2", name: "Next.js", category: "Frontend", level: "Advanced" },
    { id: "s3", name: "TypeScript", category: "Frontend", level: "Advanced" },
    { id: "s4", name: "Tailwind CSS", category: "Frontend", level: "Expert" },
    { id: "s5", name: "HTML5 / CSS3", category: "Frontend", level: "Expert" },
    { id: "s6", name: "Framer Motion", category: "Frontend", level: "Proficient" },
    { id: "s7", name: "Node.js", category: "Backend & Cloud", level: "Advanced" },
    { id: "s8", name: "Express.js", category: "Backend & Cloud", level: "Advanced" },
    { id: "s9", name: "Python", category: "Backend & Cloud", level: "Expert" },
    { id: "s10", name: "FastAPI", category: "Backend & Cloud", level: "Advanced" },
    { id: "s11", name: "PostgreSQL", category: "Backend & Cloud", level: "Advanced" },
    { id: "s12", name: "MongoDB", category: "Backend & Cloud", level: "Proficient" },
    { id: "s13", name: "Redis", category: "Backend & Cloud", level: "Proficient" },
    { id: "s14", name: "Docker", category: "Backend & Cloud", level: "Proficient" },
    { id: "s15", name: "PyTorch", category: "AI & Data Science", level: "Advanced" },
    { id: "s16", name: "LangChain / Agents", category: "AI & Data Science", level: "Advanced" },
    { id: "s17", name: "OpenAI / Claude APIs", category: "AI & Data Science", level: "Expert" },
    { id: "s18", name: "Vector Databases (Pinecone/Chroma)", category: "AI & Data Science", level: "Advanced" },
    { id: "s19", name: "Git & GitHub", category: "Tools & Systems", level: "Expert" },
    { id: "s20", name: "Linux & Bash", category: "Tools & Systems", level: "Advanced" },
    { id: "s21", name: "RESTful & GraphQL APIs", category: "Tools & Systems", level: "Expert" },
    { id: "s22", name: "CI/CD & DevOps", category: "Tools & Systems", level: "Proficient" }
  ],
  projects: [
    {
      id: "p1",
      title: "NeuroPulse AI Workspace",
      category: "AI & Data Science",
      description: "Autonomous multi-agent orchestration hub featuring persistent vector memory retrieval, intelligent LLM reasoning pipelines, and real-time streaming telemetry.",
      tags: ["React", "TypeScript", "Python", "FastAPI", "Tailwind CSS", "LangChain", "ChromaDB"],
      github: "https://github.com/YagyaMhjn/neuropulse-ai",
      live: "https://neuropulse-ai.vercel.app",
      media: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      featured: true,
      year: "2026"
    },
    {
      id: "p2",
      title: "CloudScale Distributed Engine",
      category: "Backend & Cloud",
      description: "High-throughput microservice architecture orchestrator with auto-healing load balancing, metrics monitoring, and sub-10ms event processing queues.",
      tags: ["Node.js", "Express", "Docker", "Redis", "PostgreSQL", "Tailwind CSS"],
      github: "https://github.com/YagyaMhjn/cloudscale-engine",
      live: "https://cloudscale-demo.vercel.app",
      media: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      featured: true,
      year: "2025"
    },
    {
      id: "p3",
      title: "OmniFlow Dev Platform",
      category: "Frontend",
      description: "Next-generation developer productivity workspace featuring real-time collaborative code review, AST static analysis, and automated deployment pipelines.",
      tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "WebSockets"],
      github: "https://github.com/YagyaMhjn/omniflow-platform",
      live: "https://omniflow.dev",
      media: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      featured: true,
      year: "2025"
    },
    {
      id: "p4",
      title: "AeroVision 3D Geospatial Engine",
      category: "Frontend",
      description: "Interactive 3D geospatial visualizer supporting complex terrain mesh rendering, real-time elevation heatmaps, and GPU-accelerated raycasting.",
      tags: ["React", "Three.js", "Python", "FastAPI", "Tailwind CSS"],
      github: "https://github.com/YagyaMhjn/aerovision-3d",
      live: "https://aerovision.vercel.app",
      media: "",
      featured: false,
      year: "2024"
    },
    {
      id: "p5",
      title: "HyperLedger Quant Analytics",
      category: "AI & Data Science",
      description: "Low-latency financial telemetry and algorithmic trading dashboard with predictive time-series forecasting models and real-time order-book charts.",
      tags: ["Python", "FastAPI", "React", "TypeScript", "Tailwind CSS"],
      github: "https://github.com/YagyaMhjn/hyperledger-quant",
      live: "https://hyperledger-quant.vercel.app",
      media: "",
      featured: false,
      year: "2024"
    },
    {
      id: "p6",
      title: "Monochrome Portfolio & CMS",
      category: "Frontend",
      description: "Ultra-fast, responsive developer portfolio with protected administrative CMS, real-time reactive state synchronization, and zero-latency local caching.",
      tags: ["React", "Tailwind CSS", "Vite", "LocalStorage", "Vercel"],
      github: "https://github.com/YagyaMhjn/Portfolio-Yagya",
      live: "https://portfolio-yagya.vercel.app",
      media: "",
      featured: true,
      year: "2026"
    }
  ],
  timeline: [
    {
      id: "t1",
      title: "Full-Stack & AI Systems Engineer",
      company: "InnovateTech Systems",
      dates: "2024 - Present",
      type: "experience",
      description: "Leading the development of high-scale web platforms and autonomous AI agent workflows. Implemented distributed microservices and reduced API latency by 42%."
    },
    {
      id: "t2",
      title: "Software Developer Intern",
      company: "Nexus Software Labs",
      dates: "2023 - 2024",
      type: "experience",
      description: "Engineered responsive full-stack applications with React, Node.js, and PostgreSQL. Built WebSocket real-time communication modules and CI/CD pipelines."
    },
    {
      id: "t3",
      title: "Bachelor of Technology in Computer Science",
      company: "Punjab Technical University",
      dates: "2020 - 2024",
      type: "education",
      description: "Graduated with Honors. Specialized in Algorithms, Distributed Systems, Software Engineering, and Machine Learning architectures."
    }
  ],
  certificates: [
    {
      id: "c1",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI",
      date: "2024",
      credentialUrl: "https://coursera.org",
      media: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      skills: ["Neural Networks", "CNNs", "Transformers", "PyTorch"]
    },
    {
      id: "c2",
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2024",
      credentialUrl: "https://aws.amazon.com",
      media: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      skills: ["Cloud Architecture", "EC2", "S3", "Lambda", "High Availability"]
    },
    {
      id: "c3",
      title: "Meta Full-Stack Professional Certificate",
      issuer: "Meta",
      date: "2023",
      credentialUrl: "https://coursera.org",
      media: "",
      skills: ["React", "Node.js", "Database Systems", "API Design"]
    },
    {
      id: "c4",
      title: "Python for Data Science & Machine Learning",
      issuer: "IBM",
      date: "2023",
      credentialUrl: "https://coursera.org",
      media: "",
      skills: ["Python", "Pandas", "Scikit-Learn", "Data Analysis"]
    }
  ],
  beyondData: [
    {
      id: "bd1",
      title: "President & Lead Organizer",
      organization: "University Developer Student Club",
      period: "2023 - 2024",
      category: "Leadership & Community",
      description: "Organized 12+ technical workshops, hackathons, and coding bootcamps for over 600+ students, fostering peer-to-peer technical mentorship and open-source contributions.",
      highlight: "600+ Students Mentored",
      media: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bd2",
      title: "1st Place Winner — Global AI Innovation Hackathon",
      organization: "TechFest International",
      period: "2024",
      category: "Competitions",
      description: "Spearheaded a 4-person engineering team to architect and ship an autonomous code-refactoring multi-agent swarm in 36 continuous sprint hours.",
      highlight: "Top Prize Winner ($5,000)",
      media: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bd3",
      title: "Technical Speaker & Workshop Conductor",
      organization: "Regional Web & AI Dev Summit",
      period: "2024",
      category: "Public Speaking",
      description: "Delivered hands-on keynote and live-coding sessions on 'Building Production-Ready Vector Search & Multi-Agent Workflows with React & FastAPI'.",
      highlight: "250+ Attendees",
      media: ""
    },
    {
      id: "bd4",
      title: "Open Source Contributor & Maintainer",
      organization: "GitHub Community",
      period: "2022 - Present",
      category: "Open Source",
      description: "Contributed performance patches, type definitions, and documentation improvements to popular React and Python developer tooling repositories.",
      highlight: "Active Contributor",
      media: ""
    }
  ],
  messages: []
};