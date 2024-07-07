import { Button, Checkbox, Col, Divider, Form, Rate, Row, Select, } from 'antd'
import './Filter.style.scss'
import { Option } from 'antd/es/mentions'
import { IoFilter } from 'react-icons/io5'
function Filter() {
    const handleOnValuesChange = () => {

    }
    return (
        <div className='filter-container'>
            <div className="filter-left">
                <Form
                    className='filter-form'
                    name="validate_other"
                    onValuesChange={handleOnValuesChange}
                    initialValues={{
                        'checkbox-group': ['A', 'B'],
                        rate: 3.5,
                    }}
                >
                    <div className='filter-btn'>
                        <Button htmlType="reset" className='filter-btn-reset'>
                            <IoFilter />
                            <span>Reset</span>
                        </Button>
                        <Form.Item
                            name="select"
                            className='filter-select-sort'
                        >
                            <span className='filter-label-sort'>Sap xep theo</span>
                            <Select className='filer-selection'  >
                                <Option value="china">China</Option>
                                <Option value="usa">U.S.A</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Xep Hang</h2>
                        <Form.Item className='filter-form-content' name="checkbox-group">
                            <Checkbox.Group>
                                <Row>
                                    <Col span={16}>
                                        <Checkbox value="A" style={{ lineHeight: '32px' }}>
                                            A
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="B" style={{ lineHeight: '32px' }} disabled>
                                            B
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                    <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Xep Hang</h2>
                        <Form.Item className='filter-form-content' name="checkbox-group">
                            <Checkbox.Group>
                                <Row>
                                    <Col span={16}>
                                        <Checkbox value="A" style={{ lineHeight: '32px' }}>
                                            A
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="B" style={{ lineHeight: '32px' }} disabled>
                                            B
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                    <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Xep Hang</h2>
                        <Form.Item className='filter-form-content' name="checkbox-group">
                            <Checkbox.Group>
                                <Row>
                                    <Col span={16}>
                                        <Checkbox value="A" style={{ lineHeight: '32px' }}>
                                            A
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="B" style={{ lineHeight: '32px' }} disabled>
                                            B
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                    <div className="filter-form-item">
                        <Divider className='filter-form-devider' />
                        <h2 className="filter-form-header">Xep Hang</h2>
                        <Form.Item className='filter-form-content' name="checkbox-group">
                            <Checkbox.Group>
                                <Row>
                                    <Col span={16}>
                                        <Checkbox value="A" style={{ lineHeight: '32px' }}>
                                            A
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="B" style={{ lineHeight: '32px' }} disabled>
                                            B
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                    <Col span={16}>
                                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                                            C
                                        </Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                    <Form.Item name="rate" label="Rate">
                        <Rate />
                    </Form.Item>

                </Form>
            </div>
            <div className="filter-right">
                <div className="filter-right-course-container">
                    <div className="filter-right-course-left">
                        <img src="https://img-c.udemycdn.com/course/480x270/533682_c10c_4.jpg" alt="course-image" />
                    </div>
                    <div className="filter-right-course-middle">
                        <h3 className="filter-right-course-title">Java 17 Masterclass: Start Coding in 2024</h3>
                        <span className="filter-right-course-desc">Acquire Key <strong>Java</strong> Skills: From Basics to Advanced Programming and Certification - Start Your Dev Career</span>
                        <div className="filter-right-course-instructor">Man Nguyen</div>
                        <div className="filter-right-course-rating">
                            <div className="rating-number">4.7</div>
                            <Rate className="rating" disabled defaultValue={2} />
                            <div className="review-number">(3.502 xếp hạng)</div>
                        </div>
                        <div className="filter-right-course-total">
                            <div className="total-hours">Tổng số 36.5 giờ</div>
                            <div className="total-lectures">250 bài giảng</div>
                            <div className="level">Sơ cấp</div>
                        </div>
                    </div>
                    <div className="filter-right-course-right">
                        2.399.000 d
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter