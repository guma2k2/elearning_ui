import './Arrow.style.scss'
type Props = {
    type: "next" | "prev"
}
function Arrow(props: Props) {
    const { type } = props;
    return (
        <div
            className="arrow-container"
            style={{ [type === "next" ? "left" : "right"]: type === "next" ? "50px" : "0" }}
        />
    );
}

export default Arrow