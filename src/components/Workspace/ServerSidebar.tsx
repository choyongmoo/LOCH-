import { Power } from "lucide-react";
import AddGroupButton from "./Buttons/AddGroupButton";
import { ThemeToggleButton } from "./Buttons/ThemeTogglebutton";
import { Button } from "../common/ui/button";
import { useModal } from "@/store/useModal";
import CreateServerModal from "./Modals/CreateServerModal";
import EditModal from "./Modals/EditModal";

export default function ServerSidebar() {    
    const { currentModal, closeModal } = useModal();

    return (
        <div className="flex flex-col justify-between h-full items-center">
            <div className="pt-4 flex flex-col gap-2">
                <AddGroupButton />
                <ThemeToggleButton />
            </div>
            <div className="pb-4">
                <Button variant="outline" size="icon" title="로그아웃" onClick={() => useModal.getState().openModal("logout")}>
                    <Power />
                </Button>
            </div>
            { currentModal === "addGroup" && <CreateServerModal close={closeModal} /> }
            { currentModal === "logout" && <EditModal modalType="logout" title="로그아웃" description="현재 계정에서 로그아웃 하시겠습니까?" onConfirm={() => {}} confirmLabel="로그아웃"/> }            
        </div>
    )
}