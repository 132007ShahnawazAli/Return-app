// ─── Onboarding Step Types ───────────────────────────────────────────

export type StepType = 'single-select' | 'number-picker' | 'multi-select';

export interface SelectOption {
    label: string;
    subtitle?: string;
    value: string;
}

export interface OnboardingStep {
    id: string;
    question: string;
    type: StepType;
    // For single-select and multi-select
    options?: SelectOption[];
    // For number-picker
    min?: number;
    max?: number;
    unit?: string;
    defaultValue?: number;
}
