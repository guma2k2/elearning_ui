import { Divider } from "antd";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import { CourseGetType } from "../../types/CourseType";
import { useNavigate } from "react-router-dom";
import { getSuggestions } from "../../services/CourseService";

type PropType = {
    suggestions: string[] | undefined;
    deferredKeyword: string;
};
function PopoverSearch(props: PropType) {
    const { suggestions, deferredKeyword } = props;
    const navigate = useNavigate();

    return (
        <div className="popover-search-container">
            <div className="popover-search-header">
                <div className="popover-search-header-top">
                    <IoIosSearch />
                    <span>Kết quả cho '{deferredKeyword}'</span>
                </div>
                <Divider className="popover-search-header-divider" />
            </div>
            <ul className="popover-search__list">
                {suggestions &&
                    suggestions.length > 0 &&
                    suggestions.map((item, index) => {
                        return (
                            <li className="popover-search__item" key={`course-search-${index}`}>
                                {item}
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}

export default PopoverSearch;
