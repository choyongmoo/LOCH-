// src/pages/Workspace/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
import { Paragraph } from "@/components/common/ui/Paragraph";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/common/ui/sheet";

const ProfilePage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [nickLoading, setNickLoading] = useState(false);
  const [nickError, setNickError] = useState<string | null>(null);
  const [profileBio, setProfileBio] = useState<string | null>(null);
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [bioLoading, setBioLoading] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);
  const [profileColor, setProfileColor] = useState<string | null>(null);
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorInput, setColorInput] = useState("#7e22ce");
  const [colorLoading, setColorLoading] = useState(false);
  const [colorError, setColorError] = useState<string | null>(null);
  const [profileLang, setProfileLang] = useState<"ko" | "en">("ko");
  const [showLangModal, setShowLangModal] = useState(false);
  const [langInput, setLangInput] = useState<"ko" | "en">("ko");
  const [langLoading, setLangLoading] = useState(false);
  const [langError, setLangError] = useState<string | null>(null);
  const [micDevices, setMicDevices] = useState<Array<{ deviceId: string; label: string }>>([]);
  // 선택된 마이크 ID는 별도 표시가 없어 불필요하므로 보관하지 않음
  const [profileMicLabel, setProfileMicLabel] = useState<string | null>(null);
  const [showMicModal, setShowMicModal] = useState(false);
  const [micSelect, setMicSelect] = useState<string>("");
  const [micLoading, setMicLoading] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignOutAndRedirect = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } finally {
      navigate("/", { replace: true });
    }
  };

  // Password change modal states
  const [showPwForm, setShowPwForm] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  const handlePasswordUpdate = async () => {
    setPwError(null);
    setPwMessage(null);
    if (newPw.length < 6) {
      setPwError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      setPwLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) {
        setPwError(error.message);
        return;
      }
      setPwMessage("비밀번호가 변경되었습니다.");
      setShowPwForm(false);
      setNewPw("");
      setConfirmPw("");
    } catch {
      setPwError("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setPwLoading(false);
    }
  };

  // Delete account modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    try {
      setDeleteLoading(true);
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        setDeleteError("로그인 정보가 없습니다.");
        return;
      }
      // Requires an Edge Function named "delete-user" using service role
      const { error } = await supabase.functions.invoke("delete-user", {
        body: { userId },
      });
      if (error) {
        setDeleteError(error.message ?? "삭제에 실패했습니다.");
        return;
      }
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch {
      setDeleteError("삭제 처리 중 오류가 발생했습니다.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNicknameSave = async () => {
    setNickError(null);
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      setNickError("별명을 입력하세요.");
      return;
    }
    try {
      setNickLoading(true);
      const { error } = await supabase.auth.updateUser({ data: { name: trimmed } });
      if (error) {
        setNickError(error.message);
        return;
      }
      setProfileName(trimmed);
      setShowNicknameModal(false);
    } catch {
      setNickError("별명 저장 중 오류가 발생했습니다.");
    } finally {
      setNickLoading(false);
    }
  };

  const handleBioSave = async () => {
    setBioError(null);
    const trimmed = bioInput.trim();
    try {
      setBioLoading(true);
      const { error } = await supabase.auth.updateUser({ data: { bio: trimmed } });
      if (error) {
        setBioError(error.message);
        return;
      }
      setProfileBio(trimmed || null);
      setShowBioModal(false);
    } catch {
      setBioError("소개글 저장 중 오류가 발생했습니다.");
    } finally {
      setBioLoading(false);
    }
  };

  const handleColorSave = async () => {
    setColorError(null);
    const value = colorInput.trim();
    const isHex = /^#([0-9a-fA-F]{6})$/.test(value);
    if (!isHex) {
      setColorError("유효한 16진수 색상(#RRGGBB)을 입력하세요.");
      return;
    }
    try {
      setColorLoading(true);
      const { error } = await supabase.auth.updateUser({ data: { color: value } });
      if (error) {
        setColorError(error.message);
        return;
      }
      setProfileColor(value);
      setShowColorModal(false);
    } catch {
      setColorError("색상 저장 중 오류가 발생했습니다.");
    } finally {
      setColorLoading(false);
    }
  };

  const handleLangSave = async () => {
    setLangError(null);
    try {
      setLangLoading(true);
      const { error } = await supabase.auth.updateUser({ data: { lang: langInput } });
      if (error) {
        setLangError(error.message);
        return;
      }
      setProfileLang(langInput);
      setShowLangModal(false);
    } catch {
      setLangError("언어 저장 중 오류가 발생했습니다.");
    } finally {
      setLangLoading(false);
    }
  };

  const ensureAudioPermissionAndDevices = async (): Promise<
    Array<{ deviceId: string; label: string }>
  > => {
    try {
      // Request minimal audio to reveal device labels
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      stream.getTracks().forEach((t) => t.stop());
      const audioInputs = devices
        .filter((d) => d.kind === "audioinput")
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `마이크 ${idx + 1}`,
        }));
      return audioInputs;
    } catch {
      return [];
    }
  };

  const handleMicSave = async () => {
    setMicError(null);
    if (!micSelect) {
      setMicError("마이크를 선택하세요.");
      return;
    }
    try {
      setMicLoading(true);
      const selected = micDevices.find((d) => d.deviceId === micSelect);
      const { error } = await supabase.auth.updateUser({
        data: {
          micDeviceId: micSelect,
          micDeviceLabel: selected?.label ?? "",
        },
      });
      if (error) {
        setMicError(error.message);
        return;
      }
      setProfileMicLabel(selected?.label ?? null);
      setShowMicModal(false);
    } catch {
      setMicError("마이크 저장 중 오류가 발생했습니다.");
    } finally {
      setMicLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      const nameFromMeta = (data.user?.user_metadata as Record<string, unknown>)?.name as
        | string
        | undefined;
      setProfileName(nameFromMeta ?? data.user?.email?.split("@")[0] ?? null);
      setNicknameInput(nameFromMeta ?? "");
      const bioFromMeta = (data.user?.user_metadata as Record<string, unknown>)?.bio as
        | string
        | undefined;
      const cleanedBio = typeof bioFromMeta === "string" && bioFromMeta.trim().length > 0 ? bioFromMeta : null;
      setProfileBio(cleanedBio);
      setBioInput(bioFromMeta ?? "");
      const colorFromMeta = (data.user?.user_metadata as Record<string, unknown>)?.color as string | undefined;
      const validColor = typeof colorFromMeta === "string" && /^#([0-9a-fA-F]{6})$/.test(colorFromMeta) ? colorFromMeta : null;
      setProfileColor(validColor);
      setColorInput(validColor ?? "#7e22ce");
      const langFromMeta = (data.user?.user_metadata as Record<string, unknown>)?.lang as string | undefined;
      const normalizedLang = langFromMeta === "en" ? "en" : "ko";
      setProfileLang(normalizedLang);
      setLangInput(normalizedLang);

      // Load audio devices and set defaults
      const inputs = await ensureAudioPermissionAndDevices();
      setMicDevices(inputs);
      const micIdFromMeta = (data.user?.user_metadata as Record<string, unknown>)?.micDeviceId as string | undefined;
      const micLabelFromMeta = (data.user?.user_metadata as Record<string, unknown>)?.micDeviceLabel as string | undefined;
      const defaultId = inputs.find((d) => d.deviceId === "default")?.deviceId || inputs[0]?.deviceId || "";
      const nextId = inputs.some((d) => d.deviceId === micIdFromMeta) ? micIdFromMeta! : defaultId;
      const nextLabel = inputs.find((d) => d.deviceId === nextId)?.label || micLabelFromMeta || null;
      setProfileMicLabel(nextLabel);
      setMicSelect(nextId);
    };

    void loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setEmail(session?.user?.email ?? null);
      const nameFromMeta = (session?.user?.user_metadata as Record<string, unknown>)?.name as
        | string
        | undefined;
      setProfileName(nameFromMeta ?? session?.user?.email?.split("@")[0] ?? null);
      const bioFromMeta = (session?.user?.user_metadata as Record<string, unknown>)?.bio as
        | string
        | undefined;
      const cleanedBioFromSession = typeof bioFromMeta === "string" && bioFromMeta.trim().length > 0 ? bioFromMeta : null;
      setProfileBio(cleanedBioFromSession);
      const colorFromSession = (session?.user?.user_metadata as Record<string, unknown>)?.color as string | undefined;
      const validSessionColor = typeof colorFromSession === "string" && /^#([0-9a-fA-F]{6})$/.test(colorFromSession) ? colorFromSession : null;
      setProfileColor(validSessionColor);
      const langFromSession = (session?.user?.user_metadata as Record<string, unknown>)?.lang as string | undefined;
      const normalizedSessionLang = langFromSession === "en" ? "en" : "ko";
      setProfileLang(normalizedSessionLang);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  return (
    <div className="h-screen w-402 flex justify-start items-start bg-[#f8fafc] dark:bg-[#18191c] p-0 m-0">
      <div className="w-full max-w-400 p-8">
        {/* 상단 프로필 */}
        <div className="flex items-center gap-8 mb-8 w-full max-w-none">
          {/* 프로필 이니셜 */}
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow"
            style={{ backgroundColor: profileColor ?? "#7e22ce" }}
          >
            {(profileName ?? email ?? "").charAt(0).toUpperCase()}
          </div>
          {/* 이름, 소개글 */}
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{profileName ?? email ?? ""}</div>
            <div className="text-gray-500 dark:text-gray-300">{profileBio?.trim() ? profileBio : "소개글을 작성해주세요!"}</div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-3 bg-gray-100 dark:bg-[#23242e] rounded mb-8" />

        {/* 정보 테이블 */}
        <div className="w-full">
          <div className="text-gray-700 dark:text-gray-200 font-semibold mb-4">개인</div>
          <div className="bg-white dark:bg-[#23242e] rounded-r-xl shadow-xl p-6 w-full ml-0">
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">별명</div>
              <div className="col-span-4 text-gray-900 dark:text-white">{profileName ?? "설정되지 않음"}</div>
              <div className="col-span-1 text-right">
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  onClick={() => setShowNicknameModal(true)}
                >
                  변경
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">소개글</div>
              <div className="col-span-4 text-gray-900 dark:text-white">{profileBio ?? "설정되지 않음"}</div>
              <div className="col-span-1 text-right">
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  onClick={() => setShowBioModal(true)}
                >
                  편집
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">색상</div>
              <div className="col-span-4 text-gray-900 dark:text-white flex items-center gap-2">
                <span
                  className="inline-block size-5 rounded"
                  style={{ backgroundColor: profileColor ?? "#7e22ce" }}
                />
                {!profileColor && <span>설정되지 않음</span>}
              </div>
              <div className="col-span-1 text-right">
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  onClick={() => setShowColorModal(true)}
                >
                  변경
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">언어</div>
              <div className="col-span-4 text-gray-900 dark:text-white">{profileLang === "en" ? "English" : "한국어"}</div>
              <div className="col-span-1 text-right">
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  onClick={() => setShowLangModal(true)}
                >
                  변경
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">마이크</div>
              <div className="col-span-4 text-gray-900 dark:text-white">{profileMicLabel ?? "설정되지 않음"}</div>
              <div className="col-span-1 text-right">
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  onClick={() => setShowMicModal(true)}
                >
                  변경
                </button>
              </div>
            </div>
          </div>          
        </div>

        <br />
        {/* 구분선 */}
        <div className="h-3 bg-gray-100 dark:bg-[#23242e] rounded mb-8" />

        {/* 정보 테이블 */}
        <div className="w-full">
          <div className="text-gray-700 dark:text-gray-200 font-semibold mb-4">계정</div>
          <div className="bg-white dark:bg-[#23242e] rounded-r-xl shadow-xl p-6 w-full ml-0">
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">이메일</div>
              <div className="col-span-4 text-gray-900 dark:text-white">{email ?? "설정되지 않음"}</div>
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-2">
              <div className="col-span-2 text-gray-500 dark:text-gray-300">비밀번호 변경</div>
              <div className="col-span-4 text-gray-900 dark:text-white">비밀번호를 변경할 수 있습니다</div>
              <div className="col-span-1 text-right">
                <button
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  onClick={() => setShowPwForm(true)}
                >
                  변경
                </button>
              </div>
            </div>
            {/* Password change modal */}
            <Sheet open={showPwForm} onOpenChange={setShowPwForm}>
              <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>비밀번호 변경</SheetTitle>
                  <SheetDescription>새 비밀번호를 입력해 주세요.</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-col gap-3">
                  <Input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void handlePasswordUpdate();
                      }
                    }}
                  />
                  {pwError && (
                    <Paragraph className="text-red-500 text-sm">{pwError}</Paragraph>
                  )}
                  {pwMessage && (
                    <Paragraph className="text-green-600 text-sm">{pwMessage}</Paragraph>
                  )}
                </div>
                <SheetFooter>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setShowPwForm(false)}
                      className="px-4"
                    >
                      취소
                    </Button>
                    <Button onClick={handlePasswordUpdate} disabled={pwLoading} className="px-4">
                      {pwLoading ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e] pb-4 mb-4">
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleSignOutAndRedirect}
                  className="inline-flex items-center text-left text-gray-500 dark:text-gray-300 hover:underline"
                >
                  로그아웃
                </button>
              </div>
              <div className="col-span-4 text-gray-900 dark:text-white">현재 계정에서 로그아웃합니다</div>
              <div className="col-span-1" />
            </div>
            <div className="grid grid-cols-7 gap-4 items-center border-b border-gray-100 dark:border-[#23242e]">
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center text-left text-gray-500 dark:text-gray-300 hover:underline"
                >
                  탈퇴
                </button>
              </div>
              <div className="col-span-4 text-gray-900 dark:text-white">현재 계정이 삭제됩니다</div>
            </div>

            {/* Nickname change modal */}
            <Sheet open={showNicknameModal} onOpenChange={setShowNicknameModal}>
              <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>별명 변경</SheetTitle>
                  <SheetDescription>프로필에 표시될 이름을 입력하세요.</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-col gap-3">
                  <Input
                    placeholder="별명"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void handleNicknameSave();
                      }
                    }}
                  />
                  {nickError && (
                    <Paragraph className="text-red-500 text-sm">{nickError}</Paragraph>
                  )}
                </div>
                <SheetFooter>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setShowNicknameModal(false)} className="px-4">
                      취소
                    </Button>
                    <Button onClick={handleNicknameSave} disabled={nickLoading} className="px-4">
                      {nickLoading ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Bio change modal */}
            <Sheet open={showBioModal} onOpenChange={setShowBioModal}>
              <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>소개글 편집</SheetTitle>
                  <SheetDescription>프로필에 표시될 소개글을 입력하세요.</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-col gap-3">
                  <Input
                    placeholder="소개글"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void handleBioSave();
                      }
                    }}
                  />
                  {bioError && (
                    <Paragraph className="text-red-500 text-sm">{bioError}</Paragraph>
                  )}
                </div>
                <SheetFooter>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setShowBioModal(false)} className="px-4">
                      취소
                    </Button>
                    <Button onClick={handleBioSave} disabled={bioLoading} className="px-4">
                      {bioLoading ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Color change modal */}
            <Sheet open={showColorModal} onOpenChange={setShowColorModal}>
              <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>프로필 색상 변경</SheetTitle>
                  <SheetDescription>이니셜 배경 색상을 선택하세요.</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      className="h-10 w-16 rounded border"
                    />
                    <Input value={colorInput} onChange={(e) => setColorInput(e.target.value)} />
                  </div>
                  {colorError && (
                    <Paragraph className="text-red-500 text-sm">{colorError}</Paragraph>
                  )}
                </div>
                <SheetFooter>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setShowColorModal(false)} className="px-4">
                      취소
                    </Button>
                    <Button onClick={handleColorSave} disabled={colorLoading} className="px-4">
                      {colorLoading ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Language change modal */}
            <Sheet open={showLangModal} onOpenChange={setShowLangModal}>
              <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>언어 변경</SheetTitle>
                  <SheetDescription>표시 언어를 선택하세요.</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="lang"
                        value="ko"
                        checked={langInput === "ko"}
                        onChange={() => setLangInput("ko")}
                      />
                      <span>한국어</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="lang"
                        value="en"
                        checked={langInput === "en"}
                        onChange={() => setLangInput("en")}
                      />
                      <span>English</span>
                    </label>
                  </div>
                  {langError && (
                    <Paragraph className="text-red-500 text-sm">{langError}</Paragraph>
                  )}
                </div>
                <SheetFooter>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setShowLangModal(false)} className="px-4">
                      취소
                    </Button>
                    <Button onClick={handleLangSave} disabled={langLoading} className="px-4">
                      {langLoading ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Microphone change modal */}
            <Sheet open={showMicModal} onOpenChange={setShowMicModal}>
              <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>마이크 변경</SheetTitle>
                  <SheetDescription>사용할 마이크를 선택하세요.</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-0 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <select
                      className="w-full border rounded px-3 py-2 bg-background text-foreground"
                      value={micSelect}
                      onChange={(e) => setMicSelect(e.target.value)}
                    >
                      {micDevices.length === 0 ? (
                        <option value="">마이크를 찾을 수 없습니다</option>
                      ) : (
                        micDevices.map((d) => (
                          <option key={d.deviceId} value={d.deviceId}>
                            {d.label}
                          </option>
                        ))
                      )}
                    </select>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const list = await ensureAudioPermissionAndDevices();
                        setMicDevices(list);
                        if (!list.some((d) => d.deviceId === micSelect)) {
                          setMicSelect(list[0]?.deviceId || "");
                        }
                      }}
                    >
                      새로고침
                    </Button>
                  </div>
                  {micError && <Paragraph className="text-red-500 text-sm">{micError}</Paragraph>}
                </div>
                <SheetFooter>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setShowMicModal(false)} className="px-4">
                      취소
                    </Button>
                    <Button onClick={handleMicSave} disabled={micLoading || !micSelect} className="px-4">
                      {micLoading ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Delete confirm modal */}
            <Sheet open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <SheetContent side="bottom" className="mx-auto w-full max-w-md rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>정말로 삭제하시겠습니까?</SheetTitle>
                  <SheetDescription>이 작업은 되돌릴 수 없습니다.</SheetDescription>
                </SheetHeader>
                <div className="p-4 pt-0">
                  {deleteError && (
                    <Paragraph className="text-red-500 text-sm">{deleteError}</Paragraph>
                  )}
                </div>
                <SheetFooter>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4"
                      disabled={deleteLoading}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="px-4"
                    >
                      {deleteLoading ? "삭제 중..." : "삭제"}
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
