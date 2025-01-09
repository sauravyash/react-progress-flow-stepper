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
export declare const ProgressFlowStepper: React.FC<ProgressFlowStepperProps>;
export {};
