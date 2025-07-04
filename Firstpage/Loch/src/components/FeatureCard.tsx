import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  
}

const FeatureCard = ({ image, title, description}: FeatureCardProps) => {
  return (
    <Card className="w-full max-w-xs shadow-md rounded-2xl">
      <CardContent className="p-4">
        <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-2xl mb-4">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover rounded-2xl"
          />
        </AspectRatio>

        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
