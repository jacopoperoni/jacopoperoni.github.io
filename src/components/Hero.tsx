import PDEBackground from "@/components/PDEBackground";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">

      {/* BACKGROUND PDE */}
      <PDEBackground />

      <div className="absolute bottom-2 right-3 text-xs md:text-sm 
                    text-white/80 font-light tracking-wide 
                    pointer-events-none select-none">
      Dynamical Φ⁴₂
</div>

      {/* GRADIENT OVERLAY (optional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 z-5"></div>

      {/* HERO TEXT */}
      <div className="container relative z-10 px-4 py-20 text-center">
        <h1 className="mb-4 text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground font-serif">
          Jacopo Peroni
        </h1>
        <p className="mb-2 text-xl md:text-2xl text-primary-foreground/90 font-medium">
          PhD Student in Mathematics
        </p>
        <p className="text-lg md:text-xl text-primary-foreground/80">
          University of Münster
        </p>
      </div>

    </section>
  );
};

export default Hero;

