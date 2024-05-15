import React from 'react';

interface TestEditorProps {
    value: string;
    placeholder: string;
    handleChange: (value: string, index?: number, block?: string) => void;
    index?: number;
    block?: string;
}

const TestEditor = (props: TestEditorProps) => {
    return (
        <div className="w-full">
            <textarea
                className="w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone"
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e) =>
                    props.handleChange(
                        e.target.value,
                        props?.index,
                        props?.block
                    )
                }
            />
        </div>
    );
};

export default TestEditor;
