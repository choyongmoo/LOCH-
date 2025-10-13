import { useModal } from "@/store/useModalStore";
import { Button } from "@/components/common/ui/button";
import { useNavigate } from "react-router";

export function ChangeNameButton({className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("changeName")}>변경</Button>
}

export function EditBioButton({ className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("editBio")}>편집</Button>
}

export function EditColorButton({ className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("editColor")}>변경</Button>
}

export function EditCameraButton({ className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("editCamera")}>변경</Button>
}

export function CameraTestButton({ className = ""}: {className?: string}) {
    const navigate =useNavigate();
    return <Button variant="ghost" className={`${className}`} onClick={() => navigate("/workspace/setting")}>테스트</Button>
}

export function MicTestButton({ className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("micTest")}>테스트</Button>
}

export function EditMicButton({ className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("editMic")}>변경</Button>
}

export function EditPWButton({ className = "", disabled = false}: {className?: string, disabled?: boolean}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("editPW") } disabled={disabled}>변경</Button>
}

export function LogOutButton({ className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("logout")}>로그아웃</Button>
}

export function DeleteUserButton({ className = ""}: {className?: string}) {
    const { openModal } = useModal();
    return <Button variant="ghost" className={`${className}`} onClick={() => openModal("deleteUser")}>탈퇴</Button>
}
