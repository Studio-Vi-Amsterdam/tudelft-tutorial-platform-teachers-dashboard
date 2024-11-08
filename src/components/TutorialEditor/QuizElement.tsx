import React, { useEffect, useState } from 'react'
import { setElementQuiz } from 'src/redux/features/editorSlice'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { QuizAnswer, QuizElementProps, TextElementInterface } from 'src/types/types'

const QuizElement = (props: QuizElementProps) => {
  const quiz = useAppSelector((state: RootState) =>
    props.block === 'tutorialElements' && props.listIndex !== undefined
      ? state.editor.tutorialTop.elements[props.listIndex].quiz
      : props.block === 'chapterElements' &&
          props.chapterIndex !== undefined &&
          props.listIndex !== undefined
        ? state.editor.chapters[props.chapterIndex].elements[props.listIndex].quiz
        : props.block === 'subchapterElements' &&
          props.chapterIndex !== undefined &&
          props.subchapterIndex !== undefined &&
          props.listIndex !== undefined &&
          state.editor.chapters[props.chapterIndex].subchapters[props.subchapterIndex].elements[
            props.listIndex
          ].quiz,
  )

  const dispatch = useAppDispatch()

  const [localQuestion, setLocalQuestion] = useState<TextElementInterface>(
    quiz ? quiz.question : { text: '', isValid: true },
  )
  const [localAnswers, setLocalAnswers] = useState<QuizAnswer[]>(
    quiz ? quiz.answers : [{ answer: '', isCorrect: '1', isValid: true }],
  )

  useEffect(() => {
    if (quiz) {
      setLocalAnswers(quiz ? quiz.answers : [{ answer: '', isCorrect: '1', isValid: true }])
      setLocalQuestion(quiz ? quiz.question : { text: '', isValid: true })
    }
  }, [quiz])

  useEffect(() => {
    quiz && console.log('quiz answers', quiz.answers)
  }, [quiz])

  const handleChangeLocalAnswer = (index: number, newValue: string) => {
    const updatedAnswers = localAnswers.map((answer, i) =>
      i === index ? { ...answer, answer: newValue, isValid: newValue.trim().length > 0 } : answer,
    )
    setLocalAnswers(updatedAnswers)
  }

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
      }),
    )
  }, [localAnswers, localQuestion])

  return quiz ? (
    <div className="flex w-full flex-col rounded-[4px] border border-dim [&>div>input]:border-b [&>div>input]:border-[#999999] [&>div>input]:bg-transparent [&>div>p]:text-xs [&>div>p]:leading-5 [&>div]:gap-y-2 [&>div]:py-4">
      <div
        className={`flex w-full flex-col bg-tertiary-grey-silver px-4 rounded-[3px] ${localQuestion.isValid ? 'border border-transparent' : 'border border-red-500'}`}
      >
        <p>Question</p>
        <input
          type="text"
          value={localQuestion.text}
          onChange={(e) =>
            setLocalQuestion({ text: e.target.value, isValid: e.target.value.trim().length > 0 })
          }
          placeholder="Please write your question here."
          className="focus-visible:outline-none"
        />
      </div>
      <div className="flex flex-col px-2 !gap-y-4 [&>div>p]:text-xs [&>div]:gap-y-2 ">
        {localAnswers &&
          localAnswers.map((answer, index) => (
            <div
              key={index}
              className={`flex w-full flex-col px-2  ${answer.isValid ? 'border border-transparent' : 'border border-red-500'}`}
            >
              <p>
                {answer.isCorrect === '0'
                  ? 'False answer '
                  : answer.isCorrect === '1' && 'Correct answer'}
              </p>
              <input
                type="text"
                value={answer.answer}
                onChange={(e) => handleChangeLocalAnswer(index, e.target.value)}
                placeholder={'Please write your answer here.'}
                className={`focus-visible:outline-none bg-transparent ${answer.isValid ? ' border-b border-[#999999]' : ''}`}
              />
            </div>
          ))}
      </div>
    </div>
  ) : (
    <div></div>
  )
}

export default QuizElement
