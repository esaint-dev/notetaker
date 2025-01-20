import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        // Create profile for new user
        if (session?.user) {
          const { error } = await supabase
            .from('profiles')
            .insert({ id: session.user.id });
          
          if (error) {
            console.error('Error creating profile:', error);
            setErrorMessage("Error creating user profile");
            return;
          }
        }
        navigate("/notes");
      } else if (event === "SIGNED_OUT") {
        // Clear any error messages when signing out
        setErrorMessage("");
      }
    });

    // Listen for auth errors
    const authListener = supabase.auth.onError((error) => {
      console.error('Auth error:', error);
      if (error.message.includes('rate_limit')) {
        toast({
          variant: "destructive",
          title: "Please wait",
          description: "For security purposes, please wait a minute before trying again.",
        });
      } else {
        setErrorMessage(error.message);
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Start your journey with Founder Notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'rgb(var(--accent))',
                      brandAccent: 'rgb(var(--accent))',
                    },
                  },
                },
              }}
              providers={["google"]}
              redirectTo={`${window.location.origin}/auth/callback`}
              view="sign_up"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;