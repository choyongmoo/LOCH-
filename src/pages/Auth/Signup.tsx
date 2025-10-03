import { useState } from "react";
import { Link } from "react-router";
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
import { supabase } from "@/lib/supabase";

export const Signup = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const birthDate = birthYear && birthMonth && birthDay
      ? `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`
      : undefined;

    try {
      setSubmitting(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: nickname,
            birthDate,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.user) {
        setMessage("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        // 즉시 로그인 방지: 혹시 세션이 생겼다면 로그아웃 처리
        try {
          await supabase.auth.signOut();
        } catch (err) {
          }
        window.location.href = "/signin";
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>회원가입</CardTitle>
        <CardDescription>계정 정보를 입력하여 회원가입하세요.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        {/* 이름 */}
        <div className="grid gap-2">
          <Label htmlFor="nickname">이름</Label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* 이메일 */}
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 비밀번호 */}
        <div className="grid gap-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* 생년월일 */}
        <div className="grid gap-2">
          <Label>생년월일</Label>
          <div className="flex gap-2">
            <select
              id="birth-year"
              className="w-1/3 border rounded-md px-3 py-2 bg-background text-foreground"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            >
              <option value="">년</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                );
              })}
            </select>

            <select
              id="birth-month"
              className="w-1/3 border rounded-md px-3 py-2 bg-background text-foreground"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
            >
              <option value="">월</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}월
                </option>
              ))}
            </select>

            <select
              id="birth-day"
              className="w-1/3 border rounded-md px-3 py-2 bg-background text-foreground"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
            >
              <option value="">일</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}일
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2">
        {error && (
          <Paragraph className="text-red-500 text-sm">{error}</Paragraph>
        )}
        {message && (
          <Paragraph className="text-green-600 text-sm">{message}</Paragraph>
        )}
        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "처리 중..." : "회원가입"}
        </Button>
        <Paragraph muted className="text-center">
          이미 계정이 있으신가요?{" "}
          <Link to="/signin" className="underline">
            로그인
          </Link>
        </Paragraph>
      </CardFooter>
    </Card>
  );
};
