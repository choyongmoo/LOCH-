import type { ReactNode } from "react";

interface Props {
    title: string;
    children: ReactNode;
}

export default function ProfileSection({ title, children }: Props) {
    return (
        <div className="w-full mb-8">
            <div className="text-gray-700 dark:text-gray-200 font-semibold">{title}</div>
            <div className="bg-white dark:bg-[#23242e] rounded-r-xl shadow-xl p-4 w-full overflow-y-auto">
                {children}
            </div>
    </div>
    )
}