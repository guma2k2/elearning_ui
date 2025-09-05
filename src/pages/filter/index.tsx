import {
  Checkbox,
  Col,
  Divider,
  Form,
  Pagination,
  Radio,
  Rate,
  Row,
} from "antd";
import "./Filter.style.scss";
import { IoFilter, IoFilterOutline } from "react-icons/io5";
import { useEffect, useState, Fragment } from "react";
import { CourseListGetType } from "../../types/CourseType";
import { getCourseByMultiQuery } from "../../services/CourseService";
import FilterCourse from "../../components/filter-course";
import { getByName } from "../../services/CategoryService";
import { useLocation } from "react-router-dom";
import Button from "../../components/button";
import clsx from "clsx";
import { FaTimes } from "react-icons/fa";

type filterType = {
  ratingStar: string;
  level: string[];
  free: string[];
  categoryName: string;
};
function Filter() {
  const [filter, setFilter] = useState<string>("");
  const [pageNum, setPageNum] = useState<number>(0);
  const [courses, setCourses] = useState<CourseListGetType[]>();
  const [totalElements, setTotalElements] = useState<number>(0);
  const [form] = Form.useForm();
  const [category, setCategory] = useState<CategoryListGetType>();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword");
  const catName = searchParams.get("catName");
  const topicId = searchParams.get("topicId");

  const handleOnValuesChange = (_values: string, allValues: filterType) => {
    let newFilter: string = "";
    console.log(allValues);

    if (allValues.level) {
      allValues.level.forEach((l) => {
        newFilter += `&level=${l}`;
      });
    }
    if (allValues.ratingStar) {
      newFilter += `&ratingStar=${allValues.ratingStar}`;
    }

    if (allValues.free) {
      allValues.free.forEach((f) => {
        newFilter += `&free=${f}`;
      });
    }
    if (allValues.categoryName) {
      newFilter += `&categoryName=${allValues.categoryName}`;
    }

    setFilter(newFilter);
  };
  const handleReset = () => {
    form.resetFields();
    setFilter("");
    setPageNum(0);
  };
  const handleChangeCurrent = (value: number) => {
    setPageNum(value);
  };

  const toggleFilter = () => {
    setOpenFilter((prev) => !prev);
  };
  useEffect(() => {
    if (catName) {
      fetchCategoryChild(catName);
    }
    fetchCourses();
  }, [filter, pageNum, keyword, catName, topicId]);

  const fetchCategoryChild = async (catName: string) => {
    const res = await getByName(catName);
    console.log(res);
    if (res.status == 200) {
      const data = res.data as CategoryListGetType;
      setCategory(data);
    }
  };
  const fetchCourses = async () => {
    let query: string = "";
    if (keyword) {
      query += `&keyword=${keyword}`;
    }
    if (catName) {
      query += filter.includes("categoryName")
        ? ""
        : `&categoryName=${catName}`;
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
  };

  return (
    <div className="container">
      <div className="filter-container">
        <div className={clsx("filter-left", { open: openFilter })}>
          <div className={clsx("filter-form__wrapper", { open: openFilter })}>
            <Form
              className={clsx("filter-form", { open: openFilter })}
              layout="vertical"
              name="validate_other"
              onValuesChange={handleOnValuesChange}
              form={form}
              initialValues={{ sortBy: "none" }}
            >
              <Button
                onClick={handleReset}
                variant="outline"
                leftIcon={<IoFilter />}
                className="filter-btn-reset"
              >
                Reset
              </Button>
              {category && category.childrens.length > 0 && (
                <div className="filter-form-item">
                  <Divider className="filter-form-devider" />
                  <h2 className="filter-form-header">Categories</h2>
                  <Form.Item
                    className="filter-form-content"
                    name="categoryName"
                  >
                    <Radio.Group>
                      <Row>
                        {category.childrens.map((cat) => {
                          return (
                            <Col span={16} key={`radio-cat-${cat.id}`}>
                              <Radio
                                value={cat.name}
                                style={{ lineHeight: "32px" }}
                                className="filter-form-content-category"
                              >
                                <div className="radio-cat-name">{cat.name}</div>
                              </Radio>
                            </Col>
                          );
                        })}
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}

              <div className="filter-form-item">
                <Divider className="filter-form-devider" />
                <h2 className="filter-form-header">Rating</h2>
                <Form.Item className="filter-form-content" name="ratingStar">
                  <Radio.Group>
                    <Row>
                      <Col span={24}>
                        <Radio
                          value="4.5"
                          className="filter-form-content-checkbox"
                        >
                          <Rate
                            allowHalf
                            className="filter-form-content-rating"
                            disabled
                            value={4.5}
                          />
                          <span className="filter-form-content-text">
                            4.5 & ups
                          </span>
                        </Radio>
                      </Col>
                      <Col span={24}>
                        <Radio
                          value="4.0"
                          className="filter-form-content-checkbox"
                        >
                          <Rate
                            className="filter-form-content-rating"
                            disabled
                            value={4}
                          />
                          <span className="filter-form-content-text">
                            4.0 & ups
                          </span>
                        </Radio>
                      </Col>
                      <Col span={24}>
                        <Radio
                          value="3.5"
                          className="filter-form-content-checkbox"
                        >
                          <Rate
                            allowHalf={true}
                            className="filter-form-content-rating"
                            disabled
                            value={3.5}
                          />
                          <span className="filter-form-content-text">
                            3.5 & ups
                          </span>
                        </Radio>
                      </Col>
                      <Col span={24}>
                        <Radio
                          value="3.0"
                          className="filter-form-content-checkbox"
                        >
                          <Rate
                            className="filter-form-content-rating"
                            disabled
                            value={3}
                          />
                          <span className="filter-form-content-text">
                            3 & ups
                          </span>
                        </Radio>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div className="filter-form-item">
                <Divider className="filter-form-devider" />
                <h2 className="filter-form-header">Level</h2>
                <Form.Item className="filter-form-content" name="level">
                  <Checkbox.Group>
                    <Row>
                      <Col span={16}>
                        <Checkbox
                          value="AllLevel"
                          style={{ lineHeight: "32px" }}
                          className="filter-form-content-checkbox"
                        >
                          <span className="filter-form-content-text">
                            All Levels
                          </span>
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox
                          value="Beginner"
                          style={{ lineHeight: "32px" }}
                          className="filter-form-content-checkbox"
                        >
                          <span className="filter-form-content-text">
                            Beginner
                          </span>
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox
                          value="Intermediate"
                          style={{ lineHeight: "32px" }}
                          className="filter-form-content-checkbox"
                        >
                          <span className="filter-form-content-text">
                            Intermediate
                          </span>
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox
                          value="Expert"
                          style={{ lineHeight: "32px" }}
                          className="filter-form-content-checkbox"
                        >
                          <span className="filter-form-content-text">
                            Expert
                          </span>
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>
              <div className="filter-form-item">
                <Divider className="filter-form-devider" />
                <h2 className="filter-form-header">Price</h2>
                <Form.Item className="filter-form-content" name="free">
                  <Checkbox.Group>
                    <Row>
                      <Col span={16}>
                        <Checkbox
                          value="0"
                          style={{ lineHeight: "32px" }}
                          className="filter-form-content-checkbox"
                        >
                          <span className="filter-form-content-text">Paid</span>
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox
                          value="1"
                          style={{ lineHeight: "32px" }}
                          className="filter-form-content-checkbox"
                        >
                          <span className="filter-form-content-text">Free</span>
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
        {openFilter && (
          <div className="filter__dismiss">
            <Button
              variant="circle"
              className="filter-dismiss__btn"
              onClick={toggleFilter}
              aria-label="Close menu"
            >
              <FaTimes className="icon" />
            </Button>
          </div>
        )}
        <div
          className="filter__overlay"
          onClick={() => setOpenFilter(false)}
        ></div>

        <div className="filter-right">
          <Button
            variant="outline"
            leftIcon={<IoFilterOutline />}
            className="filter-right__btn d-none d-lg-flex"
            onClick={toggleFilter}
          >
            All Filters
          </Button>
          <div className="filter-right-container">
            {courses &&
              courses.map((course, index) => {
                return (
                  <Fragment key={`filter-course-${course.id}`}>
                    <FilterCourse course={course} />
                    {index < courses.length - 1 && (
                      <Divider className="filter-right-course-devider" />
                    )}
                  </Fragment>
                );
              })}
          </div>
          <Pagination
            current={pageNum}
            total={totalElements}
            pageSize={10}
            onChange={handleChangeCurrent}
          />
        </div>
      </div>
    </div>
  );
}

export default Filter;
