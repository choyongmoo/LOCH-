import './App.css'
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import DemoSection from "./components/DemoSection";
import Stats from "./components/Stats";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-root font-sans text-gray-900 bg-white">
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
        <DemoSection />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
