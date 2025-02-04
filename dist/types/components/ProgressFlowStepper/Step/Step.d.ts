export type Step = {
    label: string;
    subtitle?: string;
    completed?: boolean;
};
export interface StepProps {
    step: Step;
    index: number;
    currentStepIndex: number;
    onStepClick?: (index: number) => void;
}
declare const StepComponent: (props: StepProps) => import("@emotion/react/jsx-runtime").JSX.Element;
export default StepComponent;
