import React from 'react';

export interface Step {
  label: string;
  completed?: boolean;
}

interface ProgressFlowStepperProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

export const ProgressFlowStepper: React.FC<ProgressFlowStepperProps> = ({
  steps,
  currentStepIndex,
  onStepClick
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = step.completed || index < currentStepIndex;

        return (
          <div
            key={index}
            onClick={() => onStepClick?.(index)}
            style={{
              cursor: onStepClick ? 'pointer' : 'default',
              marginRight: '16px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {/* Circle indicating step status */}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isCompleted ? 'green' : isActive ? 'blue' : 'gray',
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '8px'
              }}
            >
              {index + 1}
            </div>
            {/* Step Label */}
            <span>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};
