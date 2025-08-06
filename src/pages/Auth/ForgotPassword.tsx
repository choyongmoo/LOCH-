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

export const ForgotPassword = () => {
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
        {/* 이메일 입력 */}
        <div className="grid gap-3">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일 주소 입력"
            className="h-12"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 pt-6">
        {/* 버튼 */}
        <Button className="w-full h-12 text-base font-semibold">
          비밀번호 재설정 링크 보내기
        </Button>

        {/* 하단 링크 */}
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
