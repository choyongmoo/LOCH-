import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
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
import { Separator } from "@/components/common/ui/separator";
import { supabase } from "@/lib/supabase";

export const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallbackInSignin = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            navigate("/", { replace: true });
            return;
          }
        }

        const hashParams = new URLSearchParams(
          window.location.hash.replace(/^#/, "")
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            window.history.replaceState({}, document.title, url.pathname);
            navigate("/", { replace: true });
            return;
          }
        }
      } catch (err) {}
    };

    void handleAuthCallbackInSignin();
  }, [navigate]);

  const handleEmailSignin = async () => {
    setError(null);
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }
    try {
      setLoading(true);
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) {
        setError(signInError.message);
        return;
      }
      if (data.session) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async () => {
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/signin`,
          queryParams: { prompt: "select_account" },
        },
      });
    } catch (err) {
      setError("Google 로그인에 실패했습니다.");
    }
  };

  const handleKakaoSignin = async () => {
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/signin`,
        },
      });
    } catch (err) {
      setError("Kakao 로그인에 실패했습니다.");
    }
  };

  const handleGithubSignin = async () => {
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/signin`,
        },
      });
    } catch (err) {
      setError("GitHub 로그인에 실패했습니다.");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>로그인</CardTitle>
        <CardDescription>계정 정보를 입력하여 로그인하세요.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={handleKakaoSignin} 
            className="h-14 w-14 rounded-xl shadow-sm border border-black/5 flex items-center justify-center hover:scale-105 transition"
            style={{ backgroundColor: "#FEE500" }}
            aria-label="카카오로 로그인"
          >
            <img
              src="assets/kakaotalk-logo.svg"
              alt="Kakao"
              className="h-8 w-8 object-contain"
            />
          </button>

          <button
            type="button"
            onClick={handleGoogleSignin}
            className="h-14 w-14 rounded-xl shadow-sm border bg-white text-gray-800 hover:bg-gray-50 flex items-center justify-center hover:scale-105 transition"
            aria-label="Google로 로그인"
          >
            <img
              src="assets/google-new.svg"
              alt="Google"
              className="h-7 w-7 object-contain"
            />
          </button>

          <button
            type="button"
            onClick={handleGithubSignin} 
            className="h-14 w-14 rounded-xl shadow-sm border border-black/10 bg-[#24292F] hover:bg-black/90 flex items-center justify-center hover:scale-105 transition"
            aria-label="GitHub로 로그인"
          >
            <img
              src="assets/github.svg"
              alt="GitHub"
              className="h-7 w-7 object-contain invert"
            />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            <Link
              to="/forgot-password"
              className="underline text-sm text-muted-foreground"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleEmailSignin();
              }
            }}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-2">
        {error && <Paragraph className="text-red-500 text-sm">{error}</Paragraph>}
        <Button
          className="w-full"
          onClick={handleEmailSignin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        <Paragraph muted className="text-center">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="underline">
            회원가입
          </Link>
        </Paragraph>
      </CardFooter>
    </Card>
  );
};
