import { AiOutlinePlus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { AddType } from "../../pages/admin/course/intended-learners/IntendedLearners";
import { ChangeEvent } from "react";

type Probs = {
    type: AddType,
    title: string,
    desc: string,
    items: string[],
    handleChange: (index: number, type: AddType, event: ChangeEvent<HTMLInputElement>) => void,
    handleAdd: (type: AddType) => void,
    handleDelete: (type: AddType, index: number) => void
    minLength: number
}
const objectivePlaceholders: string[] = [
    "Example: Define the roles and responsibilities of a project manager",
    "Example: Estimate project timelines and budgets",
    "Example: Identify and manage project risks",
    "Example: Complete a case study to manage a project from conception to completion"
]
const requirementPlaceholders: string[] = [
    "Example: No programming experience needed. You will learn everything you need to know",
]

const targetAudiencePlaceholders: string[] = [
    "Example: Beginner Python developers curious about data science",
]
function IntendedLeaner(probs: Probs) {
    const { type, items, desc, title, handleAdd, handleChange, handleDelete, minLength } = probs;
    const minItems: string[] = type == AddType.Objective ? objectivePlaceholders : (type == AddType.Requirement ? requirementPlaceholders : targetAudiencePlaceholders);
    const addTypePlaceholder: string = type == AddType.Objective ? objectivePlaceholders[minItems.length - 1] : (type == AddType.Requirement ? requirementPlaceholders[minItems.length - 1] : targetAudiencePlaceholders[minItems.length - 1]);

    return (
        <div className="item">
            <h3 className="title">{title}</h3>
            <p className="desc">{desc}</p>
            <div className="list-input">
                {items.map((item, index) => {
                    const placeholder = index + 1 <= minLength ? minItems[index] : addTypePlaceholder;
                    return <div className='input-container' key={index} >
                        <input
                            className="input"
                            value={item}
                            placeholder={placeholder}
                            onChange={(event) => handleChange(index, type, event)}
                        />
                        <div
                            className="action-delete"
                            style={{ cursor: `${items.length > minLength ? "pointer" : "not-allowed"}` }}
                            onClick={() => handleDelete(type, index)}
                        >
                            <FaTrash className='icon-trash' />
                        </div>
                    </div>
                }
                )}

            </div>
            <div className="action" onClick={() => handleAdd(type)}>
                <AiOutlinePlus className='icon-plus' />
                <span>Thêm nội dung</span>
            </div>
        </div>
    )
}

export default IntendedLeaner