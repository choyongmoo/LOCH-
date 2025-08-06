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
      <CardHeader className="text-center">
        <CardTitle>회원가입</CardTitle>
        <CardDescription>계정 정보를 입력하여 회원가입하세요.</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        {/* 이름 */}
        <div className="grid gap-2">
          <Label htmlFor="name">이름</Label>
          <Input id="name" type="text" />
        </div>

        {/* 이메일 */}
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" />
        </div>

        {/* 비밀번호 */}
        <div className="grid gap-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input id="password" type="password" />
        </div>

        {/* 비밀번호 확인 */}
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">비밀번호 확인</Label>
          <Input id="confirm-password" type="password" />
        </div>

        {/* 생년월일 */}
        <div className="grid gap-2">
          <Label>생년월일</Label>
          <div className="flex gap-2">
            <select
              id="birth-year"
              className="w-1/3 border rounded-md px-3 py-2 bg-background text-foreground"
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
        <Button className="w-full">회원가입</Button>
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
