import { ChangeEvent, RefObject } from 'react'
import './InputFile.style.scss'
type Probs = {
    title: string
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
    fileRef:RefObject<HTMLInputElement>
}
function InputFile(probs: Probs) {
    return (
        <>
            <label htmlFor="inputFileId" className="inputFile-container">
                <div className="inputFile-wrapper">
                    <div className="input">No file selected</div>
                    <div className="btn">{probs.title}</div>
                </div>
                <input type="file" id="inputFileId" hidden onChange={probs.handleFileChange} />
            </label>

        </>
    )
}

export default InputFile