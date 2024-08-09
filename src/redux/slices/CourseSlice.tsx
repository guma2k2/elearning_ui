import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { CourseType, ICurriculum, ILecture, IQuiz, QuestionType, SectionType } from '../../types/CourseType'
import { get } from '../../services/CourseService'
interface CourseState {
    currentCourse?: CourseType
    isLoading: boolean
    isError: boolean,
    isDataUpdated?: boolean

}
export type CurriculumPost = {
    curriculum: IQuiz | ILecture
    sectionId: number
}
export type QuestionsPost = {
    question: QuestionType
    quizId: number
}
export const fetchCourseById = createAsyncThunk(
    'courses/fetchByIdStatus',
    async (courseId: number | string | undefined) => {
        const response = await get(courseId);
        const data = response.data as CourseType;
        let lectureNumber: number = 1;
        let quizNumber: number = 1;
        data.sections.forEach((section) => {
            section.curriculums.forEach((curriclum) => {
                curriclum.index = curriclum.type == "lecture" ? lectureNumber++ : quizNumber++;
            })
        })
        return data;
    },
)
// Define the initial state using that type
const initialState: CourseState = {
    isLoading: false,
    isError: false
}

export const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        updateDataStatus: (state) => {
            state.isDataUpdated = !state.isDataUpdated
        },
        addSection: (state, action: PayloadAction<SectionType>) => {
            state.currentCourse?.sections.push(action.payload);
            state.currentCourse?.sections.sort((a: SectionType, b: SectionType) => a.number - b.number)
            console.log(current(state))
        },
        updateSection: (state, action: PayloadAction<SectionType>) => {
            if (action.payload.id && state.currentCourse) {
                state.currentCourse.sections.forEach((section, index) => {
                    if (section.id === action.payload.id) {
                        if (state.currentCourse) {
                            state.currentCourse.sections[index] = action.payload
                        }
                    }
                })
            }
            state.currentCourse?.sections.sort((a: SectionType, b: SectionType) => a.number - b.number)
            console.log(current(state))
        }, addCurriculum: (state, action: PayloadAction<CurriculumPost>) => {
            state.currentCourse?.sections.forEach((sec) => {
                if (sec.id === action.payload.sectionId) {
                    sec.curriculums.push(action.payload.curriculum);
                    sec.curriculums.sort((a: ICurriculum, b: ICurriculum) => a.number - b.number)
                }
            })
            let lectureNumber: number = 1;
            let quizNumber: number = 1;
            state.currentCourse?.sections.forEach((sec) => {
                sec.curriculums.forEach((curriclum) => {
                    curriclum.index = curriclum.type == "lecture" ? lectureNumber++ : quizNumber++;
                })
            })
        },
        updateCurriculum: (state, action: PayloadAction<CurriculumPost>) => {
            state.currentCourse?.sections.forEach((sec) => {
                if (sec.id === action.payload.sectionId) {
                    const payload: CurriculumPost = action.payload;
                    const newCurriculum = payload.curriculum;
                    if (newCurriculum.type === 'lecture') {
                        sec.curriculums.forEach((cur) => {
                            if (cur.id == newCurriculum.id && cur.type == "lecture") {
                                cur.title = newCurriculum.title;
                                cur.number = newCurriculum.number;
                                cur.lectureDetails = newCurriculum.lectureDetails;
                                cur.duration = newCurriculum.duration
                                cur.videoId = newCurriculum.videoId
                            }
                        })
                    } else if (newCurriculum.type === 'quiz') {
                        sec.curriculums.forEach((cur) => {
                            if (cur.id == newCurriculum.id && cur.type == "quiz") {
                                cur.title = newCurriculum.title;
                                cur.number = newCurriculum.number;
                            }
                        })
                    }
                }
            })
        },
        addQuestion: (state, action: PayloadAction<QuestionsPost>) => {
            state.currentCourse?.sections.forEach((sec) => {
                sec.curriculums.forEach((curriculum) => {
                    if (curriculum.id === action.payload.quizId && curriculum.type == "quiz") {
                        curriculum.questions?.push(action.payload.question)
                    }
                })
            })
        },
        editQuestion: (state, action: PayloadAction<QuestionsPost>) => {
            const newQuestion = action.payload.question;
            state.currentCourse?.sections.forEach((sec) => {
                sec.curriculums.forEach((curriculum) => {
                    if (curriculum.id === action.payload.quizId && curriculum.type == "quiz") {
                        if (curriculum.questions && curriculum.questions.length > 0) {
                            curriculum.questions.forEach((q) => {
                                if (q.id == newQuestion.id) {
                                    q.title = newQuestion.title;
                                    q.answers = newQuestion.answers;
                                }
                            })
                        }
                    }
                })
            })
        },
        updateCourse: (state, action: PayloadAction<CourseType>) => {
            if (state.currentCourse) {
                const payload: CourseType = action.payload;
                state.currentCourse.title = payload.title;
                state.currentCourse.headline = payload.headline;
                state.currentCourse.requirements = payload.requirements;
                state.currentCourse.targetAudiences = payload.targetAudiences;
                state.currentCourse.description = payload.description;
                state.currentCourse.level = payload.level;
                state.currentCourse.imageURL = payload.imageURL;
                state.currentCourse.updatedAt = payload.updatedAt;
                state.currentCourse.free = payload.free;
                state.currentCourse.isPublish = payload.isPublish;
                state.currentCourse.categoryId = payload.categoryId;
                state.currentCourse.topicId = payload.topicId;
                state.currentCourse.price = payload.price
            }
        }


    }, extraReducers: (builder) => {
        builder
            .addCase(fetchCourseById.pending, (state, action) => {
                console.log(action);
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                console.log(action);
                state.currentCourse = action.payload
                state.isError = false;
                state.isLoading = false;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                console.log(action);
                state.isError = true;
                state.isLoading = false;
            })
    },
})

export const { updateDataStatus, addSection, updateSection, addCurriculum, addQuestion, updateCourse, updateCurriculum, editQuestion } = courseSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.courses
export default courseSlice.reducer