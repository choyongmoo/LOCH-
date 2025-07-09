import { Button } from "../ui/button";

export default function MainSection() {
  return (
    <section className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 p-6">
        <div className="md:w-1/2 flex justify-center items-center">
            <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/47/React.svg"
            alt="소개 이미지"
            className="rounded-lg shadow-lg max-h-[400px] object-contain"
            />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">임시 제목</h1>
            <p className="text-lg text-gray-700">
            임시 내용
            </p>

            <div className="flex gap-4 justify-center md:justify-start mt-6">
            <Button variant="default" size="lg">다운로드</Button>
            <Button variant="default" size="lg">웹에서 시작하기</Button>
            </div>
        </div>
</section>
  );
}