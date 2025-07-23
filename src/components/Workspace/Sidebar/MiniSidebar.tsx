import { useState } from "react";
import { useNavigate } from "react-router";
import AddGroupButton from "./AddGroupButton"
import GroupItem from "./GroupItem"
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "../../common/ui/button";

const MiniSidebar = () => {
  const navigate = useNavigate(); 
  const [groups, setGroups] = useState<string[]>(["Group A", "Group B"]);
  const { toggleTheme } = useThemeStore();

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
        
      {/* 다크모드,화이트모드 */}
        <div className="flex items-center gap-4 pointer-events-auto">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          <Sun className="scale-130 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-110" />
        </Button>
       </div>
    </div>
  );
};

export default MiniSidebar
