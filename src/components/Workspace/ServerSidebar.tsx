import { Power } from "lucide-react";
import AddGroupButton from "./Buttons/AddGroupButton";
import { ThemeToggleButton } from "./Buttons/ThemeTogglebutton";
import { Button } from "../common/ui/button";
import { useModal } from "@/store/useModal";
import CreateServerModal from "./Modals/CreateServerModal";

export default function ServerSidebar() {    
    const { currentModal, closeModal } = useModal();

    return (
        <div className="flex flex-col justify-between h-full items-center">
            <div className="pt-4 flex flex-col gap-2">
                <AddGroupButton />
                <ThemeToggleButton />
            </div>
            <div className="pb-4">
                <Button variant="outline" size="icon" title="로그아웃">
                    <Power />
                </Button>
            </div>
            { currentModal === "addGroup" && <CreateServerModal close={closeModal} /> }
        </div>
    )
}