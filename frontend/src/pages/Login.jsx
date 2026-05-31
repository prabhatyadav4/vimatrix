import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router-dom";
import { loginSchema } from "../schemas/auth.schema.js";
import { useLogin } from "../hooks/useAuth.js";
import { getErrorMessage } from "../utils/errorHandler.js";

function Login() {
  const { mutate: login, isPending, isError, error } = useLogin();
  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in to your VideoTube account
          </p>
        </div>

        {registrationSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl px-4 py-3 font-medium">
            Account created successfully! You can now sign in.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              // register() returns { name, ref, onChange, onBlur }
              // spread it onto input to connect it to the form
              {...register("email")}
              type="email"
              placeholder="rahul@example.com"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none border border-gray-700 focus:border-blue-500 transition"
            />
            {/* Show Zod error message for this field */}
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 outline-none border border-gray-700 focus:border-blue-500 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* API error (wrong credentials etc.) */}
          {isError && (
            <p className="text-red-500 text-sm bg-red-500/10 rounded-lg px-4 py-2">
              {getErrorMessage(error)}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
