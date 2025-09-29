import { Button } from "@/components/common/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/common/ui/sheet";
import { useModal } from "@/store/useModal";
import type { EditModalProps } from "@/types/workspace";

export default function EditModal({modalType, title, description, children, onConfirm, confirmLabel, cancelLabel, confirmDisabled}: EditModalProps) {
    const { currentModal , closeModal } = useModal();
    const isOpen = currentModal === modalType;
    
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeModal()}>
            <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-col gap-3">
                    {children}
                </div>
                {(onConfirm || cancelLabel) && (
                    <SheetFooter>
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={closeModal}>
                                {cancelLabel || "취소"}
                            </Button>
                            {onConfirm && (
                                <Button onClick={() => {onConfirm(); closeModal();}} disabled={confirmDisabled}>
                                    {confirmLabel || "확인"}
                                </Button>
                            )}
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}