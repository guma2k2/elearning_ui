import { useState } from 'react'
import './CourseLandingPage.style.scss'
import { useForm, SubmitHandler } from "react-hook-form"
import ReactQuill from 'react-quill'
import InputFile from '../../../../components/inputFile'

type Inputs = {
    example: string
    exampleRequired: string
}
const lectureModules = {
    toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Customize the toolbar to include only bold and italic options
    ],
};

const lectureFormats = [
    'bold', 'italic', 'list', 'bullet',
];
function CourseLandingPage() {
    const [courseDesc, setCourseDesc] = useState<string>("");
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

    return (
        <div className="course-landingpage-container">
            <div className="header">
                <h2>Course Landing Page</h2>
            </div>
            <div className="wrapper">
                <div className="form-item">
                    <span className='title'>Course title</span>
                    <input type="text" />
                </div>
                <div className="form-item">
                    <span className='title'>Course title</span>
                    <input type="text" />
                </div>
                <div className="form-item">
                    <span className='title'>Course description</span>
                    <div className="course-desc">
                        <ReactQuill modules={lectureModules} formats={lectureFormats} theme="snow" value={courseDesc} onChange={setCourseDesc} placeholder="Add a description. Include what students will be able to do after completing the lecture." />
                    </div>
                </div>
                <div className="form-item">
                    <span className='title'>Course image</span>
                    <div className="form-image">
                        <img src="https://s.udemycdn.com/course/750x422/placeholder.jpg" alt="Course image" />
                        <div className="input-file">
                            <InputFile title='Upload file' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
//  {/* register your input into the hook by invoking the "register" function */}
//  <input defaultValue="" {...register("example")} />

//  {/* include validation with required or other standard HTML validation rules */}
//  <input {...register("exampleRequired", { required: true })} />
//  {/* errors will return when field validation fails  */}
//  {errors.exampleRequired && <span>This field is required</span>}

//  <input type="submit" onClick={() => handleSubmit(onSubmit)} />

export default CourseLandingPage