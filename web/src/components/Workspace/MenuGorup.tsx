import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub } from "../common/ui/sidebar";
import type { MenuGroupProps  } from "@/types/workspace";

export default function MenuGroup({ title, children }: MenuGroupProps) {
    return (
        <SidebarMenuItem>
        <SidebarMenuButton className="hover:bg-transparent dark:hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-default">
            {title}
        </SidebarMenuButton>
        <SidebarMenuSub>
            {children}
        </SidebarMenuSub>
        </SidebarMenuItem>
    );
}
