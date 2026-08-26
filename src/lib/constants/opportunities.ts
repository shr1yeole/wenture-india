export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  category: "Investment" | "Franchise" | "EXIM" | "M&A" | "Partnership" | "Dealership";
  sector: "Technology" | "CleanTech" | "FinTech" | "Logistics" | "Real Estate" | "Healthcare" | "Manufacturing" | "Food & Beverage" | "Agriculture" | "Automation" | "HealthTech";
  location: string;
  tag: string;
  stageBadge?: string;
  isFeatured?: boolean;
  isPremium?: boolean;
  targetRaise: string;
  targetAmountNum: number;
  equityOffered?: string;
  type: string;
  percentFunded?: number;
  daysLeft?: number;
  estRoi?: string;
  term?: string;
  shortDescription: string;
  overview: string;
  businessHighlights: string[];
  growthMetrics: {
    label: string;
    value: string;
  }[];
  imageUrl: string;
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-aether",
    slug: "aether-financial-systems",
    title: "Aether Financial Systems",
    category: "Investment",
    sector: "FinTech",
    location: "London, UK",
    tag: "FinTech",
    stageBadge: "Series A",
    isFeatured: true,
    isPremium: true,
    targetRaise: "£4.5M",
    targetAmountNum: 4500000,
    equityOffered: "12%",
    type: "Equity / Series A",
    percentFunded: 75,
    daysLeft: 8,
    shortDescription: "Next-generation algorithmic trading infrastructure providing ultra-low latency execution and risk analytics for institutional funds.",
    overview:
      "Aether Financial Systems delivers hardware-accelerated algorithmic execution pipelines, ultra-low latency routing, and institutional risk management software.",
    businessHighlights: [
      "Sub-microsecond execution latency on global Tier-1 exchanges",
      "Over £120B in monthly institutional volume routed",
      "Proprietary FPGA acceleration architecture",
      "Tier-1 hedge fund and asset manager customer base",
    ],
    growthMetrics: [
      { label: "ARR Run-rate", value: "£3.2M" },
      { label: "Net Revenue Retention", value: "142%" },
      { label: "Gross Margin", value: "88%" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-synapse",
    slug: "synapse-informatics",
    title: "Synapse Informatics",
    category: "Investment",
    sector: "HealthTech",
    location: "Boston, MA",
    tag: "HealthTech",
    stageBadge: "Seed",
    isFeatured: true,
    isPremium: true,
    targetRaise: "$2.1M",
    targetAmountNum: 2100000,
    equityOffered: "10%",
    type: "Seed Preferred",
    percentFunded: 60,
    daysLeft: 14,
    shortDescription: "AI-driven diagnostic platform utilizing neural networks to analyze pathology slides with 99.8% accuracy, reducing diagnostic turnarounds.",
    overview:
      "Synapse Informatics leverages deep vision models and computational pathology to assist diagnostic laboratories in detecting oncology markers rapidly.",
    businessHighlights: [
      "99.8% diagnostic benchmark validation against manual review",
      "Pilot integrations with 6 leading research hospitals",
      "FDA Breakthrough Device Designation track",
      "Proprietary dataset of 5M+ annotated digital pathology slides",
    ],
    growthMetrics: [
      { label: "Validation Accuracy", value: "99.8%" },
      { label: "Hospital Pilots", value: "6 Active" },
      { label: "Diagnostic Time Saved", value: "72%" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-kinetics",
    slug: "kinetics-industrial",
    title: "Kinetics Industrial",
    category: "Investment",
    sector: "Automation",
    location: "Munich, DE",
    tag: "Automation",
    stageBadge: "Series B",
    isFeatured: true,
    isPremium: true,
    targetRaise: "€12.0M",
    targetAmountNum: 12000000,
    equityOffered: "15%",
    type: "Series B Growth",
    percentFunded: 85,
    daysLeft: 6,
    shortDescription: "Scalable robotic process automation (RPA) solutions for mid-tier manufacturing, integrating seamlessly with legacy CNC and assembly lines.",
    overview:
      "Kinetics Industrial manufactures modular plug-and-play vision-guided robotic workcells for precision manufacturing and electronics assembly.",
    businessHighlights: [
      "Over 120 robotic workcells deployed in European factories",
      "Average customer payback period under 9 months",
      "Patented zero-programming intuitive vision calibration",
      "Strategic OEM agreements with major robotics manufacturers",
    ],
    growthMetrics: [
      { label: "Annual Shipments", value: "+180% YoY" },
      { label: "Order Backlog", value: "€18.5M" },
      { label: "Deployment Time", value: "< 48 Hours" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-1",
    slug: "ecovolt-solutions",
    title: "EcoVolt Solutions",
    category: "Investment",
    sector: "CleanTech",
    location: "Bangalore, IN",
    tag: "CleanTech",
    stageBadge: "Series A",
    isFeatured: true,
    isPremium: true,
    targetRaise: "₹15M",
    targetAmountNum: 15000000,
    equityOffered: "12%",
    type: "Equity",
    percentFunded: 45,
    daysLeft: 12,
    shortDescription: "Next-generation energy storage infrastructure and smart microgrids for commercial real estate facilities.",
    overview:
      "EcoVolt Solutions develops advanced modular battery storage systems and intelligent microgrid software engineered specifically for commercial facilities.",
    businessHighlights: [
      "Proprietary thermal management system with 35% longer cycle life",
      "Over ₹8M in signed commercial pilot contracts across South India",
      "Patent-pending automated peak-shaving dispatch algorithms",
      "Tier-1 manufacturing supply chain relationships established",
    ],
    growthMetrics: [
      { label: "YoY Revenue Growth", value: "+210%" },
      { label: "Contracted Pipeline", value: "₹24M" },
      { label: "Target Market", value: "$4.2B by 2028" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-2",
    slug: "ledgerflow-ai",
    title: "LedgerFlow AI",
    category: "Investment",
    sector: "FinTech",
    location: "Mumbai, IN",
    tag: "FinTech",
    stageBadge: "Series A",
    isFeatured: true,
    isPremium: true,
    targetRaise: "₹8.5M",
    targetAmountNum: 8500000,
    equityOffered: "10%",
    type: "Safe / Equity",
    percentFunded: 80,
    daysLeft: 5,
    shortDescription: "Automated institutional reconciliation software powered by machine learning for banks and fintechs.",
    overview:
      "LedgerFlow AI eliminates manual financial reconciliations for NBFCs, banks, and cross-border enterprises with an enterprise-grade agentic financial ledger engine.",
    businessHighlights: [
      "Processes 2M+ transactions daily with 99.98% match accuracy",
      "SOC-2 Type II and ISO 27001 certified architecture",
      "14 institutional pilot customers in banking and payment processing",
      "Reduces month-end closing time from 10 days to 4 hours",
    ],
    growthMetrics: [
      { label: "Annual Recurring Revenue", value: "₹4.8M" },
      { label: "Net Retention Rate", value: "128%" },
      { label: "Gross Margin", value: "84%" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-3",
    slug: "routeoptimize",
    title: "RouteOptimize Logistics",
    category: "Investment",
    sector: "Logistics",
    location: "Gurgaon, IN",
    tag: "Logistics",
    stageBadge: "Seed",
    isFeatured: true,
    isPremium: true,
    targetRaise: "₹5M",
    targetAmountNum: 5000000,
    equityOffered: "8%",
    type: "Equity",
    percentFunded: 90,
    daysLeft: 3,
    shortDescription: "AI dispatch engine reducing last-mile carbon and freight costs by 22% across multi-city delivery hubs.",
    overview:
      "RouteOptimize provides hyper-local routing algorithms that dynamically adapt to traffic patterns, cargo load distribution, and multi-stop deliveries.",
    businessHighlights: [
      "22% verified reduction in average fleet fuel expenditure",
      "Powering 15,000+ daily deliveries for e-commerce enterprises",
      "Plug-and-play API integration with standard ERPs",
      "Zero customer churn across enterprise tier clients",
    ],
    growthMetrics: [
      { label: "Daily Active Routes", value: "15,000+" },
      { label: "Fuel Cost Savings", value: "22%" },
      { label: "Enterprise Churn", value: "0.0%" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-4",
    slug: "urban-brew-franchise",
    title: "Urban Brew Specialty Cafe",
    category: "Franchise",
    sector: "Food & Beverage",
    location: "Pan-India Expansion",
    tag: "Franchise",
    stageBadge: "Franchise",
    targetRaise: "₹2.5M / Unit",
    targetAmountNum: 2500000,
    type: "Master Franchise / Unit",
    estRoi: "28% p.a.",
    term: "5 Years",
    shortDescription: "High-margin artisanal coffee and quick-service concept with proven unit economics across 18 flagship outlets.",
    overview:
      "Urban Brew is a rapidly expanding specialty coffee and gourmet cafe brand with high-density suburban footfall locations and standardized supply chains.",
    businessHighlights: [
      "Average unit payback period under 18 months",
      "Centralized roasting facility and automated bean distribution",
      "Proprietary mobile ordering and loyalty app with 60k members",
      "Comprehensive training, marketing, and real-estate site selection support",
    ],
    growthMetrics: [
      { label: "Existing Outlets", value: "18 Outlets" },
      { label: "Average Unit ROI", value: "28% p.a." },
      { label: "Store Payback", value: "< 18 Months" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-5",
    slug: "agroexport-spices",
    title: "AgroExport Global",
    category: "EXIM",
    sector: "Agriculture",
    location: "Kochi, IN",
    tag: "EXIM",
    stageBadge: "Growth",
    targetRaise: "₹10M",
    targetAmountNum: 10000000,
    type: "Trade Financing / Partnership",
    estRoi: "18% p.a.",
    term: "24 Months",
    shortDescription: "Certified organic spices processing and export partnership servicing premium European and Middle Eastern markets.",
    overview:
      "AgroExport Global sources, processes, tests, and packages organic certified Indian spices for leading supermarket chains across Europe and the GCC.",
    businessHighlights: [
      "Over ₹30M in confirmed multi-year international buyer contracts",
      "FSSAI, USDA Organic, and EU Bio-certified processing plant",
      "Direct farm-gate aggregation network with 400+ organic cultivators",
      "Low default risk with irrevocable Letters of Credit backing orders",
    ],
    growthMetrics: [
      { label: "Export Volume", value: "+140% YoY" },
      { label: "Target Gross Margin", value: "24%" },
      { label: "Secured Orders", value: "₹30M" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "opp-6",
    slug: "hyperforge-aerospace",
    title: "HyperForge Advanced Manufacturing",
    category: "Investment",
    sector: "Manufacturing",
    location: "Pune, IN",
    tag: "Manufacturing",
    stageBadge: "Series B",
    targetRaise: "₹20M",
    targetAmountNum: 20000000,
    equityOffered: "14%",
    type: "Equity / Mezzanine",
    shortDescription: "Precision CNC and 3D additive titanium manufacturing for defense and aerospace component suppliers.",
    overview:
      "HyperForge operates high-precision 5-axis machining and additive manufacturing centers producing mission-critical titanium components.",
    businessHighlights: [
      "AS9100D aerospace quality certification achieved",
      "Tier-1 vendor approval with leading aerospace defense primes",
      "State-of-the-art climate-controlled clean room facility",
      "High barriers to entry with proprietary metallurgy IP",
    ],
    growthMetrics: [
      { label: "Facility Utilization", value: "92%" },
      { label: "Certified Part Catalog", value: "240+ Parts" },
      { label: "Gross Margin", value: "48%" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
];
