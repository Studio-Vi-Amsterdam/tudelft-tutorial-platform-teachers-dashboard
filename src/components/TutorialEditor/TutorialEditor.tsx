import React, { useEffect } from 'react';

import { useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import TutorialTopSection from './TutorialTopSection';
import TutorialButtonsSection from './TutorialButtonsSection';
import AddChapterSection from './AddChapterSection';
import { ChapterInterface } from 'src/types/types';
import ChapterSection from './ChapterSection';
import EditorSidebar from './EditorSidebar';

const BlogEditor = () => {
    const tutorialTitle = useAppSelector(
        (state: RootState) => state.editor.tutorialTop.title
    );
    const chapters = useAppSelector(
        (state: RootState) => state.editor.chapters
    );

    return (
        <main className="container mx-auto flex flex-auto flex-row justify-between">
            <EditorSidebar tutorialTitle={tutorialTitle} />
            <div className="flex w-3/4 flex-col items-start pl-4">
                <TutorialButtonsSection />
                <TutorialTopSection tutorialTitle={tutorialTitle} />
                {chapters.length > 0 &&
                    chapters.map((chapter: ChapterInterface, index: number) => (
                        <ChapterSection
                            key={index}
                            chapter={chapter}
                            index={index}
                        />
                    ))}

                <AddChapterSection />
            </div>
        </main>
    );
};

export default BlogEditor;
