export interface GuideItem {
  slug: string;
  title: string;
  subtitle: string;
  readTime: string;
  category: string;
  summary: string;
  contentSections: {
    heading: string;
    body: string[];
    keyTakeaway?: string;
  }[];
}

export const GUIDES: GuideItem[] = [
  {
    slug: "business-investment",
    title: "Guide to Business Investment",
    subtitle: "A comprehensive institutional framework for evaluating, structuring, and participating in private market enterprises.",
    readTime: "7 min read",
    category: "Investment Strategy",
    summary:
      "Understand the mechanics of private business investments, key evaluation criteria, cap table structures, and risk mitigation strategies.",
    contentSections: [
      {
        heading: "1. Fundamentals of Direct Business Investment",
        body: [
          "Direct business investment involves deploying capital into privately held companies in exchange for equity, structured debt, or mezzanine instruments. Unlike public market securities, private enterprise investments offer the opportunity for direct value creation, governance participation, and tailored liquidity timelines.",
          "Investors must develop a rigorous thesis focused on sector dynamics, unit economics, founding team capability, and competitive moats before deploying capital.",
        ],
        keyTakeaway: "Direct business investments require active due diligence and a multi-year horizon.",
      },
      {
        heading: "2. Evaluating Financial Health and Growth Metrics",
        body: [
          "Key institutional metrics include Customer Acquisition Cost (CAC), Lifetime Value (LTV), Gross Margin consistency, and Cash Runway. For traditional businesses, steady EBITDA margins and working capital cycles serve as primary indicators.",
          "Always request normalized historic financial statements, tax filings, and audited balance sheets to verify historical resilience.",
        ],
      },
      {
        heading: "3. Deal Structuring and Protective Provisions",
        body: [
          "Standard institutional agreements incorporate liquidation preferences, anti-dilution clauses, information rights, and pre-emptive rights to protect minority and strategic investors.",
          "Structuring through safe notes, convertible debentures, or preferred equity allows alignment between risk appetites and founder incentives.",
        ],
      },
    ],
  },
  {
    slug: "venture-capital",
    title: "Guide to Venture Capital",
    subtitle: "Navigating early-stage and growth-stage high-growth technology funding rounds.",
    readTime: "8 min read",
    category: "Venture Capital",
    summary:
      "A strategic walkthrough of VC round mechanics (Seed, Series A, Series B+), term sheets, valuation methodologies, and portfolio management.",
    contentSections: [
      {
        heading: "1. The Venture Capital Lifecycle",
        body: [
          "Venture capital is specifically designed for high-growth companies with scalable business models and large addressable markets (TAM). From Pre-Seed product discovery to Series A product-market fit and Series B scaling, each round serves distinct capital allocation goals.",
          "Founders must understand the expectations associated with VC capital: institutional governance, rapid expansion, and eventual liquidity events through M&A or IPOs.",
        ],
      },
      {
        heading: "2. Decoding the Term Sheet",
        body: [
          "A VC term sheet outlines economics (Pre-money Valuation, Option Pool Shuffle) and control (Board Composition, Protective Provisions, Voting Rights).",
          "Understanding the interplay between 1x non-participating preferred shares and participating structures is critical for maintaining founder alignment across multiple funding rounds.",
        ],
        keyTakeaway: "Valuation is only one clause in a term sheet; governance terms often dictate true outcomes.",
      },
    ],
  },
  {
    slug: "angel-investment",
    title: "Guide to Angel Investment",
    subtitle: "Empowering visionary early-stage founders through strategic angel syndicates and individual capital.",
    readTime: "6 min read",
    category: "Angel Syndicates",
    summary:
      "How angel investors identify breakout founders, manage risk through portfolio diversification, and provide post-investment mentorship.",
    contentSections: [
      {
        heading: "1. The Role of Angel Capital",
        body: [
          "Angel investors provide vital early-stage fuel, often being the first institutional check alongside founders. Beyond capital, high-value angels bring domain expertise, executive hiring networks, and customer intros.",
          "Diversification across 15–25 early-stage bets is widely recognized as a best practice to mitigate binary early-stage risk.",
        ],
      },
      {
        heading: "2. Syndicates and Co-Investment Networks",
        body: [
          "Joining organized angel networks and syndicates allows individual investors to pool capital, access institutional-grade deal flow, and negotiate unified terms with professional lead investors.",
        ],
      },
    ],
  },
  {
    slug: "business-partnerships",
    title: "Guide to Business Partnerships",
    subtitle: "Structuring collaborative joint ventures, strategic alliances, and profit-sharing ventures.",
    readTime: "6 min read",
    category: "Strategic Partnerships",
    summary:
      "Best practices for establishing joint ventures, defining revenue splits, operational milestones, and dispute-resolution frameworks.",
    contentSections: [
      {
        heading: "1. Types of Strategic Business Partnerships",
        body: [
          "Partnerships range from commercial distribution agreements to equity-based Joint Ventures (JVs). Identifying whether a collaboration requires shared equity or contractual profit-sharing ensures operational clarity.",
        ],
      },
      {
        heading: "2. Legal Structures and Governance",
        body: [
          "Clear operating agreements must establish voting thresholds, capital call obligations, IP ownership, non-compete boundaries, and exit mechanisms (shotgun clauses, drag-along rights).",
        ],
      },
    ],
  },
  {
    slug: "business-franchise",
    title: "Guide to Business Franchise",
    subtitle: "Evaluating franchise models, master franchise licenses, unit economics, and operational playbooks.",
    readTime: "7 min read",
    category: "Franchising",
    summary:
      "A complete guide for franchise seekers and franchisors: unit economics, royalty structures, territory exclusivity, and scaling frameworks.",
    contentSections: [
      {
        heading: "1. Assessing Franchise Unit Economics",
        body: [
          "Franchise investments offer proven operational blueprints and brand recognition. Key considerations include the Initial Franchise Fee, Ongoing Royalty Percentage, Marketing Fund contributions, and payback period per location.",
        ],
      },
      {
        heading: "2. Master Franchise & Multi-Unit Rights",
        body: [
          "Securing regional or master franchise rights allows high-net-worth operators to develop entire territories through sub-franchising and centralized supply chain infrastructure.",
        ],
      },
    ],
  },
];
