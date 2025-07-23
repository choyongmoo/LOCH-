import { Button } from "@/components/common/ui/button";
import { Heading } from "@/components/common/ui/Heading";
import { Paragraph } from "@/components/common/ui/Paragraph";
import { Download } from "lucide-react";
import { Link } from "react-router";

export const Home = () => {
  return (
    <div className="flex flex-col gap-10">
      <section className="py-20">
        <div className="container mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-9">
            <Heading level={1}>재미와 게임으로 가득한 그룹 채팅</Heading>
            <Paragraph size="lg" muted>
              Discord는 친구들과 게임을 플레이하며 놀거나 글로벌 커뮤니티를
              만들기에 좋습니다. 나만의 공간을 만들어 대화하고, 게임을
              플레이하며, 어울려 보세요.
            </Paragraph>
            <div className="flex gap-2">
              <Button size="lg">
                <Link to="/signup">시작하기</Link>
              </Button>
              <Button size="lg" variant="link">
                <Download className="size-6" />
                Windows용 다운로드
              </Button>
            </div>
          </div>
          <div className="relative flex h-96 items-center justify-center">
            <div className="absolute h-72 w-72 rounded-lg bg-gradient-to-br from-primary to-secondary transform -translate-x-10 -translate-y-10"></div>
            <div className="absolute h-72 w-72 rounded-lg bg-gradient-to-tr from-accent to-primary-foreground transform translate-x-10 translate-y-10 border"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
