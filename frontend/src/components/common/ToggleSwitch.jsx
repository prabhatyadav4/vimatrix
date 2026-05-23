// New Concept: accessible toggle
// We use role="switch" and aria-checked so screen readers announce:
// "Published, switch button" → user knows what it does and its state

function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex items-center h-6 w-11
        rounded-full border-2 transition-colors duration-200 shrink-0
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed
        ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "bg-gray-700 border-gray-600"
        }
      `}
    >
      {/* Thumb — the sliding circle */}
      <span
        className={`
          inline-block w-4 h-4 bg-white rounded-full shadow
          transition-transform duration-200
          ${checked ? "translate-x-5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
}

export default ToggleSwitch;
