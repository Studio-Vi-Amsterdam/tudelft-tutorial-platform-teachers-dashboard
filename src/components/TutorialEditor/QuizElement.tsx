import React, { useEffect, useState } from 'react';
import { setElementQuiz } from 'src/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { RootState } from 'src/redux/store';
import { QuizAnswer, QuizElementProps } from 'src/types/types';

const QuizElement = (props: QuizElementProps) => {
    const quiz = useAppSelector((state: RootState) =>
        props.block === 'tutorialElements' && props.listIndex !== undefined
            ? state.editor.tutorialTop.elements[props.listIndex].quiz
            : props.block === 'chapterElements' &&
              props.chapterIndex !== undefined &&
              props.listIndex !== undefined
            ? state.editor.chapters[props.chapterIndex].elements[
                  props.listIndex
              ].quiz
            : props.block === 'subchapterElements' &&
              props.chapterIndex !== undefined &&
              props.subchapterIndex !== undefined &&
              props.listIndex !== undefined &&
              state.editor.chapters[props.chapterIndex].subchapters[
                  props.subchapterIndex
              ].elements[props.listIndex].quiz
    );

    const dispatch = useAppDispatch();

    const [localQuestion, setLocalQuestion] = useState<string>(
        quiz ? quiz.question : ''
    );
    const [localAnswers, setLocalAnswers] = useState<QuizAnswer[]>(
        quiz ? quiz.answers : [{ answer: '', isCorrect: '1' }]
    );

    const handleChangeLocalAnswer = (index: number, newValue: string) => {
        const updatedAnswers = localAnswers.map((answer, i) =>
            i === index ? { ...answer, answer: newValue } : answer
        );
        setLocalAnswers(updatedAnswers);
    };

    useEffect(() => {
        dispatch(
            setElementQuiz({
                block: props.block,
                index: props.listIndex,
                nestedIndex: props.chapterIndex,
                subchapterIndex: props.subchapterIndex,
                quiz: {
                    question: localQuestion,
                    answers: localAnswers,
                    answersCount: localAnswers.length,
                },
            })
        );
    }, [localAnswers, localQuestion]);

    return quiz ? (
        <div className="flex w-full flex-col gap-y-2 rounded-[4px] border [&>div>input]:border-b [&>div>input]:border-[#999999] [&>div>input]:bg-transparent [&>div>p]:text-xs [&>div>p]:leading-5 [&>div]:gap-y-2 [&>div]:py-4">
            <div className="flex w-full flex-col bg-tertiary-grey-silver p-4">
                <p>Question</p>
                <input
                    type="text"
                    value={localQuestion}
                    onChange={(e) => setLocalQuestion(e.target.value)}
                    placeholder="Please write your question here."
                />
            </div>
            {localAnswers &&
                localAnswers.map((answer, index) => (
                    <div key={index} className="flex w-full flex-col p-4">
                        <p>
                            {answer.isCorrect === '0'
                                ? `False answer `
                                : answer.isCorrect === '1' && 'Correct answer'}
                        </p>
                        <input
                            type="text"
                            value={answer.answer}
                            onChange={(e) =>
                                handleChangeLocalAnswer(index, e.target.value)
                            }
                            placeholder={'Please write your answer here.'}
                        />
                    </div>
                ))}
        </div>
    ) : (
        <div></div>
    );
};

export default QuizElement;
