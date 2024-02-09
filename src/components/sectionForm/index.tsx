import { Button, Form, Input } from 'antd'
import './SectionForm.style.scss'
import { LiaTimesSolid } from 'react-icons/lia'

type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}
type Probs = {
    index?: number
    label: string
    title: string
    objective?: string
    setToggle?: (value: ToggleType) => void
    setToggleCurriculumList?: (value: boolean) => void
    toggle?: ToggleType
}
function SectionForm(probs: Probs) {
    const onFinish = (values: Probs) => {
        console.log(values);
    }
    return (
        <div className="curriculum-section-container">
            {probs.toggle && probs.toggle.type !== "updateSection" && <div className="curriculum-section-insert">
                <LiaTimesSolid className="icon-exist" onClick={() => {
                    probs.setToggle && probs.setToggle({ type: "button" })
                    probs.setToggleCurriculumList && probs.setToggleCurriculumList(false)
                }} />
            </div>
            }
            <span className='section-form-container' >
                <div className="label">{probs.label}</div>
                <div className="section-form">
                    <Form
                        className='form'
                        layout='vertical'
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{ minWidth: "100%" }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item<Probs>
                            name="title"
                            rules={[{ required: true, message: 'Enter a title!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<Probs>
                            label="What will students be able to do at the end of this section?"
                            name="objective"
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                    <div className="section-form-action">
                        <div className="cancel" onClick={() => probs.setToggle && probs.setToggle({ type: "button" })} >Cancel</div>
                        <Button type="primary">Save Section</Button>
                    </div>
                </div>
            </span>
        </div>
    )
}

export default SectionForm