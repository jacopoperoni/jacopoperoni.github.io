import { InlineMath } from "react-katex";

const Conferences = () => {
  const conferences = [
    {
      title: "Agentic AI for Mathematics",
      kind: "AI Talk",
      institution: "RTG DFG Retreat, Bremerhaven",
      date: "October 2026",
    },
    {
      title: (
        <>
          Quasi shift invariance of <InlineMath math="\Phi^4" /> measures
        </>
      ),
      kind: "Short Talk, Japanese German Conference in Stochastic Analysis",
      institution: "University of Bielefeld",
      date: "September 2026",
    },
    {
      title: "Quasi-translation invariance for non-Gaussian measures",
      kind: "Group Seminar",
      institution: "University of Münster",
      date: "June 2025",
    },
  ];

  return (
    <section id="conferences" className="py-16 bg-background">
      <div className="container px-4 max-w-5xl">
        <h2 className="mb-8 text-4xl font-bold text-foreground font-serif">Talks</h2>
        <ul className="divide-y divide-border border-t border-b border-border">
          {conferences.map((conf, index) => (
            <li key={index} className="py-3">
              <span className="text-card-foreground font-serif">{conf.title}</span>
              <span className="text-muted-foreground">
                {" "}— {conf.kind}, <strong className="font-semibold text-card-foreground">{conf.institution}</strong>, {conf.date}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Conferences;
