import React from 'react';
import {
    EditorBelongsInterface,
    ObjectNameType,
    TutorialResponsibleInterface,
} from 'src/types/types';

interface MetaSelectProps {
    objectType: ObjectNameType;
    belongsKeyName?: keyof EditorBelongsInterface;
    responsibleKeyName?: keyof TutorialResponsibleInterface;
    handleMetaInputChange: (
        value: string,
        objectName: ObjectNameType,
        belongsKeyName?: keyof EditorBelongsInterface,
        responsibleKeyName?: keyof TutorialResponsibleInterface
    ) => void;
    selectValue: string;
    fieldTitle: string;
    options: string[] | [] | undefined;
}

const MetaSelect = (props: MetaSelectProps) => {
    return (
        <select
            value={props.selectValue}
            className="w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone"
            onChange={(e) =>
                props.handleMetaInputChange(
                    e.target.value,
                    props.objectType,
                    props?.belongsKeyName,
                    props.responsibleKeyName
                )
            }
        >
            <option value="">{props.fieldTitle}</option>
            {props.options &&
                props.options.map((listItem, index) => (
                    <option key={index} value={listItem}>
                        {listItem}
                    </option>
                ))}
        </select>
    );
};

export default MetaSelect;
