import type { ButtonBaseProps } from "@/types/workspace";
import { SidebarMenuSubButton } from "../../common/ui/sidebar";


export default function MenuButtonBase({ children, onClick, className = "" }: ButtonBaseProps) {
    return (
        <SidebarMenuSubButton
            onClick={onClick}
            className={`
                bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10
                cursor-default
                ${className}
            `}
            >
            {children}
        </SidebarMenuSubButton>
  );
}