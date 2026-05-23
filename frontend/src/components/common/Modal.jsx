import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children, size = "md" }) {
  // New Concept: prevent body scroll when modal is open
  // When modal opens → lock background scroll
  // When modal closes → restore scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup runs when component unmounts OR when isOpen changes
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  // createPortal(content, domNode)
  // Renders content into domNode instead of the current parent
  return createPortal(
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose} // click backdrop → close modal
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal panel */}
      {/* New Concept: e.stopPropagation()
          Click inside modal panel must NOT bubble up to backdrop
          Without this, clicking anywhere inside modal would close it */}
      <div
        className={`
          relative w-full ${sizes[size]} bg-gray-900 rounded-2xl
          border border-gray-800 shadow-2xl
          animate-in slide-in-from-bottom-4 sm:animate-in sm:zoom-in-95
          duration-200
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body, // portal target — renders directly under <body>
  );
}

export default Modal;
