import { useEffect } from "react";
import { useReveal } from "./hooks/useReveal.js";
import IconSprite from "./components/IconSprite.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Stack from "./components/Stack.jsx";
import Services from "./components/Services.jsx";
import Projects from "./components/Projects.jsx";
import WhySolana from "./components/WhySolana.jsx";
import Products from "./components/Products.jsx";
import Process from "./components/Process.jsx";
import About from "./components/About.jsx";
import Team from "./components/Team.jsx";
import Pricing from "./components/Pricing.jsx";
import Faq from "./components/Faq.jsx";
import Contact from "./components/Contact.jsx";
import CtaBand from "./components/CtaBand.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  useEffect(() => {
    document.documentElement.classList.remove("no-js");
  }, []);

  useReveal();

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <IconSprite />

      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <Nav />

      <main id="main">
        <Hero />
        <Stack />
        <Services />
        <Projects />
        <WhySolana />
        <Products />
        <Process />
        <About />
        <Team />
        <Pricing />
        <Faq />
        <Contact />
        <CtaBand />
      </main>

      <Footer />
    </>
  );
}
