import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import TutorialTopSection from './TutorialTopSection';
import TutorialButtonsSection from './TutorialButtonsSection';
import AddChapterSection from './AddChapterSection';
import { ArtictesType, ChapterInterface } from 'src/types/types';
import ChapterSection from './ChapterSection';
import EditorSidebar from './EditorSidebar';
import TutorialBottomSection from './TutorialBottomSection';
import TutorialBelongsToSection from './TutorialBelongsToSection';
import { articlesAPI } from 'src/lib/api';
import { useLocation } from 'react-router-dom';
import { reducerParser } from 'src/lib/reducerParser';
import { setNewState } from 'src/redux/features/editorSlice';

const BlogEditor = () => {
    const dispatch = useAppDispatch();
    const params = new URLSearchParams(useLocation().search);
    const articleType = params.get('type');
    const articleId = params.get('id');
    useEffect(() => {
        console.log('articleId ', articleId);
        console.log('articleType ', articleType);
    }, [articleId, articleType]);

    useEffect(() => {
        const fetchData = async () => {
            if (articleType && articleId) {
                if (articleId !== 'new') {
                    const response = await articlesAPI
                        .getSingleArticle(
                            articleType as ArtictesType,
                            parseInt(articleId)
                        )
                        .then((res) => res.data);
                    const newObject = await reducerParser.parseToReducer(
                        response,
                        articleType as ArtictesType
                    );
                    dispatch(setNewState(newObject));
                } else if (articleId === 'new') {
                    dispatch(setNewState(undefined));
                }
            }
        };
        fetchData();
    }, []);
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
                <TutorialBottomSection />
                <TutorialBelongsToSection />
            </div>
        </main>
    );
};

export default BlogEditor;
