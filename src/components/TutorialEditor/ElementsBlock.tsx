import React, { useEffect, useRef } from 'react';
import { Button } from 'src/components/ui/Button';
import { useAppDispatch } from 'src/redux/hooks';
import {
    setElementInfobox,
    setElementText,
} from 'src/redux/features/editorSlice';
import BundledEditor from './BundledEditor';
import { ChapterElementsObject } from 'src/types/types';

interface ElementsBlockProps {
    elements: Array<ChapterElementsObject>;
    block: string;
    chapterIndex?: number;
}

const ElementsBlock = (props: ElementsBlockProps) => {
    const { elements, block, chapterIndex } = props;
    const dispatch = useAppDispatch();
    const handleTextElementChange = (
        value: string,
        index?: number,
        block?: string
    ): void => {
        if (block !== undefined && index !== undefined) {
            dispatch(
                setElementText({
                    block,
                    index,
                    text: value,
                    nestedIndex: chapterIndex,
                })
            );
        }
    };

    const handleInfoboxElementChange = (
        value: string,
        index?: number,
        block?: string
    ): void => {
        if (block !== undefined && index !== undefined) {
            dispatch(
                setElementInfobox({
                    block,
                    index,
                    infobox: value,
                    nestedIndex: chapterIndex,
                })
            );
        }
    };

    useEffect(() => {
        console.log(elements);
    }, [elements]);

    return (
        <div className="flex w-full flex-col gap-y-6">
            {elements.map((element, index) => (
                <div className="w-full" key={index}>
                    {element?.text !== undefined && (
                        <BundledEditor
                            value={element.text}
                            block={block}
                            index={index}
                            handleChange={handleTextElementChange}
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

                                toolbar:
                                    'bullist numlist link code table command',
                            }}
                        />
                    )}
                    {element?.infobox !== undefined && (
                        <BundledEditor
                            value={element.infobox}
                            block={block}
                            index={index}
                            handleChange={handleInfoboxElementChange}
                            init={{
                                menubar: false,
                                plugins: [
                                    'table',
                                    'lists',
                                    'link',
                                    'autoresize',
                                    'command',
                                ],

                                toolbar: 'bullist numlist link table',
                            }}
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
