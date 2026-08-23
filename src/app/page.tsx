import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ValueCards } from "@/components/value-cards";
import { ComingSoonCard } from "@/components/coming-soon-card";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-wenture-bg relative overflow-x-hidden">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* SECTION 2 & 3: Hero & Interactive Network Visual */}
        <Hero />

        {/* SECTION 4: Three Core Value Points */}
        <ValueCards />

        {/* SECTION 5: Coming Soon Progress & Early Access */}
        <ComingSoonCard />

        {/* SECTION 6: Compact Direct Contact Channels */}
        <ContactSection />
      </main>

      {/* SECTION 7: Footer & Legal Modal */}
      <Footer />
    </div>
  );
}
