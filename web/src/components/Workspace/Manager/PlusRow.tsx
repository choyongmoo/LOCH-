import AddGroupButton from "../Buttons/AddGroupButton";

export default function PlusRow({ onClick }: { onClick?: () => void }) {
    return (
        <div className="flex items-center px-2 border-b border-gray-200 dark:border-[#23242e] min-h-[52px]">
            <div className="w-8" />
            <div className="flex-1 flex items-center justify-center min-w-0">
                <AddGroupButton
                    className="bg-gray-200 dark:bg-[#2A2B32] text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#343746]"
                    onClick={onClick}
                />
            </div>
            <div className="w-8" />
        </div>
    );
}