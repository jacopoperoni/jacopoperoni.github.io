const Teaching = () => {
  const teaching = [
    {
      title: "TA for Partial Differential Equations I",
      details: "University of Münster, 2026 Fall",
    },
  ];

  return (
    <section id="teaching" className="py-16 bg-background">
      <div className="container px-4 max-w-5xl">
        <h2 className="mb-8 text-4xl font-bold text-foreground font-serif">Teaching</h2>
        <ul className="divide-y divide-border border-t border-b border-border">
          {teaching.map((item, index) => (
            <li key={index} className="py-3">
              <span className="text-card-foreground font-serif">{item.title}</span>
              <span className="text-muted-foreground"> — {item.details}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Teaching;
