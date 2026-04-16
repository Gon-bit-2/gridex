import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Databases from "./components/Databases";
import Features from "./components/Features";
import Comparison from "./components/Comparison";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Databases />
        <Features />
        <Comparison />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
