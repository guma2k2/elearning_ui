import { Button, Form, Input } from 'antd'
import './SectionForm.style.scss'
import { LiaTimesSolid } from 'react-icons/lia'
import { SectionType } from '../../types/CourseType'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { useEffect } from 'react'
import { create, update } from '../../services/SectionService'
import { updateDataStatus } from '../../redux/slices/CourseSlice'

type ToggleType = {
    type: "button" | "select" | "lecture" | "quiz" | "section" | "addSection" | "updateSection" | "" | "updateCurriculum"
}
type Probs = {
    index?: number
    label: string
    section?: SectionType
    prevNum?: number
    nextNum?: number
    setToggle?: (value: ToggleType) => void
    setToggleCurriculumList?: (value: boolean) => void
    toggle?: ToggleType
}
function SectionForm(probs: Probs) {
    const [form] = Form.useForm();
    const { currentCourse } = useAppSelector((state) => state.courses)
    const dispatch = useAppDispatch();
    const onFinish = async (values: SectionType) => {
        let number = 0;
        const type = probs.section ? "update" : "create";
        console.log(type);
        if (probs.prevNum && probs.nextNum) {
            number = probs.prevNum && probs.nextNum && probs.prevNum == probs.nextNum ? probs.prevNum : (probs.prevNum + probs.nextNum) / 2
        }
        const courseId = currentCourse?.id;
        const sectionPost = { ...values, number, courseId }
        console.log(sectionPost);

        if (type == "create") {
            const res = await create(sectionPost);
            if (res.status === 201) {
                probs.setToggle && probs.setToggle({ type: "button" })
                probs.setToggleCurriculumList && probs.setToggleCurriculumList(false);
                dispatch(updateDataStatus())
            }
        } else {
            const sectionId = probs.section ? probs.section.id : undefined;
            const res = await update(sectionPost, sectionId);
            console.log(res);
        }

        // console.log(probs.prevNum);
        // console.log(probs.nextNum);
        // console.log(number);
        // console.log(cousreId);
        // console.log(values);
    }
    useEffect(() => {
        console.log(probs.section);
        if (probs.section) {
            form.setFieldsValue({ ...probs.section })
        }
    }, [])

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
                        form={form}
                        className='form'
                        layout='vertical'
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{ minWidth: "100%" }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item<SectionType>
                            name="id"
                            hidden
                        >
                            <Input hidden />
                        </Form.Item>
                        <Form.Item<SectionType>
                            name="title"
                            rules={[{ required: true, message: 'Enter a title!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<SectionType>
                            name="number"
                            hidden
                        >
                            <Input hidden />
                        </Form.Item>
                        <Form.Item<SectionType>
                            label="What will students be able to do at the end of this section?"
                            name="objective"
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                    <div className="section-form-action">
                        <div className="cancel" onClick={() => probs.setToggle && probs.setToggle({ type: "button" })} >Cancel</div>
                        <Button onClick={() => form.submit()} type="primary">Save Section</Button>
                    </div>
                </div>
            </span>
        </div>
    )
}

export default SectionForm