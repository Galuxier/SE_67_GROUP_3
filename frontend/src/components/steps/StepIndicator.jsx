import React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = ["Basic Info", "Schedule", "Activities", "Review"];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive ? "border-primary bg-primary text-white" : isCompleted ? "border-green-500 bg-green-500 text-white" : "border-gray-300 text-gray-500"}`}>
                {isCompleted ? <CheckIcon className="w-6 h-6" /> : stepNumber}
              </div>
              <p className={`mt-2 text-xs font-medium ${isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-gray-500"}`}>
                {steps[index]}
              </p>
            </div>
          );
        })}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-300" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
      </div>
    </div>
  );
};

export default StepIndicator;