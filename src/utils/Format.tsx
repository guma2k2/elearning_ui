import dayjs from 'dayjs';
export const convertSecondToMinute = (seconds: number) => {
    const secondInt = Math.floor(seconds)
    const minutes = Math.floor(secondInt / 60);
    const remainingSeconds = secondInt % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


export const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
        price,
    );
}

export const formatDate = (date: string) => {
    const formattedDate = dayjs(date).format('DD [thg] MM, YYYY');
    return formattedDate;
}