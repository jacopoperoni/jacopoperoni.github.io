import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

const Teaching = () => {
  const teaching = [
    {
      name: "TA for Partial Differential Equations II",
      location: "University of Münster",
      date: "2026 Fall"
    }
  ];

  return (
    <section id="teaching" className="py-20 bg-background">
      <div className="container px-4 max-w-5xl">
        <h2 className="mb-12 text-4xl font-bold text-foreground font-serif">Teaching</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {teaching.map((conf, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border bg-card">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-card-foreground font-serif">
                  {conf.name}
                </h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{conf.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{conf.date}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Teaching;
