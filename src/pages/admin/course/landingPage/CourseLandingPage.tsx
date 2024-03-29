import { ChangeEvent, useEffect, useRef, useState } from 'react'
import './CourseLandingPage.style.scss'
import ReactQuill from 'react-quill'
import InputFile from '../../../../components/inputFile'
import { Button, Select, Spin } from 'antd'
import { TopicType } from '../../topic/TopicType'
import { getCategoryParents } from '../../../../services/CategoryService'
import { getTopicsByCategoryId } from '../../../../services/TopicService'
import { CourseType } from '../../../../types/CourseType'
import { uploadFile } from '../../../../services/MediaService'
import { updateCourseById } from '../../../../services/CourseService'
import { useAppDispatch } from '../../../../redux/hooks'
import { updateCourse } from '../../../../redux/slices/CourseSlice'

const lectureModules = {
    toolbar: [
        ['bold', 'italic'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Customize the toolbar to include only bold and italic options
    ],
};

const lectureFormats = [
    'bold', 'italic', 'list', 'bullet',
];
const levels = [
    {
        id: 1,
        value: "Beginner"
    },
    {
        id: 2,
        value: "Intermediate"
    },
    {
        id: 3,
        value: "Expert"
    },
    {
        id: 4,
        value: "AllLevel"
    },
]
type Probs = {
    course: CourseType | undefined
}
function CourseLandingPage(probs: Probs) {
    const { course } = probs;
    const [courseTitle, setCourseTitle] = useState<string>("");
    const [courseHeadline, setCourseHeadline] = useState<string>("");
    const [courseDesc, setCourseDesc] = useState<string>("");
    const [file, setFile] = useState<File>();
    const [imgSrc, setImgSrc] = useState<string | undefined>();
    const [defaultCategoryParent, setDefaultCategoryParent] = useState<number>();
    const [defaultCategoryChild, setDefaultCategoryChild] = useState<number>(-1);
    const [defaultTopic, setDefaultTopic] = useState<number>(-1);
    const [level, setLevel] = useState<string | undefined>(levels[0].value);
    const [categoryParents, setCategoryParents] = useState<CategoryListGetType[]>([]);
    const [categoryChildrens, setCategoryChildrens] = useState<CategoryType[]>([]);
    const [topics, setTopics] = useState<TopicType[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selected = files[0];
            setFile(selected);
            setImgSrc(URL.createObjectURL(selected));
            // var formData = new FormData();
            // formData.append("file", selected);
            // formData.append("type", "image");

        }
    };
    const resetFileInput = () => {
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };
    const handleChangeCategories = async (value: number) => {
        let checkCanGetTopics: number = 0;
        categoryParents.forEach((cat: CategoryListGetType) => {
            if (cat.id === value) {
                console.log(cat.childrens);
                if (cat.childrens.length > 0) checkCanGetTopics = cat.childrens[0].id;
                setDefaultCategoryParent(cat.id);
                setCategoryChildrens(cat.childrens)
                return;
            }
        })
        if (checkCanGetTopics !== 0) {
            const res = await getTopicsByCategoryId(checkCanGetTopics);
            if (res.status === 200) {
                const data = res.data as TopicType[];
                setTopics(data);
            }
        } else {
            setTopics([]);
        }
    }
    const handleChangeCategoriesChildrens = async (value: number) => {
        setDefaultCategoryChild(value);
        console.log(value);
        const res = await getTopicsByCategoryId(value);
        if (res.status === 200) {
            const data = res.data as TopicType[];
            if (data.length > 0) {
                setTopics(data);
                setDefaultTopic(data[0].id);
            }
        }

    }
    const handleChangeLevel = (value: string) => {
        console.log(value);
        setLevel(value);
    }
    const handleUpdateCourse = async () => {
        setIsDataLoading(true);
        let imageId: string = "";
        if (file) {
            var formData = new FormData();
            formData.append("file", file);
            formData.append("type", "image");
            const res = await uploadFile(formData);
            console.log(res);
            if (res.status === 200) {
                const data = res.data;
                console.log(data);
                imageId = data.id;
                resetFileInput();
                setFile(undefined);
            }
        }
        if (course) {
            const coursePut: CourseType = {
                ...course,
                title: courseTitle,
                headline: courseHeadline,
                description: courseDesc,
                level,
                categoryId: defaultCategoryChild,
                topicId: defaultTopic,
                imageId
            };
            console.log(coursePut);
            if (course.id) {
                const res = await updateCourseById(coursePut, course.id);
                if (res.status === 200) {
                    console.log(res.data);
                    const data = res.data as CourseType;
                    dispatch(updateCourse(data));
                }
            }
        }
        setIsDataLoading(false);
    }
    useEffect(() => {
        setIsDataLoading(true);
        if (course) {
            console.log(course);
            setDefaultCategoryChild(course.categoryId);
            setDefaultTopic(course.topicId);
            setLevel(course.level);
            setCourseTitle(course.title);
            course.headline && setCourseHeadline(course.headline);
            course.description && setCourseDesc(course.description);
            course.imageURL && setImgSrc(course.imageURL);
        }
        const fetchCategoryParents = async () => {
            const res = await getCategoryParents();
            if (res.status === 200) {
                const data: CategoryListGetType[] = res.data.map((cat: CategoryListGetType) => ({
                    key: cat.id, ...cat
                }))
                data.forEach((parent) => {
                    parent.childrens.forEach((child) => {
                        if (child.id == course?.categoryId) {
                            setDefaultCategoryParent(parent.id);
                        }
                    })
                })
                setCategoryParents(data);
                if (data.length > 0) {
                    setCategoryChildrens(data[0].childrens);
                    const resTopics = await getTopicsByCategoryId(course?.categoryId);
                    if (resTopics.status === 200) {
                        const data = resTopics.data as TopicType[]
                        setTopics(data)
                    }
                }
            }
        }
        fetchCategoryParents()
        setIsDataLoading(false);
    }, [])
    return (
        <Spin spinning={isDataLoading}>
            <div className="course-landingpage-container" >
                <div className="header">
                    <h2>Course Landing Page</h2>
                    <Button onClick={handleUpdateCourse}>Save</Button>
                </div>
                <div className="wrapper">
                    <div className="form-item">
                        <span className='title'>Course title</span>
                        <input type="text" value={courseTitle} onChange={(e) => { setCourseTitle(e.target.value) }} />
                    </div>
                    <div className="form-item">
                        <span className='title'>Course headline</span>
                        <input type="text" value={courseHeadline} onChange={(e) => { setCourseHeadline(e.target.value) }} />
                    </div>
                    <div className="form-item">
                        <span className='title'>Course description</span>
                        <div className="course-desc">
                            <ReactQuill modules={lectureModules} formats={lectureFormats} theme="snow" value={courseDesc} onChange={setCourseDesc} placeholder="Add a description. Include what students will be able to do after completing the lecture." />
                        </div>
                    </div>
                    <div className="form-item">
                        <span className='title'>Basic Info</span>
                        <Select value={level} onChange={handleChangeLevel}>
                            {levels && levels.map((level) => {
                                return <Select.Option key={level.id} value={level.value}>{level.value}</Select.Option>
                            })}
                        </Select>
                        <Select onChange={handleChangeCategories} value={defaultCategoryParent}>
                            {categoryParents && categoryParents.map((cat) => {
                                return <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                            })}
                        </Select>
                        {categoryChildrens.length > 0 && <Select onChange={handleChangeCategoriesChildrens} value={defaultCategoryChild}>
                            {categoryChildrens && categoryChildrens.map((cat) => {
                                return <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                            })}
                        </Select>
                        }
                        {topics.length > 0 && <Select value={defaultTopic}>
                            {topics && topics.map((topic) => {
                                return <Select.Option key={topic.id} value={topic.id}>{topic.name}</Select.Option>
                            })}
                        </Select>}
                    </div>
                    <div className="form-item">
                        <span className='title'>Course image</span>
                        <div className="form-image">
                            {imgSrc && <img src={imgSrc} alt="Course image" />}
                            {!imgSrc && <img src="https://s.udemycdn.com/course/750x422/placeholder.jpg" alt="Course image" />}
                            <div className="input-file" >
                                <InputFile filename={file && file.name} title="Upload file" handleFileChange={handleFileChange} fileRef={fileRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    )
}
export default CourseLandingPage