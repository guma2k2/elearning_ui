import { Button } from 'antd'
import './CurriculumList.style.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import Section from '../../../../components/section'
import { useState } from 'react';
import SectionForm from '../../../../components/sectionForm';

function CurriculumList() {
    const [toggle, setToggle] = useState<boolean>(false);
    return (
        <div className="curriculumlist-container">
            <div className="header">
                <h2>Curriculum</h2>
            </div>
            <div className="wrapper">
                <Section />
                <Section />
            </div>
            {toggle == false && <div className='plus' onClick={() => setToggle(true)}>
                <Button className='btn-plus' icon={<AiOutlinePlus />}>Section</Button>
            </div>}
            {toggle == true && <div className="curriculumlist-add-section">
                <SectionForm label='New Section' title='' toggle={{ type: "" }} setToggleCurriculumList={setToggle} />
            </div>}


        </div>
    )
}

export default CurriculumList