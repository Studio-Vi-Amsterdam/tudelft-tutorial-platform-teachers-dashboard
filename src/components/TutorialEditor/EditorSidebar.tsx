import React, { useState } from 'react'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion'
import Preloader from '../ui/Preloader'
import { TriangleArrow } from '../ui/Icons'

interface EditorSidebarProps {
  tutorialTitle: string
}

const EditorSidebar = (props: EditorSidebarProps) => {
  const chapters = useAppSelector((state: RootState) => state.editor.chapters)
  const isFetched = useAppSelector((state: RootState) => state.editor.isEditorLoaded)
  const [openAside, setOpenAside] = useState(false)
  return (
    <div
      className={`${openAside ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'} md:min-w-[312px] text-white pr-6 max-md:fixed max-md:z-20 top-0 left-0 max-md:h-screen w-[184px] max-md:pt-16 max-md:bg-secondary-navy max-md:pl-6 max-md:pb-6 transition-all duration-500`}
    >
      <div
        onClick={() => setOpenAside(!openAside)}
        className="absolute top-24 left-full rounded-r bg-secondary-navy md:hidden w-4 h-10 flex items-center justify-center z-10"
      >
        <img
          className={`${openAside ? 'rotate-180' : 'rotate-0'} w-3 transition-all duration-500`}
          src="/img/open-aside.svg"
          alt="arrow"
        />
      </div>
      <div
        onClick={() => setOpenAside(false)}
        className={`${openAside ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden fixed z-[-1] top-0 left-0 bg-[#0C234066]  w-[200vw] h-screen  transition-all duration-500`}
      ></div>
      <div className="md:sticky top-0">
        <div className="py-10 font-RobotoSlab md:text-2xl font-medium text-xl max-md:pb-16">
          Index
        </div>
        <div className="flex flex-col">
          {isFetched ? (
            <>
              <h2 className="text-xl leading-8">
                {props.tutorialTitle.replaceAll('\\s+', '') === ''
                  ? 'Page title'
                  : props.tutorialTitle}
              </h2>
              <Accordion type="single" collapsible>
                {chapters.map((chapter, index) => (
                  <AccordionItem value={`chapter-item-${index}`} key={index}>
                    {chapter.subchapters.length > 0 ? (
                      <>
                        <AccordionTrigger>
                          <div className="absolute top-1/2 -translate-y-1/2 left-0">
                            <TriangleArrow />
                          </div>
                          {chapter.title.text !== '' ? chapter.title.text : `Chapter ${index + 1}`}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="mt-2 flex flex-col gap-y-2 pl-8">
                            {chapter.subchapters.map((subchapter, index) => (
                              <li key={index} className="cursor-pointer hover:underline">
                                {subchapter.title.text !== ''
                                  ? subchapter.title.text
                                  : `Subchapter ${index + 1}`}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </>
                    ) : (
                      <div className="mt-6 flex flex-1 cursor-pointer items-center justify-between pl-6 text-sm font-bold transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
                        {chapter.title.text !== '' ? chapter.title.text : `Chapter ${index + 1}`}
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
      <div className="absolute left-0 top-0 -z-10 h-full w-2/4 bg-secondary-navy max-md:hidden"></div>
    </div>
  )
}

export default EditorSidebar
