export interface GuideSection {
  heading: string;
  body: string[];
  keyTakeaway?: string;
}

export interface GuideItem {
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  readTime: string;
  shortDescription: string;
  contentSections: GuideSection[];
  featured?: boolean;
}

export const GUIDES_HEADING = {
  title: "Learn. Explore. Grow.",
  subtitle:
    "Understand business opportunities, investment concepts and growth models before taking your next step.",
};

export const GUIDES: GuideItem[] = [
  {
    slug: "business-investment",
    title: "Guide to Business Investment",
    category: "Business Basics",
    subtitle: "A foundational guide to evaluating and understanding business and private market investment opportunities.",
    readTime: "7 min read",
    featured: true,
    shortDescription:
      "Explore the fundamentals of business investment, opportunity types, capital requirements, and essential evaluation questions.",
    contentSections: [
      {
        heading: "What is Business Investment?",
        body: [
          "Business investment refers to the allocation of capital into a commercial enterprise, startup, or expansion project with the objective of generating economic value, growth, or income over time.",
          "Unlike public stock markets where shares are traded on open exchanges, private business investments typically involve direct agreements between business founders, operators, and investors seeking strategic alignment.",
        ],
        keyTakeaway:
          "Business investment represents direct capital participation in real operating enterprises with clear growth milestones.",
      },
      {
        heading: "Types of Business Opportunities",
        body: [
          "Private market opportunities take many distinct structures, depending on the stage of the company and the objectives of the founders:",
          "• Direct Business Expansion: Providing capital to an established profitable business to open new facilities, add equipment, or hire key staff.",
          "• Franchise & Dealerships: Partnering with proven brand concepts that provide turnkey operating playbooks and territory rights.",
          "• Joint Ventures & Strategic Partnerships: Combining complementary technical, operational, or distribution capabilities to address a new market.",
          "• Export-Import (EXIM) Partnerships: Financing commodity procurement, testing, and cross-border distribution backed by buyer purchase orders.",
        ],
      },
      {
        heading: "Understanding Investment Requirements",
        body: [
          "Every business opportunity comes with distinct capital and operational requirements:",
          "• Capital Requirement: The exact amount of funding needed to execute the stated milestone (e.g. purchasing a CNC machine or setting up a retail store).",
          "• Working Capital: Day-to-day liquidity required for inventory, staff salaries, utilities, and marketing before revenue stabilizes.",
          "• Time Horizon: The expected duration before the business reaches cash flow positive operations or operational maturity.",
        ],
        keyTakeaway:
          "Always understand both the upfront fixed setup capital and the ongoing working capital buffer required by the business.",
      },
      {
        heading: "Evaluating an Opportunity",
        body: [
          "When exploring any business opportunity, review the foundational building blocks:",
          "1. Market Need: Is the business solving a clear, pressing problem for paying customers?",
          "2. Founder Background: Does the leadership team have relevant domain experience, technical skill, and operational dedication?",
          "3. Unit Economics: Does the business make a sustainable gross margin on every unit sold or service delivered?",
          "4. Competitive Moat: What prevents competitors from easily replicating the product or service?",
        ],
      },
      {
        heading: "Key Questions to Consider",
        body: [
          "Before taking the next step in any opportunity discussion, consider asking:",
          "• What specific milestones will this capital achieve over the next 12 to 24 months?",
          "• What are the primary operational risks, and how does the management team plan to mitigate them?",
          "• How is communication, reporting, and strategic involvement structured between the business and investors?",
        ],
      },
    ],
  },
  {
    slug: "venture-capital",
    title: "Guide to Venture Capital",
    category: "Growth Capital",
    subtitle: "Understanding early-stage and growth-stage equity funding for high-potential technology enterprises.",
    readTime: "8 min read",
    featured: true,
    shortDescription:
      "Learn what venture capital is, who seeks VC funding, funding round stages, and how investors evaluate scalable businesses.",
    contentSections: [
      {
        heading: "What is Venture Capital?",
        body: [
          "Venture Capital (VC) is a form of private equity financing provided by professional funds, angel syndicates, and institutional firms to early-stage, high-growth startups with large addressable markets.",
          "In exchange for capital, venture investors typically receive equity ownership or convertible instruments (like SAFEs and convertible notes) in the emerging enterprise.",
        ],
        keyTakeaway:
          "Venture capital is tailored for scalable business models capable of achieving rapid national or global market adoption.",
      },
      {
        heading: "Who Typically Seeks VC?",
        body: [
          "Venture capital is not suitable for every business model. It is designed specifically for companies with:",
          "• High Scalability: Software, deep tech, clean tech, or platform models where revenue can grow much faster than headcount or physical assets.",
          "• Large Addressable Market: Markets with multi-billion-dollar annual potential where a leading player can capture meaningful market share.",
          "• Strong Technology or IP: Proprietary software, algorithms, or patentable innovations that create high barriers to entry.",
        ],
      },
      {
        heading: "Funding Rounds Explained",
        body: [
          "VC funding typically progresses through sequential stages:",
          "• Pre-Seed & Seed: Initial capital to build the minimum viable product (MVP), conduct initial user testing, and establish product-market fit.",
          "• Series A: Capital dedicated to scaling the initial business model, building out the sales team, and refining customer acquisition economics.",
          "• Series B & Beyond: Growth-stage funding to expand to new geographic markets, launch complementary product lines, or pursue strategic acquisitions.",
        ],
      },
      {
        heading: "What Investors Evaluate",
        body: [
          "Professional investors focus on several core evaluation dimensions:",
          "1. Team Capability: Resilience, domain expertise, coachability, and execution velocity of the founding team.",
          "2. Traction & Engagement: Customer retention, usage frequency, Net Promoter Score (NPS), and organic word-of-mouth growth.",
          "3. Unit Economics: Customer Acquisition Cost (CAC) compared to Customer Lifetime Value (LTV), gross margins, and payback periods.",
        ],
        keyTakeaway:
          "Execution capability and customer retention metrics are often prioritized over raw user signups.",
      },
      {
        heading: "Preparing Your Business",
        body: [
          "Founders seeking venture investment should prepare concise documentation:",
          "• Executive Pitch Deck: 10-12 slides highlighting the problem, solution, market size, traction, business model, team, and funding ask.",
          "• Clear Financial Plan: Realistic projections reflecting unit economics, hiring plans, and runway duration.",
          "• Transparent Governance: Clean cap table structure, verified corporate incorporation, and intellectual property assignment agreements.",
        ],
      },
    ],
  },
  {
    slug: "angel-investment",
    title: "Guide to Angel Investment",
    category: "Early Stage",
    subtitle: "How angel investors support visionary entrepreneurs with catalytic early-stage funding and strategic guidance.",
    readTime: "6 min read",
    featured: true,
    shortDescription:
      "Discover the role of angel investors, how angel rounds work, preparation tips for founders, and what angels look for.",
    contentSections: [
      {
        heading: "What is Angel Investment?",
        body: [
          "An angel investor is a high-net-worth individual who provides financial backing to early-stage entrepreneurs, often in exchange for equity ownership or convertible debt.",
          "Unlike institutional VC funds that invest third-party pooled capital, angel investors deploy their own personal wealth and often bring hands-on industry expertise, mentorship, and commercial introductions.",
        ],
        keyTakeaway:
          "Angel investors provide vital early-stage capital when traditional institutional funding may not yet be accessible.",
      },
      {
        heading: "How Angel Investment Works",
        body: [
          "Angel investment often happens through individual checks or organized angel networks and syndicates:",
          "• Individual Angels: Single operators or experienced founders investing directly in early vision and prototypes.",
          "• Angel Syndicates: Groups of angels pooling smaller ticket sizes together behind a designated lead angel.",
          "• Investment Instruments: Commonly structured using Simple Agreements for Future Equity (SAFE), convertible promissory notes, or direct equity shares.",
        ],
      },
      {
        heading: "What Entrepreneurs Should Prepare",
        body: [
          "Founders approaching angel investors should prepare transparent and focused materials:",
          "1. A concise 1-page executive overview detailing the core thesis and target customer.",
          "2. A live prototype, product demo, or proof-of-concept proving technical feasibility.",
          "3. Transparent clarity on how the angel's capital will bridge the company to its next major milestone.",
        ],
      },
      {
        heading: "What Investors Typically Consider",
        body: [
          "Angels often look for alignment beyond raw financial metrics:",
          "• Founder Passion & Integrity: Authentic commitment to solving the problem and overcoming early startup hurdles.",
          "• Personal Expertise Fit: Opportunities in industries where the angel has deep experience and can actively add value.",
          "• Reasonable Valuation: Balanced terms that align founder incentives with sensible early-stage risk-reward ratios.",
        ],
      },
    ],
  },
  {
    slug: "business-partnerships",
    title: "Guide to Business Partnerships",
    category: "Collaborative Growth",
    subtitle: "Structuring collaborative joint ventures, distribution alliances, and strategic business relationships.",
    readTime: "7 min read",
    featured: false,
    shortDescription:
      "Explore partnership types, why businesses collaborate, finding compatible partners, and building sustainable commercial relationships.",
    contentSections: [
      {
        heading: "What is a Business Partnership?",
        body: [
          "A business partnership is a collaborative relationship between two or more independent enterprises or individuals pooling capital, expertise, distribution channels, or assets to achieve mutual commercial objectives.",
          "Partnerships allow organizations to expand their reach, optimize operational costs, and enter new markets much faster than building from scratch.",
        ],
        keyTakeaway:
          "Strategic partnerships allow complementary businesses to create combined value far exceeding what either could achieve alone.",
      },
      {
        heading: "Types of Partnerships",
        body: [
          "Common business partnership formats include:",
          "• Joint Ventures (JV): Creating a distinct commercial entity jointly owned by both partners to execute a specific project or market entry.",
          "• Distribution & Channel Alliances: One company manufactures products while the partner provides regional retail distribution or enterprise sales access.",
          "• Technology & Integration Partnerships: Connecting complementary software platforms to provide seamless end-to-end user workflows.",
          "• Sourcing & Supply Alliances: Long-term agreements between raw material producers and manufacturers ensuring price stability and quality.",
        ],
      },
      {
        heading: "Why Businesses Partner",
        body: [
          "Organizations pursue partnerships for several strategic benefits:",
          "1. Speed to Market: Access established customer bases without spending years building brand presence.",
          "2. Risk Sharing: Dividing initial capital investments and operational risks across multiple parties.",
          "3. Synergistic Capabilities: Marrying strong technical innovation with seasoned operational and distribution prowess.",
        ],
      },
      {
        heading: "Finding and Evaluating the Right Partner",
        body: [
          "When evaluating a potential partner, look for complementary strengths rather than identical setups:",
          "• Cultural and Ethical Alignment: Shared values regarding transparency, customer trust, and commercial integrity.",
          "• Defined Roles & Responsibilities: Clear delineation of who manages day-to-day operations, finance, marketing, and client relationships.",
          "• Legal Structure: Formal agreements outlining profit sharing, dispute resolution, intellectual property ownership, and exit provisions.",
        ],
      },
    ],
  },
  {
    slug: "business-franchise",
    title: "Guide to Business Franchise",
    category: "Franchise & Retail",
    subtitle: "A practical guide to evaluating franchise models, brand licensing, location criteria, and operational playbooks.",
    readTime: "7 min read",
    featured: false,
    shortDescription:
      "Understand how franchising works, franchise models, investment considerations, brand enablement, and location selection.",
    contentSections: [
      {
        heading: "What is Franchising?",
        body: [
          "Franchising is a business model where a brand owner (the franchisor) grants an independent entrepreneur (the franchisee) the legal right to operate a business using the brand's name, systems, trademarks, and operating playbook.",
          "In exchange, the franchisee typically pays an initial franchise fee along with ongoing royalties or product purchase margins.",
        ],
        keyTakeaway:
          "Franchising offers a proven business blueprint with established brand recognition, reducing the trial-and-error of starting from zero.",
      },
      {
        heading: "Franchise Models Explained",
        body: [
          "The most common franchise operating formats include:",
          "• FOFO (Franchise Owned, Franchise Operated): The franchisee invests capital and actively manages day-to-day operations.",
          "• FOCO (Franchise Owned, Company Operated): The investor provides setup capital while the parent brand manages daily staff and operations.",
          "• Master Franchise: An entrepreneur acquires exclusive rights to sub-franchise and develop an entire state, region, or territory.",
        ],
      },
      {
        heading: "Investment Considerations",
        body: [
          "When assessing a franchise opportunity, calculate the total comprehensive cost:",
          "1. Initial Franchise Fee: Upfront fee covering brand licensing, initial training, and setup support.",
          "2. Store Fitout & Interior: Architectural design, specialized machinery, refrigeration, POS systems, and signage.",
          "3. Initial Inventory: First batch of branded raw materials, ingredients, or merchandise.",
          "4. Working Capital Buffer: 3-6 months of operating expenses (rent, electricity, salaries) during store ramp-up.",
        ],
      },
      {
        heading: "Brand Support and Enablement",
        body: [
          "A quality franchisor should provide comprehensive ongoing support:",
          "• Standard Operating Procedures (SOPs): Clear manuals for customer service, food preparation, hygiene, and billing.",
          "• Centralized Supply Chain: Guaranteed access to proprietary ingredients or merchandise with quality consistency.",
          "• Marketing Campaigns: National brand advertising, social media promotions, and local grand opening collateral.",
        ],
      },
      {
        heading: "Location & Site Selection",
        body: [
          "Location is the single most critical factor determining retail and food franchise success:",
          "• Target Footfall: High-density commercial streets, tech parks, shopping malls, or affluent residential hubs.",
          "• Visibility & Access: Clear street frontage, easy parking, and convenient pickup access for delivery drivers.",
          "• Rental Feasibility: Rent should ideally not exceed 12-15% of expected gross monthly revenues for sustainable profitability.",
        ],
      },
    ],
  },
];
