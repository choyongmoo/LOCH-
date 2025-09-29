import type { ReactNode } from "react";

interface Props {
    label: string;
    value: ReactNode;
    action?: ReactNode;
}

export default function ProfileRow({ label, value, action }: Props) {
    return (
        <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4 last:mb-0 last:pb-0 last:border-b-0">
            <div className="col-span-2 text-gray-500 dark:text-gray-300">{label}</div>
            <div className="col-span-4 text-gray-900 dark:text-white">{value}</div>
            <div className="col-span-1 text-right">{action}</div>
        </div>
    )
}