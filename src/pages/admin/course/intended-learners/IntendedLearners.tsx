import { ChangeEvent, useEffect, useState } from 'react'
import './IntendedLearners.style.scss'
import IntendedLeaner from '../../../../components/intended-learner';
import { CourseType } from '../../../../types/CourseType';

export enum AddType {
    Objective,
    Requirement,
    TargetAudience
}
type Probs = {
    course: CourseType | undefined
}
function IntendedLeaners(probs: Probs) {
    const { course } = probs;
    const minLengthObjective: number = 4;
    const minLengthRequirement: number = 4;
    const minLengthTargetAudience: number = 1;
    const [objectives, setObjectives] = useState<string[]>([]);
    const [requirements, setRequirements] = useState<string[]>([]);
    const [targetAudiences, setTargetAudiences] = useState<string[]>([]);
    const handleAdd = (type: AddType) => {
        if (type == AddType.Objective) {
            if (!checkCanAdd(objectives)) return;
            setObjectives((prev) => [...prev, ""]);
        } else if (type == AddType.Requirement) {
            if (!checkCanAdd(requirements)) return;
            setRequirements((prev) => [...prev, ""]);
        } else {
            if (!checkCanAdd(targetAudiences)) return;
            setTargetAudiences((prev) => [...prev, ""]);
        }
    }
    const checkCanAdd = (items: string[]): boolean => {
        if (items[items.length - 1] == "" && items.length > 0) {
            return false;
        }
        return true;
    }
    const handleChange = (index: number, type: AddType, event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (type == AddType.Objective) {

            const newObjectives = objectives.map((objective, id) => {
                return id === index ? value : objective;
            });
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
            if (objectives.length <= minLengthObjective) {
                return;
            }
            const newObjectives = [...objectives];
            const filteredObjectives = newObjectives.filter((objective, id) => id !== index);
            setObjectives(filteredObjectives);
        } else if (type == AddType.Requirement) {
            if (requirements.length <= minLengthRequirement) {
                return;
            }
            const newRequirements = [...requirements];
            const filteredObjectives = newRequirements.filter((requirement, id) => id !== index);
            setRequirements(filteredObjectives);
        } else {
            if (targetAudiences.length <= minLengthTargetAudience) {
                return;
            }
            const newTargetAudiences = [...targetAudiences];
            const filteredObjectives = newTargetAudiences.filter((target, id) => id !== index);
            setTargetAudiences(filteredObjectives);
        }
    }
    useEffect(() => {
        if (course) {
            course.objectives && setObjectives(course.objectives);
            course.requirement && setObjectives(course.requirement);
            course.targetAudiences && setObjectives(course.targetAudiences);
        }
    }, [])
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
                    minLength={minLengthObjective}
                />
                <IntendedLeaner
                    type={AddType.Requirement}
                    desc={"You must enter at least 4 learning objectives or outcomes  that learners can expect to achieve after completing your course."}
                    title={"What will students learn in your course"}
                    handleChange={handleChange}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    items={requirements}
                    minLength={minLengthRequirement}
                />
                <IntendedLeaner
                    type={AddType.TargetAudience}
                    desc={"You must enter at least 4 learning objectives or outcomes  that learners can expect to achieve after completing your course."}
                    title={"What will students learn in your course"}
                    handleChange={handleChange}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    items={requirements}
                    minLength={minLengthTargetAudience}
                />

            </div>
        </div>
    )
}

export default IntendedLeaners