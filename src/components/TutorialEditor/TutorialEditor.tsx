import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import TutorialTopSection from './TutorialTopSection';
import TutorialButtonsSection from './TutorialButtonsSection';
import AddChapterSection from './AddChapterSection';

const BlogEditor = () => {
    const tutorialTitle = useAppSelector(
        (state: RootState) => state.editor.tutorialTop.title
    );
    const chapters = useAppSelector(
        (state: RootState) => state.editor.chapters
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log(chapters);
    }, [chapters]);

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
                <AddChapterSection />
            </div>
        </main>
    );
};

export default BlogEditor;
