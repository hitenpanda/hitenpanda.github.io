export interface InsightArticle {
  slug: string;
  title: string;
  source: "Forbes" | "GitHub" | "SubStack" | "X (Twitter)";
  sourceUrl: string;
  sourceLabel: string;
  category: string;
  excerpt: string;
  readTime: string;
  publishedDate: string; // ISO date
  dateDisplay: string;
  thumbnail: string;
  featured: boolean;
  takeaways: string[];
}

export function getDailyInsights(): InsightArticle[] {
  const now = new Date();
  
  // Deterministic daily date formatting
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = months[now.getMonth()];
  const currentDay = now.getDate();

  // Helper for dates relative to today
  const formatOffsetDate = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return {
      iso: d.toISOString().slice(0, 10),
      display: daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${months[d.getMonth()]} ${d.getDate()}`,
    };
  };

  const d0 = formatOffsetDate(0);
  const d1 = formatOffsetDate(1);
  const d2 = formatOffsetDate(2);
  const d3 = formatOffsetDate(3);
  const d4 = formatOffsetDate(4);
  const d5 = formatOffsetDate(5);

  return [
    {
      slug: "the-rise-of-autonomous-ai-systems",
      title: "The Rise of Autonomous AI Systems: How Next-Gen Builders Are Redefining Software",
      source: "Forbes",
      sourceUrl: "https://www.forbes.com/sites/forbestechcouncil/2024/09/16/the-rise-of-agentic-ai-and-autonomous-systems/",
      sourceLabel: "Forbes Tech",
      category: "AI Systems",
      excerpt:
        "How autonomous agent architectures and foundation models are moving from lab benchmarks to real-world edge hardware and production systems.",
      readTime: "4 min read",
      publishedDate: d0.iso,
      dateDisplay: d0.display,
      thumbnail: "/media/insights/autonomous-ai-systems.svg",
      featured: true,
      takeaways: [
        "Agentic loops with deterministic tool validation outperform pure zero-shot LLM reasoning.",
        "Edge hardware acceleration is becoming the critical differentiator for local agent inference.",
        "Human-in-the-loop oversight shifts from execution to high-level intent verification."
      ]
    },
    {
      slug: "open-source-robotics-and-embodied-ai",
      title: "Open Source Robotics & Embodied AI: The LeRobot & vLLM Revolution",
      source: "GitHub",
      sourceUrl: "https://github.com/huggingface/lerobot",
      sourceLabel: "GitHub Trending",
      category: "Robotics & Hardware",
      excerpt:
        "Democratizing real-time robotics hardware with state-of-the-art imitation learning models and embedded neural control.",
      readTime: "Open Source",
      publishedDate: d1.iso,
      dateDisplay: d1.display,
      thumbnail: "/media/insights/open-source-robotics.svg",
      featured: true,
      takeaways: [
        "Accessible robotic hardware kits combined with PyTorch policy learning cut prototyping costs by 90%.",
        "High-throughput inference frameworks like vLLM enable multimodal models on constrained compute.",
        "Embodied physical intelligence is transitioning from proprietary labs to open community repositories."
      ]
    },
    {
      slug: "ai-hardware-architectures-and-silicon-bottlenecks",
      title: "AI Hardware Architectures & Silicon Bottlenecks: From GPUs to Edge Systems",
      source: "SubStack",
      sourceUrl: "https://www.semianalysis.com/p/ai-datacenter-energy-and-silicon-bottlenecks",
      sourceLabel: "SemiAnalysis",
      category: "Hardware Engineering",
      excerpt:
        "An architectural deep-dive into memory bandwidth, custom silicon, and local edge deployment for embedded AI models.",
      readTime: "6 min read",
      publishedDate: d2.iso,
      dateDisplay: d2.display,
      thumbnail: "/media/insights/ai-hardware-silicon.svg",
      featured: true,
      takeaways: [
        "Memory bandwidth (HBM3e/LPDDR5X) remains the paramount physical limiter over raw TFLOPs.",
        "Quantized INT4/FP8 neural execution allows microcontrollers and SBCs to host local reasoning.",
        "Co-design between hardware interconnects and model architectures is the future of edge engineering."
      ]
    },
    {
      slug: "building-from-first-principles-autonomous-software",
      title: "Building from First Principles: The Autonomous Software & Agent Paradigm",
      source: "X (Twitter)",
      sourceUrl: "https://x.com/karpathy/status/1880319247098499214",
      sourceLabel: "X • Andrej Karpathy",
      category: "AI Engineering",
      excerpt:
        "Why compounding intelligence, self-correcting runtimes, and autonomous feedback loops represent the ultimate frontier of modern computational engineering.",
      readTime: "2 min read",
      publishedDate: d3.iso,
      dateDisplay: d3.display,
      thumbnail: "/media/insights/autonomous-software-paradigm.svg",
      featured: true,
      takeaways: [
        "Software 3.0: Programs authored and maintained by self-monitoring autonomous neural agents.",
        "Tight evaluation loops and deterministic test harnesses are essential for safe agent autonomy.",
        "First-principles systems design remains the core competitive moat for AI engineers."
      ]
    },
    {
      slug: "impactful-ai-rearchitecting-learning-systems",
      title: "Impactful AI: Re-Architecting Learning Systems & Interactive Knowledge",
      source: "SubStack",
      sourceUrl: "https://thesequence.substack.com/p/the-next-wave-of-personalized-ai",
      sourceLabel: "The Sequence",
      category: "EdTech & AI",
      excerpt:
        "How generative reasoning models and multimodal interfaces are transforming scalable education and human-computer symbiosis.",
      readTime: "5 min read",
      publishedDate: d4.iso,
      dateDisplay: d4.display,
      thumbnail: "/media/insights/impactful-ai-education.svg",
      featured: true,
      takeaways: [
        "Socratic dialogue agents adapt learning curves in real-time to student cognitive load.",
        "Interactive canvas tools turn passive textbook reading into live exploratory simulations.",
        "Bridging accessibility gaps in emerging markets requires lightweight offline-capable models."
      ]
    },
    {
      slug: "hackathon-playbook-shipping-ai-hardware",
      title: "The Hackathon Playbook: Shipping Production AI & Hardware in 36 Hours",
      source: "X (Twitter)",
      sourceUrl: "https://x.com/ccuhacks",
      sourceLabel: "X • ccuhacks",
      category: "Community & Builders",
      excerpt:
        "Lessons from organizing premier hackathons: empowering hundreds of developers to assemble hardware, models, and interfaces under pressure.",
      readTime: "3 min read",
      publishedDate: d5.iso,
      dateDisplay: d5.display,
      thumbnail: "/media/insights/hackathon-playbook.svg",
      featured: true,
      takeaways: [
        "Scaffolding pre-flashed hardware kits and modular APIs enables rapid end-to-end prototyping.",
        "Community mentorship and peer debugging accelerate junior engineers into full-stack builders.",
        "The best hackathon projects focus on visceral, tangible demo impact over abstract features."
      ]
    }
  ];
}

export function getInsightBySlug(slug: string): InsightArticle | undefined {
  return getDailyInsights().find((art) => art.slug === slug);
}
