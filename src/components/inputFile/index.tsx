import { ChangeEvent, RefObject } from 'react'
import './InputFile.style.scss'
type Probs = {
    title: string
    filename?: string
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    fileRef: RefObject<HTMLInputElement>
}
function InputFile(probs: Probs) {
    const { fileRef, handleFileChange, title, filename } = probs;
    return (
        <>
            <label htmlFor="inputFileId" className="inputFile-container">
                <div className="inputFile-wrapper">
                    <div className="input">{filename ? filename : "No file selected"}</div>
                    <div className="btn">{title}</div>
                </div>
                <input ref={fileRef} type="file" id="inputFileId" hidden onChange={handleFileChange} />
            </label>

        </>
    )
}

export default InputFile