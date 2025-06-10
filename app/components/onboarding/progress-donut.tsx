import { Check } from "lucide-react";

interface ProgressDonutProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressDonut({ currentStep, totalSteps, className = "" }: ProgressDonutProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;
  const isCompleted = currentStep === totalSteps;

  const size = 20;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {isCompleted ? (
        <span
          style={{ height: size, width: size }}
          className="flex -translate-x-px -translate-y-px items-center justify-center rounded-full bg-foreground"
        >
          <Check strokeWidth={3} size={12} className=" text-white" />
        </span>
      ) : (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgb(214 211 209)" // stone-300
              strokeWidth={strokeWidth}
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgb(68 64 60)" // stone-700
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </>
        </svg>
      )}
    </div>
  );
}
