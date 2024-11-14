import Canvas from "./Canvas";
import Toolbar from "./ToolBar";
import './whiteboard.style.scss'
function WhiteBoard() {
    return <div className="whiteboard-container">
        <Toolbar />
        <Canvas />
    </div>
}

export default WhiteBoard;