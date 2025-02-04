import { JSX } from 'react';
import { type Step } from './Step';
export interface ProgressFlowStepperProps {
    steps: Step[];
    currentStepIndex: number;
    onStepClick?: (index: number) => void;
}
export declare function ProgressFlowStepper({ steps, currentStepIndex, onStepClick, }: ProgressFlowStepperProps): JSX.Element;
