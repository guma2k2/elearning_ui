import { Button } from 'antd';
import './index.style.scss'
import ReactQuill from 'react-quill';
import { Dispatch, SetStateAction, useState } from 'react'
import { convertSecondToMinute } from '../../utils/Format';
import { createNote } from '../../services/NoteService';
import { NotePost, NoteType } from '../../types/NoteType';
import { AxiosError } from 'axios';
import { ErrorType } from '../../types/ErrorType';
const modules = {
    toolbar: [
        ['bold', 'italic'],  // Customize the toolbar to include only bold and italic options
    ],
};
const formats = [
    'bold', 'italic'
];

type propType = {
    setOpen: Dispatch<SetStateAction<boolean>>
    second: number
    lectureId: number | undefined,
    setNotes: Dispatch<SetStateAction<NoteType[]>>
}
function Drawer(props: propType) {
    const { setOpen, second, lectureId, setNotes } = props;
    const [content, setContent] = useState<string>("");
    const handleCreateNote = async () => {
        if (lectureId) {
            const notePost: NotePost = {
                content, second: Math.floor(second), lectureId
            }
            console.log(notePost);
            try {
                const res = await createNote(notePost);
                if (res.status === 201) {
                    setOpen(false);
                    const data = res.data as NoteType
                    setNotes((prev) => [...prev, data]);
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
    return <div className="drawer-container">
        <div className="drawer-header">
            Thêm ghi chú tại
            <span>{convertSecondToMinute(second)}</span>
        </div>
        <div className="drawer-rte"><ReactQuill modules={modules} formats={formats} theme="snow" value={content} onChange={setContent} placeholder="Note content" /></div>

        <div className="drawer-btn">
            <Button className='btn-learning-prev' onClick={() => setOpen(false)} >
                <span>HUY BO</span>
            </Button>
            <Button className='btn-learning-next' onClick={handleCreateNote}>
                <span>TAO GHI CHU</span>
            </Button>
        </div>
    </div>
}
export default Drawer;