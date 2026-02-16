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

// ─── Steps ───────────────────────────────────────────────────────────

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'screen_time',
        question: 'What is your daily average screen time?',
        type: 'single-select',
        options: [
            { label: 'Under 1 hour', value: 'under_1' },
            { label: '1–3 hours', value: '1_3' },
            { label: '3–4 hours', value: '3_4' },
            { label: '4–5 hours', value: '4_5' },
            { label: '5–7 hours', value: '5_7' },
            { label: 'More than 7 hours', value: '7_plus' },
        ],
    },
    {
        id: 'age',
        question: 'How old are you?',
        type: 'number-picker',
        min: 10,
        max: 80,
        unit: 'years old',
        defaultValue: 17,
    },
    {
        id: 'focus_time',
        question: 'When do you want focused time?',
        type: 'single-select',
        options: [
            { label: 'Morning', subtitle: '6 AM – 12 PM', value: 'morning' },
            { label: 'Afternoon', subtitle: '12 PM – 6 PM', value: 'afternoon' },
            { label: 'Evening', subtitle: '6 PM – 12 AM', value: 'evening' },
            { label: 'Custom', subtitle: 'Set Duration', value: 'custom' },
        ],
    },
];
