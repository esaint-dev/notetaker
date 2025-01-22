import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, LogIn, LogOut, Rocket, Target, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', session.user.id)
          .single();
        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">Founder Notes</div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button onClick={() => navigate("/notes")}>My Notes</Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'User'} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.full_name && (
                          <p className="font-medium">{profile.full_name}</p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")}>Get Started</Button>
              </>
            )}
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
            <div className="grid md:grid-cols-3 gap-8 relative">
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
  <div className="p-6 rounded-lg bg-background border purple-blur">
    <Icon className="w-12 h-12 text-accent mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Landing;