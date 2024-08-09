import { Button, Divider } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { Dispatch, Fragment, SetStateAction } from "react";
type PropType = {
    setOpen: Dispatch<SetStateAction<boolean>>
}
function PopoverCart(props: PropType) {
    const { carts } = useAppSelector((state: RootState) => state.carts);
    const navigate = useNavigate();
    const { setOpen } = props
    const cartLength = carts ? carts.length : 0;
    const totalPrice = carts ? carts.reduce((total, item) => total + item.course.price, 0) : 0
    const handleRedirectToCartPage = () => {
        navigate("/cart")
        setOpen(false);
    }
    return <div className="popover-cart-container">
        <div className="popover-cart-top" >
            <div className="popover-carts-wrapper">
                {carts && carts.map((cart, index) => {
                    return <Fragment key={`cart-item-${index}`} >
                        <div className="popover-carts-item">
                            <div className="popover-carts-item-left">
                                <img src={cart.course.image} alt="course-image" />
                            </div>
                            <div className="popover-carts-item-right">
                                <h3 className="popover-carts-item-title">{cart.course.title}</h3>
                                <span className="popover-carts-item-instructor">{cart.course.createdBy}</span>
                                <span>{cart.course.price} d</span>
                            </div>
                        </div>
                        {index !== cartLength && <Divider className="popover-cart-devider" />}
                    </Fragment>
                })}
            </div>
        </div>
        <div className="popover-cart-bottom">
            <span className="popover-cart-bottom-price">Tổng tiền: {totalPrice} d</span>
            <Button onClick={handleRedirectToCartPage} className="popover-cart-bottom-btn">Chuyển đến giỏ hàng</Button>
        </div>

    </div>
}

export default PopoverCart;