import FeatureCard from "./FeatureCard";

const FeatureSection = () => {
  return (
    <section className="bg-muted py-20 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        <FeatureCard
          image="/image1.JPG"
          title="기능설명1"
          description="hello my name is"
        />
        <FeatureCard
          image="/image2.JPG"
          title="기능설명2"
          description="Oh teak hyeon"    
        />
        <FeatureCard
          image="/image1.JPG"
          title="기능설명3"
          description="ㄴㅁㅇㄻㄴㄻㄴㄻㄴ림;넝ㄹ"
        />
        <FeatureCard
          image="/image1.JPG"
          title="기능설명4"
          description="hello my name is"
        />
        <FeatureCard
          image="/image2.JPG"
          title="기능설명5"
          description="Oh teak hyeon"    
        />
        <FeatureCard
          image="/image1.JPG"
          title="기능설명6"
          description="ㄴㅁㅇㄻㄴㄻㄴㄻㄴ림;넝ㄹ"
        />
        <FeatureCard
          image="/image1.JPG"
          title="기능설명7"
          description="hello my name is"
        />
        <FeatureCard
          image="/image2.JPG"
          title="기능설명8"
          description="Oh teak hyeon"    
        />
        <FeatureCard
          image="/image1.JPG"
          title="기능설명9"
          description="ㄴㅁㅇㄻㄴㄻㄴㄻㄴ림;넝ㄹ"
        />
      </div>
    </section>
  );
};

export default FeatureSection;
