import { useAuthStore } from "@/store/useAuthStore";

export const useDeleteAccount = () => {
  const { userId, logout } = useAuthStore();

  const deleteAccount = async () => {
    if (!userId) return;

    const confirmed = confirm("정말 계정을 삭제하시겠습니까? 모든 데이터가 삭제됩니다.");
    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:5173/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        alert("계정이 성공적으로 삭제되었습니다.");
        logout();
        window.location.href = "/";
      } else {
        alert("삭제 실패: " + data.error);
      }
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다: " + e);
    }
  };

  return { deleteAccount };
};
