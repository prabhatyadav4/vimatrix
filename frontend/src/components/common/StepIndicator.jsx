import { Check } from "lucide-react";

// New Concept: derived state
// We never store "isCompleted" in state — we DERIVE it from currentStep
// If step < currentStep → it's completed. Always in sync, never stale.

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center
                  text-sm font-semibold border-2 transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isActive
                        ? "bg-transparent border-blue-500 text-blue-400"
                        : "bg-transparent border-gray-700 text-gray-500"
                  }
                `}
              >
                {isCompleted ? <Check size={16} /> : stepNumber}
              </div>
              {/* Step label below circle */}
              <span
                className={`text-xs mt-1.5 font-medium ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector line between steps — not after last step */}
            {index < steps.length - 1 && (
              <div
                className={`
                  h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-all duration-500
                  ${isCompleted ? "bg-blue-600" : "bg-gray-700"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
