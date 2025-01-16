import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Rocket, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Founder Notes</div>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="py-20 animate-fade-in">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Note-Taking Built for{" "}
              <span className="text-accent">Founders</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Capture ideas, track decisions, and organize your startup journey all
              in one place. Built specifically for the unique needs of founders.
            </p>
            <Button size="lg" onClick={() => navigate("/signup")}>
              Start Free Trial <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Founders Love Us
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Brain}
                title="Thought Organization"
                description="Organize your ideas, market research, and strategic planning in a founder-friendly format."
              />
              <FeatureCard
                icon={Target}
                title="Decision Tracking"
                description="Keep track of key decisions, their context, and outcomes to learn and iterate faster."
              />
              <FeatureCard
                icon={Rocket}
                title="Startup-Focused"
                description="Templates and features designed specifically for startup founders and their unique challenges."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © 2024 Founder Notes. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-lg bg-background border">
    <Icon className="w-12 h-12 text-accent mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Landing;