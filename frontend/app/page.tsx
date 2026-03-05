import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import CitizenScience from "./components/landing/CitizenScience";
import RecentObservations from "./components/landing/RecentObservations";
import CTABanner from "./components/landing/CTABanner";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* dark */}
        <Hero />
        {/* light grey */}
        <HowItWorks />
        {/* dark */}
        <CitizenScience />
        {/* white */}
        <RecentObservations />
        {/* dark */}
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}


