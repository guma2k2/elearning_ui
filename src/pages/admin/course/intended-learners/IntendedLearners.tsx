import { ChangeEvent, useEffect, useState } from 'react'
import './IntendedLearners.style.scss'
import IntendedLeaner from '../../../../components/intended-learner';
import { CourseType } from '../../../../types/CourseType';
import { Button, Spin } from 'antd';
import { useAppDispatch } from '../../../../redux/hooks';
import { updateCourseById } from '../../../../services/CourseService';
import { updateCourse } from '../../../../redux/slices/CourseSlice';
import { Message, updateShowing } from '../../../../redux/slices/MessageSlice';

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
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
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
            console.log(type);
            const newRequirements = requirements.map((requirement, id) => {
                return id === index ? value : requirement;
            });
            setRequirements(newRequirements);
        } else {
            console.log(type);
            const newTargetAudiences = targetAudiences.map((target, id) => {
                return id === index ? value : target;
            });
            setTargetAudiences(newTargetAudiences);
        }
    }

    const handleDelete = (type: AddType, index: number) => {
        if (type == AddType.Objective) {
            if (objectives.length <= minLengthObjective) {
                return;
            }
            const newObjectives = [...objectives];
            const filteredObjectives = newObjectives.filter((_objective, id) => id !== index);
            setObjectives(filteredObjectives);
        } else if (type == AddType.Requirement) {
            if (requirements.length <= minLengthRequirement) {
                return;
            }
            const newRequirements = [...requirements];
            const filteredObjectives = newRequirements.filter((_requirement, id) => id !== index);
            setRequirements(filteredObjectives);
        } else {
            if (targetAudiences.length <= minLengthTargetAudience) {
                return;
            }
            const newTargetAudiences = [...targetAudiences];
            const filteredObjectives = newTargetAudiences.filter((_target, id) => id !== index);
            setTargetAudiences(filteredObjectives);
        }
    }
    const handleUpdateCourse = async () => {
        if (course) {
            setIsDataLoading(true)
            const coursePut: CourseType = {
                ...course,
                requirements,
                objectives,
                targetAudiences
            }
            console.log(coursePut);
            if (course.id) {
                const res = await updateCourseById(coursePut, course.id);
                if (res.status === 200) {
                    const data = res.data as CourseType;
                    console.log(data);
                    dispatch(updateCourse(data))
                    const message: Message = {
                        type: "success",
                        content: "save succesful"
                    }
                    dispatch(updateShowing(message))
                }
            }
            setIsDataLoading(false);
        } else {
            throw new Error("Cannot save course");
        }
    }
    useEffect(() => {
        if (course) {
            setIsDataLoading(true);
            console.log(course);
            console.log(course.objectives);
            course.objectives && setObjectives(course.objectives);
            course.requirements && setRequirements(course.requirements);
            course.targetAudiences && setTargetAudiences(course.targetAudiences);
            setIsDataLoading(false);
        }
    }, [])
    return (
        <Spin spinning={isDataLoading}>
            <div className="course-intendedLearners-container">
                <div className="header">
                    <h2>Intended Learners</h2>
                    <Button onClick={handleUpdateCourse}>Save</Button>
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
                        items={targetAudiences}
                        minLength={minLengthTargetAudience}
                    />

                </div>
            </div>
        </Spin>
    )
}

export default IntendedLeaners