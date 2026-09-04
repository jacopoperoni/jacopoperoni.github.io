import { Button } from "@/components/ui/button";

const Navigation = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xl font-bold text-foreground font-serif hover:text-primary transition-colors"
          >
          </button>
          <div className="flex items-center gap-2 md:gap-4">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('about')}
              className="text-sm md:text-base"
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('publications')}
              className="text-sm md:text-base"
            >
              Publications
            </Button> 
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('conferences')}
              className="text-sm md:text-base"
            >
              Talks
            </Button> 
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('teaching')}
              className="text-sm md:text-base"
            >
              Teaching
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('contact')}
              className="text-sm md:text-base"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
