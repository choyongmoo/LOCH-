import { Button } from "@/components/common/ui/button";

type AddGroupButtonProps = {
  onClick: () => void;
};

const AddGroupButton = ({ onClick }: AddGroupButtonProps) => {
  return (
    <Button
      variant="default"
      size="icon"
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600"
    >
      +
    </Button>
  );
};

export default AddGroupButton;
