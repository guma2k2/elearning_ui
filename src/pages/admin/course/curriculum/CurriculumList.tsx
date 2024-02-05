import { Button } from 'antd'
import './CurriculumList.style.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import Section from '../../../../components/section'
function CurriculumList() {
    return (
        <div className="curriculum-container">
            <div className="header">
                <h2>Curriculum</h2>
            </div>
            <div className="wrapper">
                <Section />
            </div>
            <div className='plus'>
                <Button className='btn-plus' icon={<AiOutlinePlus />}>Section</Button>
            </div>
        </div>
    )
}

export default CurriculumList