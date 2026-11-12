import Navigation from "./Navigation";
import Hero from "./hero/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Contact, { SiteFooter } from "./sections/Contact";
import RevealObserver from "./ui/RevealObserver";
import { ScrollProvider } from "@/lib/scroll";

export default function App() {
  return (
    <ScrollProvider>
      <a href="#about" className="sr-only-focusable skip-link">
        Skip to content
      </a>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Contact />
      </main>
      <SiteFooter />
      <RevealObserver />
    </ScrollProvider>
  );
}
