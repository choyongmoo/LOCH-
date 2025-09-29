import ManagerTable from "@/components/Workspace/Manager/ManagerTable";

export default function ManagerPage() {
    return (
        <div className="h-screen w-full min-w-0 bg-gray-100 dark:bg-[#18191c] px-4 md:px-5 py-6 flex flex-col overflow-hidden">
            <ManagerTable />
        </div>
    )
}