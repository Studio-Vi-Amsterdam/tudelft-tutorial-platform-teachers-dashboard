import React, { useEffect, useState } from 'react';
import EditorLabel from '../ui/EditorLabel';
import {
    EditorBelongsInterface,
    ObjectNameType,
    TutorialResponsibleInterface,
} from 'src/types/types';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import {
    addKeywordsToList,
    changeMetaField,
    deleteKeyword,
} from 'src/redux/features/editorSlice';
import MetaInput from '../ui/MetaInput';
import MetaSelect from '../ui/MetaSelect';
import { Button } from '../ui/Button';

const TutorialBelongsToSection = () => {
    const [belongsKeys, setBelongsKeys] = useState<
        Array<keyof EditorBelongsInterface> | undefined
    >(undefined);
    const [responsibleKeys, setResponsibleKeys] = useState<
        Array<keyof TutorialResponsibleInterface> | undefined
    >(undefined);

    const belongsFields = useAppSelector(
        (state: RootState) => state.editor.meta.belongs
    );
    const responsibleFields = useAppSelector(
        (state: RootState) => state.editor.meta.responsible
    );

    const dispatch = useAppDispatch();

    const handleMetaInputKeywordsChange = (
        value: string,
        objectName: ObjectNameType,
        belongsKeyName?: keyof EditorBelongsInterface,
        responsibleKeyName?: keyof TutorialResponsibleInterface
    ) => {
        if (value[value.length - 1] === ';') {
            dispatch(addKeywordsToList(value.split(';')[0]));
            dispatch(
                changeMetaField({
                    value: '',
                    objectName: objectName,
                    belongsKeyName: belongsKeyName,
                })
            );
        } else {
            dispatch(
                changeMetaField({
                    value: value,
                    objectName: objectName,
                    belongsKeyName: belongsKeyName,
                })
            );
        }
    };

    const handleMetaInputChange = (
        value: string,
        objectName: ObjectNameType,
        belongsKeyName?: keyof EditorBelongsInterface,
        responsibleKeyName?: keyof TutorialResponsibleInterface
    ) => {
        if (belongsKeyName) {
            dispatch(
                changeMetaField({
                    value: value,
                    objectName: objectName,
                    belongsKeyName: belongsKeyName,
                })
            );
        } else if (responsibleKeyName) {
            dispatch(
                changeMetaField({
                    value: value,
                    objectName: objectName,
                    responsibleKeyName: responsibleKeyName,
                })
            );
        }
    };

    const deleteKeywordFromList = (keyword: string) => {
        dispatch(deleteKeyword(keyword));
    };

    useEffect(() => {
        if (belongsFields && responsibleFields) {
            setBelongsKeys(
                Object.keys(belongsFields) as Array<
                    keyof EditorBelongsInterface
                >
            );
            setResponsibleKeys(
                Object.keys(responsibleFields) as Array<
                    keyof TutorialResponsibleInterface
                >
            );
        }
    }, []);

    return (
        <section className="relative flex w-full flex-col gap-y-6 py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
            <EditorLabel>
                Filling in the subject mandatory to ensure the right navigation.
                If this tutorial also belongs to a course ans software, please
                also fill that in. This information won’t be displayed, but used
                to place the tutorial in the right place in the sitemap.
            </EditorLabel>
            <h3 className="font-bold">This tutorial belongs to</h3>
            <div className="flex flex-col gap-y-8">
                {belongsFields &&
                    belongsKeys?.map((keyName, index) => (
                        <div key={index} className="flex w-full flex-col">
                            <div
                                key={index}
                                className="flex w-full flex-row items-center justify-between"
                            >
                                <div>{`${belongsFields[keyName].fieldTitle}${
                                    belongsFields[keyName].required ? '*' : ''
                                }`}</div>
                                <div className="w-9/12">
                                    {keyName === 'keywords' ? (
                                        <MetaInput
                                            handleChange={
                                                handleMetaInputKeywordsChange
                                            }
                                            objectName="belongs"
                                            placeholder={
                                                belongsFields[keyName]
                                                    .fieldTitle
                                            }
                                            value={belongsFields[keyName].value}
                                            belongsKeyName={keyName}
                                        />
                                    ) : keyName === 'image' ? (
                                        <Button variant={'outline'}>
                                            <div>+</div>
                                            <p>
                                                Select image from media library
                                            </p>
                                        </Button>
                                    ) : belongsFields[keyName]?.list ? (
                                        <MetaSelect
                                            fieldTitle={
                                                belongsFields[keyName]
                                                    .fieldTitle
                                            }
                                            handleMetaInputChange={
                                                handleMetaInputChange
                                            }
                                            objectType="belongs"
                                            options={
                                                belongsFields[keyName].list
                                            }
                                            selectValue={
                                                belongsFields[keyName].value
                                            }
                                            belongsKeyName={keyName}
                                        />
                                    ) : (
                                        <MetaInput
                                            handleChange={handleMetaInputChange}
                                            objectName="belongs"
                                            placeholder={
                                                belongsFields[keyName]
                                                    .fieldTitle
                                            }
                                            value={belongsFields[keyName].value}
                                            belongsKeyName={keyName}
                                        />
                                    )}
                                </div>
                            </div>
                            {keyName === 'keywords' && (
                                <div className="flex w-full flex-row justify-end">
                                    <div className="flex w-9/12 flex-row flex-wrap gap-x-2 gap-y-2 pt-4">
                                        {belongsFields[keyName].list.map(
                                            (keyword, index) => (
                                                <button
                                                    key={index}
                                                    className="relative rounded-[4px] bg-tertiary-skyBlue-10 py-1 pl-2 pr-8 before:absolute before:right-2 before:top-1/2 before:h-4 before:w-4 before:-translate-y-1/2 before:bg-cross before:bg-center before:bg-no-repeat"
                                                    onClick={() =>
                                                        deleteKeywordFromList(
                                                            keyword
                                                        )
                                                    }
                                                >
                                                    {keyword}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
            <h3 className="font-bold">Responsible</h3>
            <div className="flex flex-col gap-y-8">
                {responsibleFields &&
                    responsibleKeys?.map((keyName, index) => (
                        <div key={index} className="flex w-full flex-col">
                            <div className="flex w-full flex-row items-center justify-between">
                                <div>{`${
                                    responsibleFields[keyName].fieldTitle
                                }${
                                    responsibleFields[keyName].required
                                        ? '*'
                                        : ''
                                }`}</div>
                                <div className="w-9/12">
                                    {responsibleFields[keyName]?.list ? (
                                        <MetaSelect
                                            fieldTitle={
                                                responsibleFields[keyName]
                                                    .fieldTitle
                                            }
                                            handleMetaInputChange={
                                                handleMetaInputChange
                                            }
                                            objectType="responsible"
                                            options={
                                                responsibleFields[keyName].list
                                            }
                                            selectValue={
                                                responsibleFields[keyName].value
                                            }
                                            responsibleKeyName={keyName}
                                        />
                                    ) : (
                                        <MetaInput
                                            handleChange={handleMetaInputChange}
                                            objectName="responsible"
                                            placeholder={
                                                responsibleFields[keyName]
                                                    .fieldTitle
                                            }
                                            value={
                                                responsibleFields[keyName].value
                                            }
                                            responsibleKeyName={keyName}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
};

export default TutorialBelongsToSection;
