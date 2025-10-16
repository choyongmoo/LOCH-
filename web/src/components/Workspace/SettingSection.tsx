interface Props {
  title: string;
  children?: React.ReactNode;
}

export default function SettingsSection({ title, children }: Props) {
    return (
        <div className="border-b border-gray-200 dark:border-[#23242e] px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
            {/* 제목 */}
            <div className="flex items-center">
                <div className="w-8" />
                <div className="flex-1 font-semibold text-gray-700 dark:text-gray-200">{title}</div>
            </div>
            
            {/* 내용 */}
            {children && <div className="mt-2">{children}</div>}
        </div>
    );
}
