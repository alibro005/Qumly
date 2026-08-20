import Navbar from "../components/common/Navbar";
import Hero from "../components/common/Hero";
import HowItWorks from "../components/common/How";
import Features from "../components/common/Features";
import Preview from "../components/common/Preview";
import Compatibility from "../components/common/Compatibility";
import Footer from "../components/common/Footer";

function Landing() {
  return (
    <div className="landing">
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Preview />
        <Compatibility />
      </main>

      <Footer />
    </div>
  );
}

export default Landing;
