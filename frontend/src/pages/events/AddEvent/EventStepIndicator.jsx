import { CheckIcon } from "@heroicons/react/24/outline";

const EventStepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Basic Info" },
    { id: 2, name: "Weight Classes" },
    { id: 3, name: "Seat Zones" },
    { id: 4, name: "Matches" },
  ];

  return (
    <div className="my-6">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
              {step.id < currentStep ? (
                <div className="group flex items-center">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white">
                    <CheckIcon className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                </div>
              ) : step.id === currentStep ? (
                <div className="flex items-center" aria-current="step">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-rose-600 bg-white text-rose-600">
                    {step.id}
                  </span>
                  <span className="ml-4 text-sm font-medium text-rose-600">{step.name}</span>
                </div>
              ) : (
                <div className="group flex items-center">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-500">
                    {step.id}
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500">{step.name}</span>
                </div>
              )}
              {stepIdx !== steps.length - 1 && (
                <div className={`hidden md:block absolute top-5 left-5 w-full h-0.5 ${step.id < currentStep ? 'bg-rose-600' : 'bg-gray-300'}`}></div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default EventStepIndicator;