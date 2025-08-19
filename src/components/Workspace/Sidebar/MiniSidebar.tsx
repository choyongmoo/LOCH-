import { useState } from "react";
//import { useNavigate } from "react-router";
import AddGroupButton from "./AddGroupButton"
import GroupItem from "./GroupItem"
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { Button } from "../../common/ui/button";
import { Input } from "@/components/common/ui/input";

const MiniSidebar = () => {
  //const navigate = useNavigate(); //나중에 쓸거임
  const [groups, setGroups] = useState<string[]>([]);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const { toggleTheme } = useThemeStore();

  const handleAddGroup = () => {
    setIsNameModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsNameModalOpen(false);
    setNewGroupName("");
  };

  const handleConfirmAdd = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    setGroups([...groups, trimmed]);
    setNewGroupName("");
    setIsNameModalOpen(false);
  };
  return (
    <div className="min-h-screen flex flex-col items-center py-4 w-14 bg-gray-100 dark:bg-[#1E1F2B] border-r border-gray-300 dark:border-gray-700">
      {/* 그룹 리스트 */}
      <div className="flex flex-col items-center gap-0 mb-0 font-bold">
        {groups.map((name, idx) => (
          <GroupItem key={`${name}-${idx}`} name={name} />
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

      {isNameModalOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleCloseModal}
          />
          <div className="fixed top-1/2 left-1/2 w-[320px] bg-white dark:bg-[#2F3136] p-4 rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">이름 설정</h3>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">이름</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="서버 이름을 입력하세요"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCloseModal}>취소</Button>
              <Button onClick={handleConfirmAdd} disabled={!newGroupName.trim()}>확인</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniSidebar
