import { CheckIcon } from "@heroicons/react/24/outline";

/**
 * StepBar Component - Displays a horizontal progress indicator for multi-step forms
 * 
 * @param {Object} props Component props
 * @param {number} props.currentStep Current active step (1-based index)
 * @param {Array} props.steps Array of step labels
 * @param {Function} props.onStepClick Optional callback for when a step is clicked
 * @param {boolean} props.allowNavigation Whether to allow navigation to previous steps
 */
const StepBar = ({ currentStep, steps, onStepClick, allowNavigation = true }) => {
  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;
          const isClickable = allowNavigation && isCompleted;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                  ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 text-gray-500"
                  }
                  ${isClickable ? "cursor-pointer hover:brightness-110" : "cursor-default"}
                `}
                aria-current={isActive ? "step" : undefined}
              >
                {isCompleted ? (
                  <CheckIcon className="w-6 h-6" />
                ) : (
                  stepNumber
                )}
              </button>
              <p className={`mt-2 text-xs font-medium ${
                isActive
                  ? "text-primary"
                  : isCompleted
                    ? "text-green-500"
                    : "text-gray-500"
              }`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="relative mt-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepBar;