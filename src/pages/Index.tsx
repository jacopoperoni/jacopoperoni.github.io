import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Publications from "@/components/Publications";
import Conferences from "@/components/Conferences";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Publications />
        <Conferences />
        <Contact />
      </main>
      <footer className="py-8 bg-primary text-primary-foreground">
        <div className="container px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Jacopo Peroni. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
