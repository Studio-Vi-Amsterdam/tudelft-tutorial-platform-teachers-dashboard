import React from 'react';
import { Button } from 'src/components/ui/Button';

interface AddElementBlockProps {
    elements: Array<string>;
    setAddElementsActive: (value: boolean) => void;
    addElementsActive: boolean;
    handleAddElement: (value: string, index?: number) => void;
    index?: number;
}

const AddElementBlock = (props: AddElementBlockProps) => {
    const {
        elements,
        addElementsActive,
        setAddElementsActive,
        handleAddElement,
    } = props;

    const handleAddTutorialElementClick = (): void => {
        if (addElementsActive) {
            setAddElementsActive(false);
        } else {
            setAddElementsActive(true);
        }
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
                            onClick={() => handleAddElement(el, props?.index)}
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
