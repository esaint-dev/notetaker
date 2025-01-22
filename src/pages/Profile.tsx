import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { AuthenticatedNavbar } from "@/components/navigation/AuthenticatedNavbar";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({ id: user.id })
            .select()
            .single();

          if (createError) throw createError;
          profileData = newProfile;
        } else {
          throw profileError;
        }
      }

      setUser(user);
      setProfile(profileData);
      setAvatarUrl(profileData?.avatar_url);
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const initialFormData = {
    full_name: profile?.full_name || "",
    email: profile?.email || user.email,
    phone_number: profile?.phone_number || "",
    social_links: {
      twitter: profile?.social_links?.twitter || "",
      linkedin: profile?.social_links?.linkedin || "",
      github: profile?.social_links?.github || "",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar 
        avatarUrl={avatarUrl} 
        profileName={profile?.full_name}
      />

      <div className="container max-w-2xl py-8 mt-24">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your profile information and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <AvatarUpload
              userId={user.id}
              avatarUrl={avatarUrl}
              profileName={profile?.full_name}
              onAvatarUpdate={(url) => setAvatarUrl(url)}
            />
            <ProfileForm
              userId={user.id}
              initialData={initialFormData}
              onProfileUpdate={getProfile}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;