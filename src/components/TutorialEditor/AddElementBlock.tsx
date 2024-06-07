import React, { useState } from 'react';
import { Button } from 'src/components/ui/Button';

interface AddElementBlockProps {
    elements: Array<string>;
    handleAddElement: (
        value: string,
        index?: number,
        subchapterIndex?: number
    ) => void;
    index?: number;
    subchapterIndex?: number;
}

const AddElementBlock = (props: AddElementBlockProps) => {
    const [addElementsActive, setAddElementsActive] = useState<boolean>(false);
    const { elements, subchapterIndex } = props;

    const handleAddTutorialElementClick = (): void => {
        if (addElementsActive) {
            setAddElementsActive(false);
        } else {
            setAddElementsActive(true);
        }
    };

    const handleAddElement = (el: string) => {
        setAddElementsActive(false);
        props.handleAddElement(el, props?.index, subchapterIndex);
    };

    return (
        <div className="flex w-full flex-row gap-x-6">
            <div className="w-1/3">
                <Button
                    variant={'outline'}
                    onClick={handleAddTutorialElementClick}
                >
                    <div>+</div>
                    <p>Add element</p>
                </Button>
            </div>
            {addElementsActive && (
                <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
                    {elements.map((el, index) => (
                        <Button
                            variant={'elements'}
                            key={index}
                            onClick={() => handleAddElement(el)}
                        >
                            <p className="capitalize">{el}</p>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddElementBlock;
