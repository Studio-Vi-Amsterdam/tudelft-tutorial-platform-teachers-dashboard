import React from 'react';
import BundledEditor from './BundledEditor';

interface BundledEditorProps {
    value: string;
    chapterIndex?: number;
    subchapterIndex?: number;
    subchapter: boolean;
    block?: string;
    handleInputChange?: (
        val: string,
        index: number,
        subchapterIndex: number
    ) => void;
    handleTextChange?: (val: string, index: number, block: string) => void;
}

const ReducedBundledEditor = (props: BundledEditorProps) => {
    return (
        <BundledEditor
            value={props.value}
            block={props.block}
            index={props.chapterIndex}
            subchapterIndex={props.subchapterIndex}
            subchapter={props.subchapter}
            handleChange={
                props.handleInputChange
                    ? props.handleInputChange
                    : props.handleTextChange
                    ? props.handleTextChange
                    : () => {}
            }
            init={{
                menubar: false,
                plugins: ['table', 'lists', 'link', 'autoresize', 'command'],

                toolbar: 'bullist numlist link table',
            }}
        />
    );
};

export default ReducedBundledEditor;
