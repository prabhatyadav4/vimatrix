// src/components/channel/EditProfileModal.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { Camera } from "lucide-react";
import Modal from "../common/Modal.jsx";
import FileUploadBox from "../common/FileUploadBox.jsx";
import {
  useUpdateAccountDetails,
  useUpdateAvatar,
  useUpdateCoverImage,
} from "../../hooks/useChannel.js";
import { updateUser } from "../../app/slices/authSlice.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

// Zod schema for account details
const accountSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
});

function EditProfileModal({ isOpen, onClose, user }) {
  const dispatch = useDispatch();

  // Which sub-section is active inside the modal
  const [activeTab, setActiveTab] = useState("details"); // "details" | "avatar" | "cover"

  // File states
  const [newAvatar, setNewAvatar] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);

  const {
    mutate: updateDetails,
    isPending: updatingDetails,
    isError: detailsError,
    error: detailsErr,
  } = useUpdateAccountDetails();
  const { mutate: updateAvatar, isPending: updatingAvatar } = useUpdateAvatar();
  const { mutate: updateCover, isPending: updatingCover } =
    useUpdateCoverImage();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  // ── Submit handlers ────────────────────────────────────────────────────────

  const handleDetailsSubmit = (data) => {
    updateDetails(data, {
      onSuccess: (updatedUser) => {
        dispatch(updateUser(updatedUser)); // sync Redux store
        onClose();
      },
    });
  };

  const handleAvatarSubmit = () => {
    if (!newAvatar) return;
    updateAvatar(newAvatar, {
      onSuccess: (updatedUser) => {
        dispatch(updateUser({ avatar: updatedUser.avatar }));
        onClose();
      },
    });
  };

  const handleCoverSubmit = () => {
    if (!newCoverImage) return;
    updateCover(newCoverImage, { onSuccess: onClose });
  };

  const TABS = [
    { key: "details", label: "Details" },
    { key: "avatar", label: "Avatar" },
    { key: "cover", label: "Banner" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit profile" size="md">
      {/* Sub-tabs inside modal */}
      <div className="flex gap-1 p-1 bg-gray-800 rounded-xl mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 py-2 text-sm font-medium rounded-lg transition
              ${
                activeTab === tab.key
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Details tab ─────────────────────────────────────────────────── */}
      {activeTab === "details" && (
        <form
          onSubmit={handleSubmit(handleDetailsSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300">Full Name</label>
            <input
              {...register("fullName")}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 transition"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-gray-300">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {detailsError && (
            <p className="text-red-500 text-xs">
              {getErrorMessage(detailsErr)}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingDetails || !isDirty}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition"
            >
              {updatingDetails ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}

      {/* ── Avatar tab ──────────────────────────────────────────────────── */}
      {activeTab === "avatar" && (
        <div className="space-y-5">
          {/* Current avatar preview */}
          <div className="flex items-center gap-4">
            <img
              src={newAvatar ? URL.createObjectURL(newAvatar) : user?.avatar}
              alt="Current avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-700"
            />
            <div>
              <p className="text-white text-sm font-medium">Profile picture</p>
              <p className="text-gray-400 text-xs">
                Shown on your channel and comments
              </p>
            </div>
          </div>

          <FileUploadBox
            label="New Avatar"
            accept="image/*"
            type="image"
            value={newAvatar}
            onChange={setNewAvatar}
            aspectRatio="aspect-square"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAvatarSubmit}
              disabled={!newAvatar || updatingAvatar}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition"
            >
              {updatingAvatar ? "Uploading..." : "Update avatar"}
            </button>
          </div>
        </div>
      )}

      {/* ── Cover tab ───────────────────────────────────────────────────── */}
      {activeTab === "cover" && (
        <div className="space-y-5">
          <FileUploadBox
            label="New Channel Banner"
            accept="image/*"
            type="image"
            value={newCoverImage}
            onChange={setNewCoverImage}
            aspectRatio="aspect-[3/1]"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCoverSubmit}
              disabled={!newCoverImage || updatingCover}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition"
            >
              {updatingCover ? "Uploading..." : "Update banner"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default EditProfileModal;
