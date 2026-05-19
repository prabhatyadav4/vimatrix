// src/components/common/Loader.jsx
// New Concept: variants prop for reusable component with different appearances

function Loader({ size = "md", fullScreen = false }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  };

  const spinner = (
    <div
      className={`
        ${sizes[size]}
        rounded-full
        border-gray-700
        border-t-blue-500
        animate-spin
      `}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
}

export default Loader;
