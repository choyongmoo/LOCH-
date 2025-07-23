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
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>계정 정보를 입력하여 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Button variant="outline" className="w-full">
          Google로 로그인
        </Button>
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">OR</span>
          <Separator className="flex-1" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            <Link to="/" className="underline text-sm text-muted-foreground">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
        <Button className="w-full">로그인</Button>
        <Paragraph muted>
          계정이 없으신가요?{" "}
          <Link to="/signup" className="underline">
            회원가입
          </Link>
        </Paragraph>
      </CardFooter>
    </Card>
  );
};
