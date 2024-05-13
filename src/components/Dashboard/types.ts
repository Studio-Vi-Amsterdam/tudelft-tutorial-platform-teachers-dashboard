export interface TutorialCard {
    type: 'course' | 'subject' | 'software' | 'tutorial';
    name: string;
    published: Date;
    lastEdit: Date;
}

export interface DashboardSectionProps {
    items: Array<TutorialCard>;
    heading: string;
}

export interface HardcodeTestDataInterface {
    username: string;
    onboarding?: Array<{
        name: string;
        text: string;
        link: string;
        imgSrc: string;
    }>;
    published?: Array<TutorialCard>;
    drafts?: Array<TutorialCard>;
}
