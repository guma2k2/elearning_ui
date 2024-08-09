import { Button, Checkbox, Col, Divider, Form, Pagination, Radio, Rate, Row, Select, } from 'antd'
import './Filter.style.scss'
import { Option } from 'antd/es/mentions'
import { IoFilter } from 'react-icons/io5'
import { useEffect, useState, Fragment } from 'react'
import { CourseListGetType } from '../../types/CourseType'
import { getCourseByMultiQuery } from '../../services/CourseService'
import FilterCourse from '../../components/filter-course'
import { getByName } from '../../services/CategoryService'

type filterType = {
    ratingStar: string,
    level: string[],
    free: string[],
    categoryName: string
}
function Filter() {
    const [filter, setFilter] = useState<string>();
    const [pageNum, setPageNum] = useState<number>(0);
    const [courses, setCourses] = useState<CourseListGetType[]>();
    const [totalElements, setTotalElements] = useState<number>(0);
    const [form] = Form.useForm();
    const [category, setCategory] = useState<CategoryListGetType>()



    const handleOnValuesChange = (_values: string, allValues: filterType) => {
        let newFilter: string = "";
        if (allValues.level) {
            allValues.level.forEach((l) => {
                newFilter += `&level=${l}`
            })
        }
        if (allValues.ratingStar) {
            newFilter += `&ratingStar=${allValues.ratingStar}`
        }

        if (allValues.free) {
            allValues.free.forEach((f) => {
                newFilter += `&free=${f}`;
            })
        }
        if (allValues.categoryName) {
            newFilter += `&categoryName=${allValues.categoryName}`
        }

        setFilter(newFilter);
    }
    const handleReset = () => {
        form.resetFields();
        setFilter("");
        setPageNum(0);
    }
    const handleChangeCurrent = (value: number) => {
        setPageNum(value);
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const keyword = searchParams.get('keyword');
        const catName = searchParams.get('catName');
        const topicId = searchParams.get('topicId');
        if (catName) {
            fetchCategoryChild(catName);
        }
        fetchCourses(keyword, catName, topicId);

    }, [filter, pageNum])

    const fetchCategoryChild = async (catName: string) => {
        const res = await getByName(catName);
        console.log(res);
        if (res.status == 200) {
            const data = res.data as CategoryListGetType;
            setCategory(data);
        }
    }
    const fetchCourses = async (keyword: string | null, categoryName: string | null, topicId: string | null) => {
        let query: string = "";
        if (keyword) {
            query += `&keyword=${keyword}`;
        }
        if (categoryName) {
            query += `&categoryName=${categoryName}`;
        }
        if (topicId) {
            query += `&topicId=${topicId}`;
        }

        if (filter) {
            query += `&${filter}`;
        }
        if (pageNum) {
            query += `&pageNum=${pageNum - 1}`;
        }
        const res = await getCourseByMultiQuery(query);

        if (res.status == 200) {
            console.log(res.data);
            const data = res.data;
            const total = data.totalElements;
            setTotalElements(total);
            const content = data.content as CourseListGetType[];
            setCourses(content);
        }
    }
    return (
        <div className='filter-container'>
            <div className="filter-left">
                <Form
                    className='filter-form'
                    name="validate_other"
                    onValuesChange={handleOnValuesChange}
                    form={form}
                    initialValues={{ sortBy: "none" }}
                >
                    <div className='filter-btn'>
                        <Button onClick={handleReset} htmlType="reset" className='filter-btn-reset'>
                            <IoFilter />
                            <span>Reset</span>
                        </Button>
                        {/* <Form.Item
                            name="sortBy"
                            className='filter-select-sort'
                        >
                            <Select className='filer-selection'>
                                <Option value="china">China</Option>
                                <Option value="usa">U.S.A</Option>
                                <Option value="none">Sap xep theo</Option>
                            </Select>
                        </Form.Item> */}
                    </div>
                    {category && category.childrens.length > 0 && <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Danh muc con</h2>
                        <Form.Item className='filter-form-content' name="categoryName">
                            <Radio.Group>
                                <Row>
                                    {category.childrens.map((cat) => {
                                        return <Col span={16} key={`radio-cat-${cat.id}`}>
                                            <Radio value={cat.name} style={{ lineHeight: '32px' }} className='filter-form-content-category'>
                                                <div className='radio-cat-name'>{cat.name}</div>
                                            </Radio>
                                        </Col>
                                    })}
                                </Row>
                            </Radio.Group>
                        </Form.Item>
                    </div>}

                    <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Xếp hạng</h2>
                        <Form.Item className='filter-form-content' name="ratingStar">
                            <Radio.Group>
                                <Row>
                                    <Col span={16}>
                                        <Radio value="4.5" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <Rate className="filter-form-content-rating" disabled defaultValue={2} />
                                            <span>Từ 4.5 sao trở lên</span>
                                        </Radio>
                                    </Col>
                                    <Col span={16}>
                                        <Radio value="4.0" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <Rate className="filter-form-content-rating" disabled defaultValue={2} />
                                            <span>Từ 4 sao trở lên</span>
                                        </Radio>
                                    </Col>
                                    <Col span={16}>
                                        <Radio value="3.5" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <Rate className="filter-form-content-rating" disabled defaultValue={2} />
                                            <span>Từ 3.5 sao trở lên</span>
                                        </Radio>
                                    </Col>
                                    <Col span={16}>
                                        <Radio value="3.0" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <Rate className="filter-form-content-rating" disabled defaultValue={2} />
                                            <span>Từ 3 sao trở lên</span>
                                        </Radio>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Cấp độ</h2>
                        <Form.Item className='filter-form-content' name="level">
                            <Checkbox.Group>
                                <Row>
                                    <Col span={16}>
                                        <Checkbox value="AllLevel" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <span>Tất cả trình độ</span>
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="Beginner" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <span>Sơ cấp</span>
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="Intermediate" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <span>Trung cấp </span>
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="Expert" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <span>Chuyên gia</span>
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                    <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Gía tiền</h2>
                        <Form.Item className='filter-form-content' name="free">
                            <Checkbox.Group>
                                <Row>
                                    <Col span={16}>
                                        <Checkbox value="0" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <span>Có trả phí</span>
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="1" style={{ lineHeight: '32px' }} className='filter-form-content-checkbox'>
                                            <span>Miễn phí</span>
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                </Form>
            </div>
            <div className="filter-right">
                <div className="filter-right-container">
                    {courses && courses.map((course, index) => {
                        return <Fragment key={`filter-course-${course.id}`}>
                            <FilterCourse course={course} />
                            {index < courses.length - 1 && <Divider className='filter-right-course-devider' />}
                        </Fragment>
                    })}

                </div>

                <Pagination current={pageNum} total={totalElements} pageSize={5} onChange={handleChangeCurrent} />
            </div>
        </div>
    )
}

export default Filter