import { useState } from "react";
//import { useNavigate } from "react-router";
import AddGroupButton from "./AddGroupButton"
import GroupItem from "./GroupItem"
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "../../common/ui/button";

const MiniSidebar = () => {
  //const navigate = useNavigate(); //나중에 쓸거임
  const [groups, setGroups] = useState<string[]>(["Group A", "Group B"]);
  const { toggleTheme } = useThemeStore();

  const handleAddGroup = () => {
    const newGroupName = `Group ${String.fromCharCode(65 + groups.length)}`;
    setGroups([...groups, newGroupName]);
  };
  return (
    <div className="min-h-screen flex flex-col items-center py-4 w-14 bg-gray-100 dark:bg-[#1E1F2B] border-r border-gray-300 dark:border-gray-700">
      {/* 그룹 리스트 */}
      <div className="flex flex-col items-center gap-0 mb-0 font-bold">
        {groups.map((group, i) => (
          <GroupItem key={i} name={group} />
        ))}
        
      {/* + 버튼 */}
      <AddGroupButton onClick={handleAddGroup} />
      </div>

      {/* 다크모드,화이트모드 */}
        <div className="flex items-center gap-4 pointer-events-auto mt-2">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          <Sun className="scale-130 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-110" />
        </Button>
       </div>
    </div>
  );
};

export default MiniSidebar
