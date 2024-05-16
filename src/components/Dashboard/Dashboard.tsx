import DashboardTutorialSection from './DashboardTutorialSection';
import AddNewTutorialButton from './AddNewTutorialButton';
import { HardcodeTestDataInterface } from 'src/types/types';

const Dashboard = () => {
    const hardcodeTestData: HardcodeTestDataInterface = {
        username: 'James',
        onboarding: [
            {
                name: 'Onboarding Video',
                text: 'This video will show you how to create a tutorial.',
                link: '',
                imgSrc: '/img/dashboard/onboarding-video.svg',
            },
            {
                name: 'Guidelines',
                text: 'Read this guidelines to create a tutorial according to the teaching objectives.',
                link: '',
                imgSrc: '/img/dashboard/onboarding-guidelines.svg',
            },
        ],
        published: [
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
        ],
        drafts: [
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
            {
                type: 'course',
                name: 'Computer Aided Design',
                lastEdit: new Date('2023-06-09'),
                published: new Date('2023-06-09'),
            },
        ],
    };

    return (
        <main className="container mx-auto mb-24 mt-20 flex flex-auto flex-col gap-y-16">
            <div className="flex flex-row items-center justify-between">
                <h2 className="font-RobotoSlab text-h2 font-light -tracking-1">
                    Hello {hardcodeTestData.username}
                </h2>
                <AddNewTutorialButton />
            </div>
            {hardcodeTestData?.onboarding && (
                <section className="flex flex-col">
                    <h3 className="mb-6 text-h3 -tracking-1 text-primary-skyBlue">
                        Onboarding
                    </h3>
                    <div className="flex flex-row gap-x-6">
                        {hardcodeTestData.onboarding.map((item, index) => (
                            <div
                                key={index}
                                className="flex w-1/2 flex-row gap-x-8 bg-background-aliceBlue p-8"
                            >
                                <div className="flex flex-col">
                                    <div className="flex flex-col gap-y-4 ">
                                        <h4 className="font-RobotoSlab text-2xl font-medium">
                                            {item.name}
                                        </h4>
                                        <p className="text-primary-subtext">
                                            {item.text}
                                        </p>
                                    </div>
                                    <button className="mt-14">
                                        <img
                                            src="/img/arrow-right.svg"
                                            alt={`Navigate to ${item.name}`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center">
                                    <img
                                        src={item.imgSrc}
                                        className="object-contain"
                                        alt={item.name}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {hardcodeTestData.published && (
                <DashboardTutorialSection
                    heading="My published tutorials"
                    items={hardcodeTestData.published}
                />
            )}
            {hardcodeTestData.drafts && (
                <DashboardTutorialSection
                    heading="My drafts"
                    items={hardcodeTestData.drafts}
                />
            )}
        </main>
    );
};

export default Dashboard;
