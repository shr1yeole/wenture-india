import type { InvestorProfile } from "@/lib/firebase/investors";

export const DEMO_INVESTORS: InvestorProfile[] = [
  {
    id: "demo-inv-1",
    userId: "demo-user-1",
    investorName: "Aditya Singhania",
    investorType: "Angel Investor",
    location: "Mumbai, Maharashtra",
    investmentRange: "₹25L – ₹50L",
    preferredSectors: ["Technology", "FinTech", "AI & SaaS"],
    investmentStage: "Seed / Early Stage",
    areasOfExpertise: ["SaaS Architecture", "Go-To-Market", "Scale-Up Mentorship"],
    shortIntroduction:
      "Active angel investor and ex-fintech founder backing tech-first startups with strong unit economics, defensible intellectual property, and clear founder-market fit.",
    experience:
      "14+ years in enterprise software and banking integrations. Personally invested in 12+ seed-stage startups across India and Southeast Asia with 3 successful secondary exits.",
    status: "published",
    isDemo: true,
  },
  {
    id: "demo-inv-2",
    userId: "demo-user-2",
    investorName: "Kavita Rao",
    investorType: "VC",
    location: "Bengaluru, Karnataka",
    investmentRange: "₹1 Cr – ₹5 Cr",
    preferredSectors: ["Healthcare", "HealthTech", "Biotech"],
    investmentStage: "Growth / Expansion",
    areasOfExpertise: ["Clinical Diagnostics", "Regulatory Compliance", "Strategic Hospital Alliances"],
    shortIntroduction:
      "Healthcare-focused venture investor deploying capital into diagnostic innovations, clinical equipment distribution, and digital telemedicine platforms.",
    experience:
      "Principal at a South Asian life-sciences fund with over a decade of domain expertise in medical technology commercialization and Indian regulatory pathways.",
    status: "published",
    isDemo: true,
  },
  {
    id: "demo-inv-3",
    userId: "demo-user-3",
    investorName: "Vikramaditya Oberoi",
    investorType: "Corporate",
    location: "New Delhi, Delhi",
    investmentRange: "₹5 Cr – ₹10 Cr",
    preferredSectors: ["Food & Beverage", "Retail", "Consumer Goods"],
    investmentStage: "Growth / Expansion",
    areasOfExpertise: ["National Supply Chain", "Omnichannel Retail", "Master Franchise Networks"],
    shortIntroduction:
      "Corporate investment director evaluating strategic stakes in scalable D2C brands, QSR food chains, and modern high-density retail ventures.",
    experience:
      "Directs M&A and strategic alliances for a multi-brand FMCG enterprise with ₹500 Cr+ annual retail and institutional distribution footprint across India.",
    status: "published",
    isDemo: true,
  },
  {
    id: "demo-inv-4",
    userId: "demo-user-4",
    investorName: "Rohan & Sanya Mehra",
    investorType: "Individual",
    location: "Pune, Maharashtra",
    investmentRange: "₹50L – ₹1 Cr",
    preferredSectors: ["Manufacturing", "CleanTech", "Industrial Goods"],
    investmentStage: "Seed / Early Stage",
    areasOfExpertise: ["Lean Precision Manufacturing", "EXIM Procedures", "Plant Automation"],
    shortIntroduction:
      "Family office angel syndicate backing sustainable industrial engineering, export-oriented precision parts, and clean energy supply chains.",
    experience:
      "Second-generation industrial leaders operating high-precision automotive and industrial tooling facilities with global supply ties.",
    status: "published",
    isDemo: true,
  },
  {
    id: "demo-inv-5",
    userId: "demo-user-5",
    investorName: "Arjun Nambiar",
    investorType: "Financier",
    location: "Chennai, Tamil Nadu",
    investmentRange: "₹10 Cr+",
    preferredSectors: ["Logistics", "Infrastructure", "Real Estate"],
    investmentStage: "Pre-IPO / Late Stage",
    areasOfExpertise: ["Structured Debt", "Capital Markets", "Commercial Asset Financing"],
    shortIntroduction:
      "Institutional financier facilitating growth debt, equipment lease structures, and asset-backed equity financing for mature commercial enterprises.",
    experience:
      "20+ years syndicating large-scale commercial debt, warehouse development capital, and private infrastructure funding across South India.",
    status: "published",
    isDemo: true,
  },
  {
    id: "demo-inv-6",
    userId: "demo-user-6",
    investorName: "Dr. Shalini Deshmukh",
    investorType: "Angel Investor",
    location: "Hyderabad, Telangana",
    investmentRange: "₹25L – ₹50L",
    preferredSectors: ["Education", "EdTech", "Skill Development"],
    investmentStage: "Seed / Early Stage",
    areasOfExpertise: ["Curriculum Strategy", "B2B Institutional Sales", "Founder Coaching"],
    shortIntroduction:
      "Education sector executive investing in hybrid learning academies, vocational training platforms, and enterprise skill assessment technologies.",
    experience:
      "Former university academic councilor and EdTech advisory board member backing visionary education entrepreneurs solving accessibility and employability.",
    status: "published",
    isDemo: true,
  },
];
