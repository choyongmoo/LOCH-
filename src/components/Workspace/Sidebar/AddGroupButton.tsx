
type AddGroupButtonProps = {
  onClick: () => void;
};

const AddGroupButton = ({ onClick }: AddGroupButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-md bg-gray-800 hover:bg-gray-700 mb-2 cursor-pointer flex items-center justify-center transition-all"
    >
      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-black text-xl font-bold leading-none">+</span>
    </button>
  );
};

export default AddGroupButton;
