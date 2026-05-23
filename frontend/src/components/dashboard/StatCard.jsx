import useCountUp from "../../hooks/useCountUp.js";
import { formatViews } from "../../utils/formatViews.js";

function StatCard({
  icon,
  label,
  value = 0,
  color = "blue",
  prefix = "",
  suffix = "",
}) {
  // Animate value from 0 → actual number on mount
  const animatedValue = useCountUp(value, 1200);

  const colorMap = {
    blue: "bg-blue-500/10  text-blue-400  border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    green: "bg-green-500/10 text-green-400  border-green-500/20",
    red: "bg-red-500/10   text-red-400    border-red-500/20",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4 hover:border-gray-700 transition">
      {/* Icon box */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${colorMap[color]}`}
      >
        {icon}
      </div>

      {/* Value + label */}
      <div className="min-w-0">
        <p className="text-gray-400 text-sm font-medium truncate">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5 tabular-nums">
          {/* tabular-nums = fixed-width digits → prevents layout shift during animation */}
          {prefix}
          {formatViews(animatedValue)}
          {suffix}
        </p>
      </div>
    </div>
  );
}

export default StatCard;
