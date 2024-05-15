import React from 'react';

import { useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import TutorialButtonsSection from './TutorialButtonsSection/TutorialButtonsSection';
import TutorialTopSection from './TutorialTopSection/TutorialTopSection';

const BlogEditor = () => {
    const tutorialTitle = useAppSelector(
        (state: RootState) => state.editor.tutorialTop.title
    );

    return (
        <main className="container mx-auto flex flex-auto flex-row justify-between">
            <div className="relative w-1/4 text-white">
                <p>Index</p>
                <div className="flex flex-col">
                    <h1>
                        {tutorialTitle.replaceAll('\\s+', '') === ''
                            ? 'Tutorial Title'
                            : tutorialTitle}
                    </h1>
                </div>
                <div className="absolute right-0 top-0 -z-10 h-full w-[300%] bg-secondary-navy"></div>
            </div>
            <div className="flex w-3/4 flex-col items-start pl-4">
                <TutorialButtonsSection />
                <TutorialTopSection tutorialTitle={tutorialTitle} />
            </div>
        </main>
    );
};

export default BlogEditor;
