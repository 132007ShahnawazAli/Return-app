export interface IdeaConfig {
    title: string;
    subtitle: string;
    time: string;
    color: string;
    lightColor: string;
    btnColor: string;
    btnBorder: string;
    defaultDays: string[];
    defaultDuration: number;
    Illustration: React.FC<any>;
}

export type IdeaKey = 'workout' | 'dinner' | 'study';
