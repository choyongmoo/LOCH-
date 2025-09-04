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
  // 현재 로그인한 사용자의 public.users PK (int8)
  const [userPk, setUserPk] = useState<number | null>(null);
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
      const userEmail = data.user?.email ?? null;
      // ← 콘솔 출력 추가
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
      // 계정별 최근활동 로컬 스토리지 제거
      try {
        const key = `recentWorkspacePages:${userEmail ?? "anonymous"}`;
        localStorage.removeItem(key);
      } catch {}
      await supabase.auth.signOut();
      navigate("/", { replace: true });
    } catch {
      setDeleteError("삭제 처리 중 오류가 발생했습니다.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // profile 테이블 업서트 헬퍼
  const upsertProfile = async (
    payload: Partial<{
      nickname: string;
      bio: string | null;
      accent_color: string | null;
      language: "ko" | "en";
      mic_device_id: string | null;
      mic_enabled: boolean;
    }>
  ) => {
    if (!userPk) {
      throw new Error("사용자 정보를 불러오지 못했습니다.");
    }
    const safeNickname = payload.nickname ?? profileName ?? (email ? email.split("@")[0] : "User");
    const { error } = await supabase
      .from("profile")
      .upsert(
        {
          id: userPk,
          nickname: safeNickname,
          language: payload.language ?? profileLang ?? "ko",
          mic_enabled: payload.mic_enabled ?? true,
          bio: payload.bio ?? profileBio ?? null,
          accent_color: payload.accent_color ?? profileColor ?? null,
          mic_device_id: payload.mic_device_id ?? null,
        },
        { onConflict: "id" }
      );
    if (error) throw error;
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
      await upsertProfile({ nickname: trimmed });
      setProfileName(trimmed);
      setShowNicknameModal(false);
      // 프로필 업데이트 이벤트 발생
      try { 
        window.dispatchEvent(new CustomEvent('friends-updated')); 
        window.dispatchEvent(new CustomEvent('profile-updated')); 
      } catch {}
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
      await upsertProfile({ bio: trimmed || null });
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
      await upsertProfile({ accent_color: value });
      setProfileColor(value);
      setShowColorModal(false);
      // 프로필 업데이트 이벤트 발생
      try { 
        window.dispatchEvent(new CustomEvent('friends-updated')); 
        window.dispatchEvent(new CustomEvent('profile-updated')); 
      } catch {}
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
      await upsertProfile({ language: langInput });
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
      await upsertProfile({ mic_device_id: micSelect });
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
      // 인증 사용자 가져오기
      const { data: authData } = await supabase.auth.getUser();
      const authUuid = authData.user?.id ?? null; 
      const emailFromAuth = authData.user?.email ?? null;
      setEmail(emailFromAuth);
      if (!emailFromAuth) return;

      // public.users에서 PK 찾기 (없으면 '이메일 기준 귀속' 시도 → 그래도 없으면 생성)
      const { data: userRowByUuid } = await supabase
        .from("users")
        .select("id, name")
        .eq("user_uuid", authUuid)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      const fallbackName = (authData.user?.user_metadata as Record<string, unknown> | undefined)?.name as
        | string
        | undefined;
      let displayName = fallbackName ?? emailFromAuth.split("@")[0];
      let pk: number | null = null;

      if (userRowByUuid?.id) {
        pk = userRowByUuid.id as unknown as number;
        if (userRowByUuid.name) displayName = userRowByUuid.name as string;
      } else {
        // 1) 기존에 이메일로만 만들어진 row가 있다면 내 계정으로 귀속(user_uuid 세팅)
        const { data: claimed } = await supabase
          .from("users")
          .update({ user_uuid: authUuid })
          .eq("email", emailFromAuth)
          .is("user_uuid", null)
          .select("id, name")
          .maybeSingle();

        if (claimed?.id) {
          pk = claimed.id as unknown as number;
          if (claimed.name) displayName = claimed.name as string;
        } else {
          // 2) 없으면 새 행 생성(user_uuid 포함)
          const { data: inserted } = await supabase
            .from("users")
            .insert({ email: emailFromAuth, name: displayName, user_uuid: authUuid })
            .select("id")
            .single();
          pk = inserted?.id ?? null;
        }
      }

      if (!pk) return;
      setUserPk(pk);
      setProfileName(displayName);
      setNicknameInput(displayName);

      // 프로필 로드 (없으면 기본값으로 생성)
      const { data: profileRow } = await supabase
        .from("profile")
        .select("nickname, bio, accent_color, language, mic_device_id, mic_enabled")
        .eq("id", pk)
        .maybeSingle();

      if (!profileRow) {
        await supabase
          .from("profile")
          .upsert(
            {
              id: pk,
              nickname: displayName, // 이메일 앞부분
              bio: null,
              accent_color: null,
              language: null,
              mic_device_id: null,
              mic_enabled: null,
            },
            { onConflict: "id" }
          );
        setProfileBio(null);
        setBioInput("");
        setProfileColor(null);
        setColorInput("#7e22ce");
        setProfileLang("ko");
        setLangInput("ko");
      } else {
        setProfileName(profileRow.nickname ?? displayName);
        setNicknameInput(profileRow.nickname ?? displayName);
        const cleanedBio = typeof profileRow.bio === "string" && profileRow.bio.trim().length > 0 ? profileRow.bio : null;
        setProfileBio(cleanedBio);
        setBioInput(profileRow.bio ?? "");
        const validColor =
          typeof profileRow.accent_color === "string" && /^#([0-9a-fA-F]{6})$/.test(profileRow.accent_color)
            ? profileRow.accent_color
            : null;
        setProfileColor(validColor);
        setColorInput(validColor ?? "#7e22ce");
        const normalizedLang = profileRow.language === "en" ? "en" : "ko";
        setProfileLang(normalizedLang);
        setLangInput(normalizedLang);
      }

      // 오디오 디바이스 로드 및 선택값 결정
      const inputs = await ensureAudioPermissionAndDevices();
      setMicDevices(inputs);
      const micId = profileRow?.mic_device_id as string | undefined;
      const defaultId = inputs.find((d) => d.deviceId === "default")?.deviceId || inputs[0]?.deviceId || "";
      const nextId = inputs.some((d) => d.deviceId === micId) ? (micId as string) : defaultId;
      const nextLabel = inputs.find((d) => d.deviceId === nextId)?.label || null;
      setProfileMicLabel(nextLabel);
      setMicSelect(nextId);
    };

    void loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  return (
    <div className="h-screen w-full min-w-0 flex justify-start items-start bg-[#f8fafc] dark:bg-[#18191c] p-0 m-0 overflow-hidden">
      <div className="w-full max-w-none p-4 md:p-6 lg:p-8 overflow-hidden">
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
