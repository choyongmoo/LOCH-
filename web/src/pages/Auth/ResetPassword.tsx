// src/pages/Auth/ResetPassword.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/common/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import { Input } from "@/components/common/ui/input";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false); // 토큰 처리 완료 여부
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 이메일의 링크가 열리면 URL에 붙은 code 또는 hash 토큰을 세션으로 교환
  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
          const access_token = hash.get("access_token");
          const refresh_token = hash.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;
          }
        }
        setReady(true);
      } catch (e: any) {
        setErr(e.message ?? "인증 토큰 처리 중 오류가 발생했습니다.");
      }
    };
    void run();
  }, []);

  const handleUpdate = async () => {
    setErr(null);
    setOk(null);

    if (pw1.length < 6) {
      setErr("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (pw1 !== pw2) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) throw error;
      setOk("비밀번호가 변경되었습니다. 다시 로그인해 주세요.");
      setTimeout(() => navigate("/signin", { replace: true }), 1200);
    } catch (e: any) {
      setErr(e.message ?? "비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm py-10">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">새 비밀번호 설정</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        {!ready && (
          <Paragraph className="text-sm text-muted-foreground">토큰 확인 중…</Paragraph>
        )}
        {err && <Paragraph className="text-sm text-red-500">{err}</Paragraph>}
        {ok && <Paragraph className="text-sm text-emerald-600">{ok}</Paragraph>}

        {ready && !ok && (
          <>
            <Input
              type="password"
              placeholder="새 비밀번호 (6자 이상)"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className="h-12"
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className="h-12"
            />
          </>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full h-12" onClick={handleUpdate} disabled={!ready || loading}>
          {loading ? "변경 중..." : "비밀번호 변경"}
        </Button>
      </CardFooter>
    </Card>
  );
};
