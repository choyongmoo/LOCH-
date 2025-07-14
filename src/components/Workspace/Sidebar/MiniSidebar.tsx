import { useState } from "react";
import { useNavigate } from "react-router";
import AddGroupButton from "./AddGroupButton"
import GroupItem from "./GroupItem"

const MiniSidebar = () => {
  const navigate = useNavigate(); 
  const [groups, setGroups] = useState<string[]>(["Group A", "Group B"]);

  const handleAddGroup = () => {
    const newGroupName = `Group ${String.fromCharCode(65 + groups.length)}`;
    setGroups([...groups, newGroupName]);
  };
  return (
    <div className="h-full text-white flex flex-col items-center py-4 space-y-4 w-14 bg-[#1E1F2B] border-r border-gray-700">
      {/* 로고 */}
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center"
      >
        loch
      </button>

      {/* 그룹 리스트 */}
      <div className="flex flex-col items-center gap-0 mb-0">
        {groups.map((group, i) => (
          <GroupItem key={i} name={group} />
        ))}
      </div>

      {/* + 버튼 */}
      <AddGroupButton onClick={handleAddGroup} />
  
    </div>
  );
};

export default MiniSidebar
