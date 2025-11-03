import { Button } from "@/components/common/ui/button";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary to-secondary opacity-10"></div>
      <div className="z-10">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-4xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">페이지가 존재하지 않습니다.</p>
        <div className="mt-8">
          <Button asChild>
            <a href="/">홈으로 돌아가기</a>
          </Button>
        </div>
      </div>
    </div>
  );
};
