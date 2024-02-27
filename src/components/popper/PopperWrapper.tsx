import { ReactNode } from "react"
import './PopperWrapper.style.scss'
type Props = {
    children: ReactNode
}
function PopperWrapper(props: Props) {
    const { children } = props;
    return (
        <div className="popper-wrapper">{children}</div>
    )
}

export default PopperWrapper