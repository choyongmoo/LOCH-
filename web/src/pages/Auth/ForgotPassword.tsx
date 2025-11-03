// src/pages/Auth/ForgotPassword.tsx
import { useState } from "react";
import { Button } from "@/components/common/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/card";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Link } from "react-router";
import { supabase } from "@/lib/supabase";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleSend = async () => {
    setErr(null);
    setMsg(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr("올바른 이메일 형식을 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // 이메일의 링크가 이동할 콜백 URL (대시보드 Redirect URLs에도 등록!)
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMsg("재설정 링크를 이메일로 보냈습니다. 메일함(스팸함 포함)을 확인하세요.");
    } catch (e: any) {
      setErr(e.message ?? "메일 전송 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm py-12">
      <CardHeader className="space-y-4 text-center">
        <CardTitle className="text-2xl font-bold">비밀번호 재설정</CardTitle>
        <CardDescription className="leading-relaxed">
          가입하신 이메일 주소를 입력하시면 <br />
          비밀번호 재설정 링크를 보내드립니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 mt-6">
        <div className="grid gap-3">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일 주소 입력"
            className="h-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        {err && <Paragraph className="text-red-500 text-sm">{err}</Paragraph>}
        {msg && <Paragraph className="text-emerald-600 text-sm">{msg}</Paragraph>}
      </CardContent>

      <CardFooter className="flex flex-col gap-6 pt-6">
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "전송 중..." : "비밀번호 재설정 링크 보내기"}
        </Button>

        <Paragraph muted className="text-center text-sm">
          비밀번호가 기억나셨나요?{" "}
          <Link to="/signin" className="underline">
            로그인
          </Link>
        </Paragraph>
      </CardFooter>
    </Card>
  );
};
