import styled from '@emotion/styled';
import * as Colour from 'color-bits';

const getStepStatusColour = (props: {
  onStepClick: boolean,
  isActive: boolean,
  isCompleted: boolean
}) => {
  if (props.isActive) {
    return COLOURS.primary;
  } else if (props.isCompleted) {
    return COLOURS.success;
  } else {
    return COLOURS.grey;
  }
}

const COLOURS = {
  primary: '#53cbba',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#ff3e5a',
  warning: '#ffc107',
  info: '#17a2b8',
  black: '#000000',
  white: '#ffffff',
  grey: '#6c757d',
  lightGrey: '#e0e0e0',
}

const StepContainer = styled("div") <{
  onStepClick: boolean,
  isActive: boolean,
  isCompleted: boolean
}>`
  margin-right: 16px;
  display: flex;
  position: relative;
  align-items: center;
  border-radius: 1rem;
  padding: 0.75rem 1.5rem;
  flex-direction: column;
  min-width: 200px;
  cursor: pointer;
  border: 2px solid ${COLOURS.lightGrey};
  margin-bottom: 4rem;
  transform: scale(1);
  transition: all 0.2s ease-in-out;

  border-color: ${(props: any) =>
    Colour.formatHEX(Colour.lighten(Colour.parse(getStepStatusColour(props)), 0.5))
  };

  &:hover {
    border-color: ${(props: any) =>
      Colour.formatHEX(Colour.lighten(Colour.parse(getStepStatusColour(props)), 0.1))
    };
  }

  &:not(:first-child)::before {
    content: "";
    position: absolute;
    width: 2px;
    height: 48px;
    background-color: ${props => Colour.formatHEX(Colour.lighten(Colour.parse(getStepStatusColour(props)), 0.3))};
    top: -5.5rem;
    left: 50%;
    transform: translate(-50%, 0);
  }

  &:last-child {
    margin-bottom: 1rem;
  }
`;

const TitleLabel = styled("h3")`
  font-size: 1.5rem;
  margin: 1rem 0;
`;

const Subtitle = styled("p")`
  font-size: 1rem;
  margin: 0 0 1rem;
`;

const ProgressCirclePoint = styled("div") <{
  isActive: boolean,
  isCompleted: boolean
}>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: ${(props: any) => getStepStatusColour(props)};
`;

export type Step = {
  label: string;
  subtitle?: string;
  completed?: boolean;
}

export interface StepProps {
  step: Step;
  index: number;
  currentStepIndex: number;
  onStepClick?: (index: number) => void;
}

const StepComponent = (props: StepProps) => {
  const { step, index, currentStepIndex, onStepClick } = props;
  const isActive = index === currentStepIndex;
  const isCompleted = step.completed || index < currentStepIndex;

  return (
    <StepContainer
      key={index}
      onClick={() => onStepClick?.(index)}
      onStepClick={!!onStepClick}
      isActive={isActive}
      isCompleted={isCompleted}
    >
      {/* Step Label */}
      <TitleLabel>{step.label}</TitleLabel>
      <Subtitle>{step.subtitle}</Subtitle>
      <ProgressCirclePoint
        isActive={isActive}
        isCompleted={isCompleted}
      >

      </ProgressCirclePoint>
    </StepContainer>
  );
}

export default StepComponent;