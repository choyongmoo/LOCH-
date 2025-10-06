import { useModal } from "@/store/useModalStore";
import { Button } from "../../common/ui/button";
import type { AddGroupButtonProps } from "@/types/workspace";

export default function AddGroupButton({ className = "" }: AddGroupButtonProps) {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() => openModal("addGroup")}
      className={`w-10 h-10 rounded-md flex items-center justify-center ${className}`}
    >
      +
    </Button>
  );
}