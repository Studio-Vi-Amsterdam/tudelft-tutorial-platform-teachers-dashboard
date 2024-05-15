import React from 'react';
import TestEditor from '../TestEditor';
import { Button } from 'src/components/common/Button/Button';
import { ChapterElementsObject } from 'src/redux/features/types';
import { useAppDispatch } from 'src/redux/hooks';
import {
    setElementInfobox,
    setElementText,
} from 'src/redux/features/editorSlice';

interface ElementsBlockProps {
    elements: Array<ChapterElementsObject>;
    block: string;
}

const ElementsBlock = (props: ElementsBlockProps) => {
    const { elements, block } = props;
    const dispatch = useAppDispatch();
    const handleTextElementChange = (
        value: string,
        index?: number,
        block?: string
    ): void => {
        if (block !== undefined && index !== undefined) {
            dispatch(setElementText({ block, index, text: value }));
        }
    };

    const handleInfoboxElementChange = (
        value: string,
        index?: number,
        block?: string
    ): void => {
        if (block !== undefined && index !== undefined) {
            dispatch(setElementInfobox({ block, index, infobox: value }));
        }
    };
    return (
        <div className="flex w-full flex-col">
            {elements.map((element, index) => (
                <div className="w-full" key={index}>
                    {element?.text !== undefined && (
                        <TestEditor
                            key={index}
                            value={element.text}
                            handleChange={handleTextElementChange}
                            block={block}
                            index={index}
                            placeholder="Text"
                        />
                    )}
                    {element?.infobox !== undefined && (
                        <TestEditor
                            key={index}
                            value={element.infobox}
                            handleChange={handleInfoboxElementChange}
                            block={block}
                            index={index}
                            placeholder="Infobox"
                        />
                    )}
                    {element?.image !== undefined && (
                        <div className="flex w-full flex-col gap-y-2">
                            <div className="flex w-full items-center justify-center bg-tertiary-grey-silver py-16">
                                <Button variant={'outline'}>
                                    <div>+</div>
                                    <p>Select image from media library</p>
                                </Button>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" />
                                <p>Show subtitles</p>
                            </div>
                        </div>
                    )}
                    {element?.video !== undefined && (
                        <div className="flex w-full flex-col gap-y-2">
                            <div className="flex w-full items-center justify-center bg-tertiary-grey-silver py-16">
                                <Button variant={'outline'}>
                                    <div>+</div>
                                    <p>Select video from media library</p>
                                </Button>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" />
                                <p>Show subtitles</p>
                            </div>
                        </div>
                    )}
                    {element?.file !== undefined && (
                        <div className="flex w-full flex-col gap-y-2">
                            <div className="flex w-full items-center justify-center bg-tertiary-grey-silver py-16">
                                <Button variant={'outline'}>
                                    <div>+</div>
                                    <p>Select video from media library</p>
                                </Button>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" />
                                <p>Show subtitles</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ElementsBlock;
