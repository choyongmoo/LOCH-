// src/pages/Home.tsx
import FeatureSection from "@/components/FeatureSection"
import Footer from "@/components/ui/Footer"
const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="flex items-center justify-between px-20 py-40">
        {/* 왼쪽 텍스트 */}
        <div className="w-1/2 space-y-4">
          <h1 className="text-4xl font-bold text-left">Loch</h1>
          <p className="text-gray-500 text-left">우리는....진짜 합니다...</p>
        </div>

        {/* 오른쪽 이미지 */}
        <div className="w-1/2 flex items-center justify-center relative">
          <img
            src="/image1.JPG"
            alt="배경 이미지"
            className="w-60 h-60 object-cover rounded-lg shadow-md"
          />
          <img
            src="/image2.JPG"
            alt="겹치는 이미지"
            className="w-40 h-40 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Feature Section */}
      <div className="mt-20">
        <FeatureSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};


export default Home;
