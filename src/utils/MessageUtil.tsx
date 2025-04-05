import { Bounce, toast } from 'react-toastify';
export const showMessage = (message: string, type: "success" | "error") => {
    if (type == "success") {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    } else if (type == "error") {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }
}

export const ADD_SUCCESS_MESSAGE = "Thêm thành công"
export const UPDATE_SUCCESS_MESSAGE = "Sửa thành công"
export const DELETE_SUCCESS_MESSAGE = "Xóa thành công"
