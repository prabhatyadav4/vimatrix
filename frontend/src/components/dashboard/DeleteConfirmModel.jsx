import { Trash2, AlertTriangle } from "lucide-react";
import Modal from "../common/Modal.jsx";

// New Concept: confirmation modal pattern
// Destructive actions (delete, deactivate) should ALWAYS require confirmation.
// Pattern: action button → modal with clear warning → confirm button
// The modal receives the item to delete and callbacks for confirm/cancel.

function DeleteConfirmModal({ isOpen, onClose, onConfirm, video, isPending }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Video" size="sm">
      <div className="space-y-5">
        {/* Warning icon + message */}
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              Are you sure you want to delete this video?
            </p>
            <p className="text-gray-400 text-sm mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Video preview so user knows exactly what will be deleted */}
        {video && (
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-16 aspect-video object-cover rounded-lg shrink-0"
            />
            <p className="text-white text-sm font-medium line-clamp-2">
              {video.title}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition flex items-center gap-2"
          >
            <Trash2 size={14} />
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmModal;
