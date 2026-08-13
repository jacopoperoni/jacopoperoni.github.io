const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container px-4 max-w-4xl">
        <h2 className="mb-8 text-4xl font-bold text-foreground font-serif">About Me</h2>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-start">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-foreground/80 leading-relaxed mb-4">
	    I am a PhD student in the Mathematics Cluster of Excellence at the University of Münster under the supervision of <a href="https://www.uni-muenster.de/AMM/en/weber/index.shtml">Prof. Hendrik Weber</a> since October 2025. 
            </p>
	    <p className="text-lg text-foreground/80 leading-relaxed mb-4">
             My research interests lie in the intersection between mathematical physics and probability.
	     More precisely singular SPDEs and their use to construct rigorously and study QFT's measures.
	     I have a secondary interest in dynamical systems and statistical mechanics.   
	     I am an enthusiast of physics.
	     </p>
	    <p className="text-lg text-foreground/80 leading-relaxed mb-4">
              Before starting my PhD, I completed my master's degree at EPFL under the supervision of <a href="https://www.hairer.org/"> Prof. Martin Hairer</a>. 
            I completed my bachelor's degree at University of Milan.
	      </p>
	    <p className="text-lg text-foreground/80 leading-relaxed mb-4">
		I love music (open to jam!) and mountains.
	    </p>
          </div>

          <img
            src="/assets/profile_pic.JPG"
            alt="Jacopo Peroni"
            className="w-full aspect-[3/4] object-cover object-[80%_50%]"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
