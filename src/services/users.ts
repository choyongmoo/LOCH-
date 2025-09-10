import { supabase } from "@/utils/supabase";

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

// TODO: This is a temporary solution to upload an avatar to the user's profile.
export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split(".").pop();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("User not found");

  const filePath = `${user.id}/avatar.${fileExt}`;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
    upsert: true,
  });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  // Get public URL
  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  console.log("Generated public URL:", data.publicUrl);

  // Update profile with new avatar URL
  const { data: updateData, error: updateError } = await supabase
    .from("profiles")
    .upsert({ id: userId, avatar_url: data.publicUrl }, { onConflict: "id" })
    .select();

  if (updateError) {
    console.error("Update error:", updateError);
    console.error("Update data:", updateData);
    throw updateError;
  }

  console.log("Successfully updated profile:", updateData);
  return data.publicUrl;
}
