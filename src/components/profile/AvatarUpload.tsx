import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadProps {
  userId: string;
  avatarUrl: string | null;
  profileName: string | null;
  onAvatarUpdate: (url: string) => void;
}

export const AvatarUpload = ({ userId, avatarUrl, profileName, onAvatarUpdate }: AvatarUploadProps) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || ""} />
        <AvatarFallback>
          {profileName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={uploadingAvatar}
        >
          <label className="cursor-pointer flex items-center gap-2">
            <Camera className="h-4 w-4" />
            {uploadingAvatar ? "Uploading..." : "Change Avatar"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadAvatar}
              disabled={uploadingAvatar}
            />
          </label>
        </Button>
      </div>
    </div>
  );
};