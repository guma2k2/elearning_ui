import './InputFile.style.scss'
type Probs = {
    title: string
}
function InputFile(probs: Probs) {
    return (
        <>
            <label htmlFor="inputFileId" className="inputFile-container">
                <div className="inputFile-wrapper">
                    <div className="input">No file selected</div>
                    <div className="btn">{probs.title}</div>
                </div>
                <input type="file" id="inputFileId" hidden />
            </label>

        </>
    )
}

export default InputFile