import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export function useDeleteAccount() {
    const navigate = useNavigate();

    const deleteAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userId: user.id },
      });

      if (error) {
        console.error(error);
        alert("탈퇴 실패");
      } else {
        alert("탈퇴 완료");
        await supabase.auth.signOut();
        navigate("/");
      }
    };

    return deleteAccount;
}
