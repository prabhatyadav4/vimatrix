import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Film, CheckCircle2 } from "lucide-react";
import { uploadVideoSchema } from "../schemas/video.schema.js";
import { usePublishVideo } from "../hooks/useVideos.js";
import StepIndicator from "../components/common/StepIndicator.jsx";
import FileUploadBox from "../components/common/FileUploadBox.jsx";
import UploadProgressBar from "../components/video/UploadProgressBar.jsx";
import { getErrorMessage } from "../utils/errorHandler.js";

const STEPS = ["Select Files", "Add Details", "Upload"];

function VideoUpload() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // File states outside RHF
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [fileErrors, setFileErrors] = useState({});

  const {
    mutate: publishVideo,
    isPending,
    isError,
    isSuccess,
    error,
    uploadProgress,
  } = usePublishVideo();

  const {
    register,
    handleSubmit,
    watch, // read form values without subscribing to re-renders
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      uploadVideoSchema.pick({
        title: true,
        description: true,
      }),
    ),
    defaultValues: { title: "", description: "" },
  });

  const titleValue = watch("title"); // live character count for title

  // ── Step 1 validation ──────────────────────────────────────────────────────
  const goToStep2 = () => {
    const newErrors = {};
    if (!videoFile) newErrors.video = "Please select a video file.";
    if (!thumbnail) newErrors.thumbnail = "Please select a thumbnail.";
    if (Object.keys(newErrors).length > 0) {
      setFileErrors(newErrors);
      return;
    }
    setFileErrors({});
    setCurrentStep(2);
  };

  // ── Final submit ───────────────────────────────────────────────────────────
  const onSubmit = (data) => {
    setCurrentStep(3); // move to upload/progress step

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    publishVideo(formData);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Film size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Upload Video</h1>
            <p className="text-gray-400 text-sm">
              Share your content with the world
            </p>
          </div>
        </div>

        {/* Steps */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Card */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ════════════ STEP 1: Select Files ════════════ */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white font-semibold">Select files</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Choose your video and thumbnail image.
                  </p>
                </div>

                <FileUploadBox
                  label="Video File *"
                  accept="video/mp4,video/webm,video/ogg"
                  type="video"
                  value={videoFile}
                  onChange={setVideoFile}
                  error={fileErrors.video}
                  aspectRatio="aspect-video"
                />

                <FileUploadBox
                  label="Thumbnail *"
                  accept="image/*"
                  type="image"
                  value={thumbnail}
                  onChange={setThumbnail}
                  error={fileErrors.thumbnail}
                  aspectRatio="aspect-video"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={goToStep2}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* ════════════ STEP 2: Details ════════════ */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-white font-semibold">Video details</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Give your video a title and description.
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-sm text-gray-300 font-medium">
                      Title *
                    </label>
                    {/* Live character counter */}
                    <span
                      className={`text-xs ${
                        (titleValue?.length || 0) > 90
                          ? "text-red-400"
                          : "text-gray-500"
                      }`}
                    >
                      {titleValue?.length || 0}/100
                    </span>
                  </div>
                  <input
                    {...register("title")}
                    placeholder="Give your video an engaging title"
                    className={`w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border transition ${
                      errors.title
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-300 font-medium">
                    Description *
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="Tell viewers about your video..."
                    rows={5}
                    className={`w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border resize-none transition ${
                      errors.description
                        ? "border-red-500"
                        : "border-gray-700 focus:border-blue-500"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Thumbnail preview summary */}
                {thumbnail && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail preview"
                      className="w-20 aspect-video object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {titleValue || "Untitled video"}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {(videoFile?.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
                  >
                    Upload Video
                  </button>
                </div>
              </div>
            )}

            {/* ════════════ STEP 3: Uploading ════════════ */}
            {currentStep === 3 && (
              <div className="space-y-6 py-4">
                {/* Success state */}
                {isSuccess ? (
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <CheckCircle2 size={56} className="text-green-500" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Video published!
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Your video is now live on VideoTube.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-xl transition"
                      >
                        Go Home
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition"
                      >
                        View Dashboard
                      </button>
                    </div>
                  </div>
                ) : isError ? (
                  // Error state
                  <div className="space-y-4">
                    <p className="text-red-500 text-sm text-center bg-red-500/10 rounded-xl p-4">
                      {getErrorMessage(error)}
                    </p>
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-xl transition"
                      >
                        Go back and retry
                      </button>
                    </div>
                  </div>
                ) : (
                  // Uploading state
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Film size={28} className="text-blue-400" />
                      </div>
                      <p className="text-white font-medium">
                        Uploading your video
                      </p>
                      <p className="text-gray-400 text-sm">
                        Please keep this tab open.
                      </p>
                    </div>

                    <UploadProgressBar progress={uploadProgress} />
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default VideoUpload;
