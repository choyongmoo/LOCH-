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

export const Signup = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>계정 정보를 입력하여 회원가입하세요.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">이름</Label>
          <Input id="name" type="text" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input id="password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <Input id="confirm-password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-2">
        <Button className="w-full">회원가입</Button>
        <Paragraph muted>
          이미 계정이 있으신가요?{" "}
          <Link to="/signin" className="underline">
            로그인
          </Link>
        </Paragraph>
      </CardFooter>
    </Card>
  );
};
