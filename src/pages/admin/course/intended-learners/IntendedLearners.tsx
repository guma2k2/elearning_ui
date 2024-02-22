import { ChangeEvent, useState } from 'react'
import './IntendedLearners.style.scss'
import IntendedLeaner from '../../../../components/intended-learner';

const objectivesData: string[] = [
    "", "", "", ""
]
const requirementsData: string[] = [
    "",
]

const targetAudiencesData: string[] = [
    "",
]
export enum AddType {
    Objective,
    Requirement,
    TargetAudience
}
function IntendedLeaners() {
    const [objectives, setObjectives] = useState<string[]>(objectivesData);
    const [requirements, setRequirements] = useState<string[]>(requirementsData);
    const [targetAudiences, setTargetAudiences] = useState<string[]>(targetAudiencesData);
    const handleAdd = (type: AddType) => {
        if (type == AddType.Objective) {
            setObjectives((prev) => [...prev, ""]);
        } else if (type == AddType.Requirement) {
            setRequirements((prev) => [...prev, ""]);
        } else {
            setTargetAudiences((prev) => [...prev, ""]);
        }
    }
    const handleChange = (index: number, type: AddType, event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        console.log(value);
        if (type == AddType.Objective) {
            const newObjectives = [...objectives];
            newObjectives.forEach((objective, id) => {
                if (id == index) {
                    objective = value;
                }
            })
            setObjectives(newObjectives);
        } else if (type == AddType.Requirement) {
            const newRequirements = [...requirements];
            newRequirements.forEach((requirement, id) => {
                if (id == index) {
                    requirement = value;
                }
            })
            setRequirements(newRequirements);
        } else {
            const newTargetAudiences = [...targetAudiences];
            newTargetAudiences.forEach((targetAudience, id) => {
                if (id == index) {
                    targetAudience = value;
                }
            })
            setTargetAudiences(newTargetAudiences);
        }
    }

    const handleDelete = (type: AddType, index: number) => {
        if (type == AddType.Objective) {
            const newObjectives = [...objectives];
            newObjectives.filter((objective, id) => id !== index);
            console.log(index);
            console.log(newObjectives);
            setObjectives(newObjectives);
        } else if (type == AddType.Requirement) {
            const newRequirements = [...requirements];
            newRequirements.filter((requirement, id) => id !== index);
            setRequirements(newRequirements);
        } else {
            const newTargetAudiences = [...targetAudiences];
            newTargetAudiences.filter((target, id) => id !== index);
            setTargetAudiences(newTargetAudiences);
        }
    }
    return (
        <div className="course-intendedLearners-container">
            <div className="header">
                <h2>Intended Learners</h2>
            </div>
            <div className="wrapper">
                <IntendedLeaner
                    type={AddType.Objective}
                    desc={"You must enter at least 4 learning objectives or outcomes  that learners can expect to achieve after completing your course."}
                    title={"What will students learn in your course"}
                    handleChange={handleChange}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    items={objectives}
                    minLength={4}
                />
                <IntendedLeaner
                    type={AddType.Requirement}
                    desc={"You must enter at least 4 learning objectives or outcomes  that learners can expect to achieve after completing your course."}
                    title={"What will students learn in your course"}
                    handleChange={handleChange}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    items={requirements}
                    minLength={1}
                />
                <IntendedLeaner
                    type={AddType.TargetAudience}
                    desc={"You must enter at least 4 learning objectives or outcomes  that learners can expect to achieve after completing your course."}
                    title={"What will students learn in your course"}
                    handleChange={handleChange}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    items={requirements}
                    minLength={1}
                />

            </div>
        </div>
    )
}

export default IntendedLeaners