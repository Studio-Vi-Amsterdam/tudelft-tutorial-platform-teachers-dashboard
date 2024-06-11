import {
    ArtictesType,
    BoolString,
    ChapterElementsObject,
    EditorState,
    ResponseArticleInterface,
    ResponseContentBlock,
    TutorialTopElementsObject,
} from 'src/types/types';

export const reducerParser = {
    parseToReducer(
        response: ResponseArticleInterface,
        articleType: ArtictesType
    ) {
        const parsedElements = (
            elements: ResponseContentBlock[]
        ): TutorialTopElementsObject[] => {
            return elements
                .map((block) => {
                    switch (block.block_name) {
                        case 'tu-delft-text':
                            return {
                                text: block.block_data.content,
                            };
                        case 'tu-delft-info-box':
                            return {
                                infobox: block.block_data.content,
                            };
                        case 'tu-delft-quiz':
                            const quizData = block.block_data;
                            return {
                                quiz: {
                                    question: quizData.question,
                                    answers: [
                                        {
                                            answer: quizData.answers_0_answer,
                                            isCorrect:
                                                quizData.answers_0_is_correct as BoolString,
                                        },
                                        {
                                            answer: quizData.answers_1_answer,
                                            isCorrect:
                                                quizData.answers_1_is_correct as BoolString,
                                        },
                                        {
                                            answer: quizData.answers_2_answer,
                                            isCorrect:
                                                quizData.answers_2_is_correct as BoolString,
                                        },
                                        {
                                            answer: quizData.answers_3_answer,
                                            isCorrect:
                                                quizData.answers_3_is_correct as BoolString,
                                        },
                                    ],
                                    answersCount: quizData.answers,
                                },
                            };
                        case 'tu-delft-h5p':
                            return {
                                h5pElement: {
                                    value: block.block_data.source,
                                },
                            };
                        case 'tu-delft-image':
                            return {
                                image: {
                                    link: block.block_data.image_url,
                                    type: 'image',
                                    format: 'test',
                                    title: block.block_data.content
                                        ? block.block_data.content
                                        : '',
                                    publishDate: 'hardcode',
                                },
                            };
                        default:
                            return null;
                    }
                })
                .filter(Boolean) as TutorialTopElementsObject[];
        };

        const tutorialTopElements = response.content
            ? parsedElements(response.content)
            : [];

        const parsedObject: EditorState = {
            pageType: articleType,
            tutorialTop: {
                title: response.title ? response.title : '',
                titleType: 'h1',
                description: response.description ? response.description : '',
                elements: tutorialTopElements,
            },
            chapters: [] /*There we should parse "chapters" */,
            tutorialBottom: {
                title: 'Useful Links',
                titleType: 'h2',
                text: response.useful_links ? response.useful_links : '',
            },
            meta: {
                belongs: {
                    primary: {
                        required: true,
                        list: ['Windows 10', 'Office 365', 'VS Code', 'Figma'],
                        value: '' /*There we should to get "primary_software" */,
                        fieldTitle: 'Primary software used',
                    },
                    version: {
                        required: true,
                        value: response.software_version
                            ? response.software_version.toString()
                            : '',
                        fieldTitle: 'Software version',
                    },
                    primarySubject: {
                        required: true,
                        list: [
                            'Mathematics',
                            'Web-programing',
                            'Web-design',
                            'Physics',
                        ],
                        value: '' /*There we need to get primary_subject */,
                        fieldTitle: 'Primary Subject',
                    },
                    secondarySubject: {
                        required: false,
                        list: [
                            'Mathematics',
                            'Web-programing',
                            'Web-design',
                            'Physics',
                        ],
                        value: '' /*There we need to get secondary_subject */,
                        fieldTitle: 'Secondary Subject',
                    },
                    level: {
                        required: true,
                        list: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                        value: response.level ? response.level : '',
                        fieldTitle: 'Level',
                    },
                    keywords: {
                        required: true,
                        list: response.keywords ? response.keywords : [],
                        value: '',
                        fieldTitle: 'Keywords',
                    },
                    image: {
                        required: false,
                        value: response.featured_image
                            ? response.featured_image
                            : '',
                        fieldTitle: 'Featured image',
                    },
                },
                responsible: {
                    teacher: {
                        required: true,
                        value: response.teachers
                            ? response.teachers.toString()
                            : '',
                        fieldTitle: 'Teacher',
                    },
                    faculty: {
                        required: true,
                        list: [
                            'Computer Engeneering',
                            'Computer Science',
                            'Automation',
                        ],
                        value: response.faculty
                            ? response.faculty.toString()
                            : '',
                        fieldTitle: 'Faculty',
                    },
                },
            },
        };
        return parsedObject;
    },
};
