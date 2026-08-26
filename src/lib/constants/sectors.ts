export interface SectorItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: string;
}

export const SECTORS: SectorItem[] = [
  {
    id: "technology",
    name: "Technology",
    icon: "computer",
    description: "Software, SaaS, Cloud, and Digital Infrastructure",
    count: "24 Opportunities",
  },
  {
    id: "food-beverage",
    name: "Food & Beverage",
    icon: "restaurant",
    description: "Cafes, QSR Brands, Cloud Kitchens & Specialty Foods",
    count: "32 Opportunities",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "medical_services",
    description: "Clinics, Diagnostic Centers, HealthTech & Pharma",
    count: "18 Opportunities",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "domain",
    description: "Commercial Spaces, Co-working & Industrial Parks",
    count: "15 Opportunities",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "precision_manufacturing",
    description: "Precision Engineering, CNC, Packaging & Industrial Units",
    count: "20 Opportunities",
  },
  {
    id: "retail",
    name: "Retail",
    icon: "storefront",
    description: "Consumer Brands, Multi-brand Stores & Specialty Outlets",
    count: "28 Opportunities",
  },
  {
    id: "education",
    name: "Education",
    icon: "school",
    description: "Preschools, Coaching Centers, EdTech & Skill Academies",
    count: "14 Opportunities",
  },
  {
    id: "ev-mobility",
    name: "EV & Mobility",
    icon: "electric_car",
    description: "EV Dealerships, Charging Hubs & Fleet Operations",
    count: "16 Opportunities",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: "agriculture",
    description: "Organic Farming, Agro-Processing & Cold Chain",
    count: "19 Opportunities",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: "apparel",
    description: "Apparel Brands, Footwear, Accessories & Boutiques",
    count: "12 Opportunities",
  },
  {
    id: "travel-hospitality",
    name: "Travel & Hospitality",
    icon: "hotel",
    description: "Boutique Stays, Travel Franchises & Tour Services",
    count: "11 Opportunities",
  },
  {
    id: "business-services",
    name: "Business Services",
    icon: "corporate_fare",
    description: "Consulting, Staffing, Digital Agencies & Logistics Support",
    count: "22 Opportunities",
  },
  {
    id: "exim",
    name: "EXIM",
    icon: "public",
    description: "Export-Import Hubs, Commodity Trading & Global Distribution",
    count: "17 Opportunities",
  },
];
