import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "../schemas/auth.schema.js";
import { useRegister } from "../hooks/useAuth.js";
import StepIndicator from "../components/common/StepIndicator.jsx";
import FileUploadBox from "../components/common/FileUploadBox.jsx";
import { getErrorMessage } from "../utils/errorHandler.js";

const STEPS = ["Account", "Avatar", "Banner"];

function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // File states — live outside RHF because they're File objects, not strings
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarError, setAvatarError] = useState("");

  const { mutate: register, isPending, isError, error } = useRegister();

  const {
    register: rhfRegister, // renamed to avoid clash with our register mutation
    handleSubmit,
    trigger, // manually trigger validation for specific fields
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // ── Step navigation ────────────────────────────────────────────────────────
  // New Concept: trigger specific fields before advancing
  // This validates ONLY the fields on the current step,
  // not the entire form at once.

  const goToNextStep = async () => {
    // Step 1: validate account fields via RHF
    if (currentStep === 1) {
      const isValid = await trigger([
        "fullName",
        "username",
        "email",
        "password",
        "confirmPassword",
      ]);
      if (!isValid) return;
    }

    // Step 2: validate avatar (not an RHF field, manual check)
    if (currentStep === 2) {
      if (!avatar) {
        setAvatarError("Avatar is required.");
        return;
      }
      setAvatarError("");
    }

    setCurrentStep((prev) => prev + 1);
  };

  // ── Final submit ───────────────────────────────────────────────────────────
  const onSubmit = (data) => {
    if (currentStep !== 3) return;
    // Build FormData to carry both text fields AND file objects
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    register(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-black">VT</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Join VideoTube today</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form card */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
          <form
            onSubmit={(e) => {
              if (currentStep < 3) {
                e.preventDefault();
                goToNextStep();
              } else {
                handleSubmit(onSubmit)(e);
              }
            }}
          >
            {/* ════════════ STEP 1: Account Info ════════════ */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-white font-semibold">Account details</h2>

                <FormField label="Full Name" error={errors.fullName?.message}>
                  <input
                    {...rhfRegister("fullName")}
                    placeholder="Rahul Sharma"
                    className={inputClass(errors.fullName)}
                  />
                </FormField>

                <FormField
                  label="Username"
                  hint="Letters, numbers, underscores only"
                  error={errors.username?.message}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      @
                    </span>
                    <input
                      {...rhfRegister("username")}
                      placeholder="rahul_dev"
                      className={`${inputClass(errors.username)} pl-8`}
                    />
                  </div>
                </FormField>

                <FormField label="Email" error={errors.email?.message}>
                  <input
                    {...rhfRegister("email")}
                    type="email"
                    placeholder="rahul@example.com"
                    className={inputClass(errors.email)}
                  />
                </FormField>

                <FormField label="Password" error={errors.password?.message}>
                  {/* Password visibility toggle */}
                  <div className="relative">
                    <input
                      {...rhfRegister("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      className={`${inputClass(errors.password)} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>

                <FormField
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                >
                  <input
                    {...rhfRegister("confirmPassword")}
                    type="password"
                    placeholder="Repeat your password"
                    className={inputClass(errors.confirmPassword)}
                  />
                </FormField>
              </div>
            )}

            {/* ════════════ STEP 2: Avatar ════════════ */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-white font-semibold">Profile picture</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    This will appear on your channel and comments.
                  </p>
                </div>

                <FileUploadBox
                  label="Avatar *"
                  accept="image/*"
                  type="image"
                  value={avatar}
                  onChange={setAvatar}
                  error={avatarError}
                  aspectRatio="aspect-square"
                />
              </div>
            )}

            {/* ════════════ STEP 3: Banner ════════════ */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-white font-semibold">Channel banner</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Optional — shown at the top of your channel page.
                  </p>
                </div>

                <FileUploadBox
                  label="Cover Image (optional)"
                  accept="image/*"
                  type="image"
                  value={coverImage}
                  onChange={setCoverImage}
                  aspectRatio="aspect-[3/1]"
                />

                {/* API error */}
                {isError && (
                  <p className="text-red-500 text-sm bg-red-500/10 rounded-lg px-4 py-2">
                    {getErrorMessage(error)}
                  </p>
                )}
              </div>
            )}

            {/* ── Navigation buttons ─────────────────────────────────────── */}
            <div
              className={`flex mt-6 ${currentStep > 1 ? "justify-between" : "justify-end"}`}
            >
              {/* Back button */}
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((p) => p - 1)}
                  className="px-5 py-2.5 text-sm text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition"
                >
                  Back
                </button>
              )}

              {/* Next OR Submit */}
              {currentStep < 3 ? (
                <button
                  key="continue-btn"
                  type="button"
                  onClick={goToNextStep}
                  className="px-5 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition font-medium"
                >
                  Continue
                </button>
              ) : (
                <button
                  key="submit-btn"
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition font-medium"
                >
                  {isPending ? "Creating account..." : "Create account"}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

// Wraps label + input + hint + error in a consistent layout
// New Concept: compound component — layout wrapper with slots
function FormField({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <label className="text-sm text-gray-300 font-medium">{label}</label>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

// Consistent input styling — red border if error
const inputClass = (error) => `
  w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm
  outline-none border transition
  ${
    error
      ? "border-red-500 focus:border-red-400"
      : "border-gray-700 focus:border-blue-500"
  }
`;

export default Register;
