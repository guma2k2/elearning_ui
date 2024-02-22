import { Button, Form, Input } from 'antd'
import './SectionForm.style.scss'
import { LiaTimesSolid } from 'react-icons/lia'
import { SectionType } from '../../types/CourseType'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { useEffect, } from 'react'
import { create, update } from '../../services/SectionService'
import { addSection, updateSection, } from '../../redux/slices/CourseSlice'

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
    const { label, nextNum, prevNum, section, setToggle, setToggleCurriculumList, toggle } = probs;
    const dispatch = useAppDispatch();
    const onFinish = async (values: SectionType) => {
        let number = 0;
        const type = section ? "update" : "create";
        console.log(type);
        if (prevNum && nextNum) {
            number = prevNum && nextNum && prevNum == nextNum ? prevNum : (prevNum + nextNum) / 2
        }
        const courseId = currentCourse?.id;
        const sectionPost = { ...values, number, courseId }
        console.log(sectionPost);

        if (type == "create") {
            const res = await create(sectionPost);
            if (res.status === 201) {
                setToggle && setToggle({ type: "button" })
                setToggleCurriculumList && setToggleCurriculumList(false);
                const data: SectionType = res.data;
                dispatch(addSection(data));
            }
        } else {
            const sectionId = section ? section.id : undefined;
            const res = await update(sectionPost, sectionId);
            if (res.status === 200) {
                console.log(res.data);
                setToggle && setToggle({ type: "button" })
                const data: SectionType = res.data;
                dispatch(updateSection(data));
            }
        }
    }
    useEffect(() => {
        console.log(section);
        if (section) {
            form.setFieldsValue({ ...section })
        }
    }, [])

    return (
        <div className="curriculum-section-container">
            {toggle && toggle.type !== "updateSection" && <div className="curriculum-section-insert">
                <LiaTimesSolid className="icon-exist" onClick={() => {
                    setToggle && setToggle({ type: "button" })
                    setToggleCurriculumList && setToggleCurriculumList(false)
                }} />
            </div>
            }
            <span className='section-form-container' >
                <div className="label">{label}</div>
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
                        <div className="cancel" onClick={() => setToggle && setToggle({ type: "button" })} >Cancel</div>
                        <Button onClick={() => form.submit()} type="primary">Save Section</Button>
                    </div>
                </div>
            </span>
        </div>
    )
}

export default SectionForm