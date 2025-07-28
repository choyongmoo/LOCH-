type GroupItemProps = {
  name?: string;
};

const GroupItem = ({ name }: GroupItemProps) => {
  return (
    <div className="w-10 h-10 rounded-md bg-gray-800 hover:bg-gray-700 mb-2 cursor-pointer flex items-center justify-center transition-all">
      {/* 아이콘 또는 첫 글자 등 */}
      <span className="text-sm text-white font-bold">{name?.[0] || "G"}</span>
    </div>
  );
};

export default GroupItem;