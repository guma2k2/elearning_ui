import { AiOutlinePlus } from "react-icons/ai"
import { CurriculumType } from "./CurriculumType"

function Curriculum(probs: CurriculumType) {
    const handleClick = () => {
        console.log(probs.type);
        const type = probs.type === "lecture" ? "lecture" : "quiz";
        probs.setToggle({ type })
    }

    return (
        <div className="item-form" onClick={handleClick}>
            <AiOutlinePlus />
            <span>{probs.title}</span>
        </div>
    )
}

export default Curriculum