import instance from "../utils/axiosCustomize";

export const getCarts = async () => {
    const url = `/carts`
    const res = await instance.get(url);
    return res;
}



export const deleteCartById = async (cartId: number | undefined) => {
    const url = `/carts/${cartId}`
    const res = await instance.delete(url);
    return res;
}



export const updateCartBuyLaterById = async (cartId: number | undefined) => {
    const url = `/carts/${cartId}`
    const res = await instance.put(url);
    return res;
}

