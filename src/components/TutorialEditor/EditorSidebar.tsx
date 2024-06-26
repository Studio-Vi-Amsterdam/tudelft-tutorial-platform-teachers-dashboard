import React from 'react'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion'
import Preloader from '../ui/Preloader'

interface EditorSidebarProps {
  tutorialTitle: string
}

const EditorSidebar = (props: EditorSidebarProps) => {
  const chapters = useAppSelector((state: RootState) => state.editor.chapters)
  const isFetched = useAppSelector((state: RootState) => state.editor.isEditorLoaded)
  return (
    <div className="relative w-1/4 text-white">
      <div className="sticky top-0">
        <div className="py-10 font-RobotoSlab text-2xl font-medium">Index</div>
        <div className="flex flex-col">
          {isFetched ? (
            <>
              <h2 className="text-xl leading-8">
                {props.tutorialTitle.replaceAll('\\s+', '') === ''
                  ? 'Tutorial Title'
                  : props.tutorialTitle}
              </h2>
              <Accordion type="single" collapsible>
                {chapters.map((chapter, index) => (
                  <AccordionItem value={`chapter-item-${index}`} key={index}>
                    {chapter.subchapters.length > 0 ? (
                      <>
                        <AccordionTrigger>
                          {chapter.title !== '' ? chapter.title : `Chapter ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="mt-2 flex flex-col gap-y-2 pl-8">
                            {chapter.subchapters.map((subchapter, index) => (
                              <li key={index} className="cursor-pointer hover:underline">
                                {subchapter.title !== ''
                                  ? subchapter.title
                                  : `Subchapter ${index + 1}`}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </>
                    ) : (
                      <div className="mt-6 flex flex-1 cursor-pointer items-center justify-between pl-6 text-sm font-bold transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
                        {chapter.title !== '' ? chapter.title : `Chapter ${index + 1}`}
                      </div>
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          ) : (
            <Preloader color={'primary'} />
          )}
        </div>
      </div>
      <div className="absolute right-0 top-0 -z-10 h-full w-[300%] bg-secondary-navy"></div>
    </div>
  )
}

export default EditorSidebar
