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
import { Link } from "react-router";

export const Signin = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>로그인</CardTitle>
        <CardDescription>계정 정보를 입력하여 로그인하세요.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <div className="flex gap-3">
          {/* Google 로그인 */}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-1/2 py-2"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium">Google</span>
          </Button>

          {/* Kakao 로그인 */}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-1/2 py-2 
                      bg-yellow-300 hover:bg-yellow-400 text-black dark:text-white font-semibold"
          >
            <img src="/kakaotalk.svg" alt="Kakao" className="w-5 h-5" />
            <span className="text-sm font-medium">Kakao</span>
          </Button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>

        {/*  이메일 입력 */}
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" />
        </div>

        {/* 비밀번호 입력 */}
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
          <Input id="password" type="password" />
        </div>
      </CardContent>

      {/* 로그인 버튼 및 회원가입 링크 */}
      <CardFooter className="flex flex-col gap-4 pt-2">
        <Button className="w-full">로그인</Button>
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
