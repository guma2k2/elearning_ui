import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { ILecture, IQuiz, SectionType } from '../../types/CourseType';
import { NotePost, NoteType } from '../../types/NoteType';
import { FaTrash } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import './Note.style.scss'
import { convertSecondToMinute } from '../../utils/Format';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import ReactQuill from 'react-quill';
import { Button, Popconfirm } from 'antd';
import { deleteNote, updateNote } from '../../services/NoteService';
import { AxiosError } from 'axios';
import { ErrorType } from '../../types/ErrorType';

type propType = {
    note: NoteType,
    setNotes: Dispatch<SetStateAction<NoteType[]>>,
    notes: NoteType[]
}
const modules = {
    toolbar: [
        ['bold', 'italic'],  // Customize the toolbar to include only bold and italic options
    ],
};
const formats = [
    'bold', 'italic'
];
function Note(props: propType) {
    const { note, setNotes } = props;
    const { learning } = useAppSelector((state: RootState) => state.learning);
    const [content, setContent] = useState<string>(note.content);
    const [toggle, setToggle] = useState<boolean>(false);
    const getCurrentSection = (): SectionType | undefined => {
        if (learning) {
            return learning.course.sections.find((sec) =>
                sec.curriculums.some((cur) => cur.type == "lecture" && cur.id === note.lectureId)
            );
        }
        return undefined;
    };

    const getCurrentLecture = (): ILecture | IQuiz | undefined => {
        if (learning) {
            const section = learning.course.sections.find((sec) =>
                sec.curriculums.some((cur) => cur.type == "lecture" && cur.id === note.lectureId)
            );
            if (section) {
                return section.curriculums.find((cur) => cur.id === note.lectureId && cur.type == "lecture");
            }
        }
        return undefined;
    };
    const handleUpdateNode = async () => {
        if (note) {
            const notePost: NotePost = {
                ...note, content
            }
            console.log(notePost);
            try {
                const res = await updateNote(notePost);
                if (res.status === 200) {
                    const data = res.data as NoteType
                    setNotes((prevNotes) =>
                        prevNotes?.map((note) => (note.id === data.id ? data : note))
                    );
                    setToggle(false);
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message);
                }
            }
        }
    }
    const handleDelete = async () => {
        if (note) {
            try {
                const res = await deleteNote(note.id);
                if (res.status === 204) {
                    alert("Delete successful")
                    setNotes((prevNotes) =>
                        prevNotes?.filter((item) => item.id !== note.id)
                    );
                }
            } catch (error: AxiosError | any) {
                if (error.response) {
                    console.log(error.response.data);
                    const data = error.response.data as ErrorType;
                    const message = data.details;
                    alert(message);
                }
            }
        }
    }
    return <div className="note-container">
        <div className="note-header">
            <div className="note-header-left">
                <span className='note-time'>{convertSecondToMinute(note.second)}</span>
                <span className='note-section-title'>{getCurrentSection()?.title}</span>
                <span className='note-lecture-title'>{getCurrentLecture()?.title}</span>
            </div>
            <div className="note-header-right">
                <MdEdit className='note-edit' onClick={() => setToggle(true)} />
                <Popconfirm
                    title="Xóa ghi chu này?"
                    description="Bạn có chắc chắn muốn xóa ghi chu này"
                    okText="Có"
                    cancelText="Không"
                    placement='left'
                    onConfirm={handleDelete}
                >
                    <FaTrash className='note-delete' />
                </Popconfirm>
            </div>
        </div>
        {toggle == false && <div
            className="learning-note-content"
            dangerouslySetInnerHTML={{
                __html: note.content,
            }}
        ></div>}
        {toggle == true && <Fragment>
            <div className="drawer-rte"><ReactQuill modules={modules} formats={formats} theme="snow" value={content} onChange={setContent} placeholder="Note content" /></div>
            <div className="drawer-btn">
                <Button className='btn-learning-prev' onClick={() => setToggle(false)} >
                    <span>HUY BO</span>
                </Button>
                <Button className='btn-learning-next' onClick={handleUpdateNode}>
                    <span>CAP NHAT GHI CHU</span>
                </Button>
            </div>
        </Fragment>}
    </div>;
}

export default Note;