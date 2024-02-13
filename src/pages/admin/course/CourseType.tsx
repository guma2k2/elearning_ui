import Answer from "../../../components/answer"
import Curriculum from "../../../components/curriculum"

export type CourseType = {
    id?: number
    title: string
    topicId: number
    categoryId: number
    headline?: string
    objectives?: string[]
    requirement?: string[]
    targetAudiences?: string[]
    description?: string
    imageURL?: string
    createdAt?: string
    updatedAt?: string
    free?: boolean
    isPublish?: boolean
    sections: Section[]
}

export type Section = {
    id?: number
    title: string
    number: number
    objective: string
    curriculums: Curriculum[]
}

interface Curriculum {
    id?: number
    title: string
    number: number
    type: "lecture" | "quiz"
}
interface Lecture extends Curriculum {
    videoId: string
    lectureDetails: string
    duration: number
}

interface Quiz extends Curriculum {
    description: string
    questions: Question[]
}

type Question = {
    id?: number
    title: string
    answers: Answer[]
}
type Answer = {
    id?: number
    answerText: string
    reason: string
    correct: boolean
}
