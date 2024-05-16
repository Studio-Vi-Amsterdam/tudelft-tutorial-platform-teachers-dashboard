import React, { useState } from 'react';
import EditorLabel from 'src/components/ui/EditorLabel';
import TextInput from 'src/components/ui/TextInput';
import Tip from 'src/components/ui/Tip';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
    addTutorialElements,
    setTutorialDescription,
    setTutorialTitle,
} from 'src/redux/features/editorSlice';
import { RootState } from 'src/redux/store';
import AddElementBlock from './AddElementBlock';
import ElementsBlock from './ElementsBlock';
import BundledEditor from './BundledEditor';

interface TutorialTopSectionProps {
    tutorialTitle: string;
}

const TutorialTopSection = (props: TutorialTopSectionProps) => {
    const { tutorialTitle } = props;
    const [addTutorialElementsActive, setAddTutorialElementsActive] =
        useState<boolean>(false);

    const tutorialDescription = useAppSelector(
        (state: RootState) => state.editor.tutorialTop.description
    );

    const tutorialStateElements = useAppSelector(
        (state: RootState) => state.editor.tutorialTop.elements
    );

    const dispatch = useAppDispatch();

    const handleTutorialTitleInputChange = (value: string): void => {
        dispatch(setTutorialTitle(value));
    };

    const handleTutorialDescriptionInputChange = (value: string): void => {
        dispatch(setTutorialDescription(value));
    };

    const tutorialElements = ['text', 'infobox', 'image', 'video'];
    const handleAddTutorialElement = (value: string): void => {
        const payload: any = {};

        payload[value] = '';

        dispatch(addTutorialElements(payload));
        setAddTutorialElementsActive(false);
    };

    return (
        <section className="relative flex w-full flex-col gap-y-6 py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
            <EditorLabel>
                This section is mandatory for all tutorials and appears on top
                of the tutorial page.
            </EditorLabel>
            <TextInput
                handleChange={handleTutorialTitleInputChange}
                value={tutorialTitle}
                placeholder="Tutorial title"
                headingType="h1"
            />
            {/* <TestEditor
                handleChange={handleTutorialDescriptionInputChange}
                value={tutorialDescription}
                placeholder="Write the course description with the learning outcomes here."
            /> */}
            <BundledEditor
                value={tutorialDescription}
                handleChange={handleTutorialDescriptionInputChange}
                init={{
                    menubar: false,
                    plugins: [
                        'table',
                        'lists',
                        'link',
                        'code',
                        'autoresize',
                        'command',
                    ],

                    toolbar: 'bullist numlist link code table command',
                }}
            />
            <Tip>
                <p>
                    Learning outcomes clearly explain, with measurable verbs,
                    what the learner will be able to do, and know by the end of
                    your course.
                </p>
                <ul className="list-disc pl-4">
                    <li>What skills will they be able to demonstrate?</li>
                    <li>What new knowledge will they have obtained?</li>
                </ul>
            </Tip>
            <ElementsBlock
                block="tutorialElements"
                elements={tutorialStateElements}
            />
            <AddElementBlock
                addElementsActive={addTutorialElementsActive}
                setAddElementsActive={setAddTutorialElementsActive}
                elements={tutorialElements}
                handleAddElement={handleAddTutorialElement}
            />
        </section>
    );
};

export default TutorialTopSection;
