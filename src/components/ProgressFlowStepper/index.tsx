import { JSX } from 'react';
import { type Step, StepComponent } from './Step';
import styled from '@emotion/styled'


export interface ProgressFlowStepperProps {
  steps: Step[];
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

const StepperContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  gap: 4rem;
  margin: 4rem 0;
`;

export function ProgressFlowStepper({
  steps,
  currentStepIndex,
  onStepClick,
}: ProgressFlowStepperProps): JSX.Element {

  return (
    <StepperContainer>
      {
        steps.map((step, index) =>
          <StepComponent
            key={index}
            step={step}
            index={index}
            currentStepIndex={currentStepIndex}
            onStepClick={onStepClick}
          />)
      }
    </StepperContainer>
  );
};
