import React from 'react';
import { Button } from 'src/components/ui/Button';
import { articlesAPI } from 'src/lib/api';
import { reducerParser } from 'src/lib/reducerParser';
import { useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';

const TutorialButtonsSection = () => {
    const tutorial = useAppSelector((state: RootState) => state.editor);

    const testClick = () => {
        const parsedObject = reducerParser.parseFromReducer(
            tutorial,
            'publish'
        );
        try {
            articlesAPI
                .postArticle('tutorials', parsedObject)
                .then((res) => console.log(res));
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <section className="flex w-full flex-row items-center justify-end gap-x-6 py-14">
            <Button variant={'outline'} size={'lg'}>
                <p>Preview</p>
            </Button>
            <Button variant={'outline'} size={'lg'}>
                <p>Save as draft</p>
            </Button>
            <Button size={'lg'} onClick={testClick}>
                <p>Publish</p>
            </Button>
        </section>
    );
};

export default TutorialButtonsSection;
