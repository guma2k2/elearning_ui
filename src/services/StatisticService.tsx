import { statisticType } from "../pages/admin/dashboard/statistic-year";
import { StatisticProductType } from "../types/StatisticType";
import instance from "../utils/axiosCustomize";

export const getStatisticByTime = async (param: string) => {
    const url = `/statistic/time${param}`
    const res = await instance.get(url);
    return res;
}

export const getDashboard = async () => {
    const url = `/statistic/dashboard`
    const res = await instance.get(url);
    return res;
}

export const getStatisticCourseByTime = async (param: string) => {
    const url = `/statistic/course${param}`
    const res = await instance.get(url);
    return res;
}

export const exportByTime = async (body: statisticType[] | undefined) => {
    const url = `/statistic/time/export`
    const res = await instance.post(url, body, { responseType: "blob" });
    const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "statistics.xlsx"; // Set the file name

    // Programmatically click the link to start download
    document.body.appendChild(link);
    link.click();

    // Clean up the link element
    document.body.removeChild(link);
    return res;
}

export const exportByCourse = async (body: StatisticProductType[] | undefined) => {
    const url = `/statistic/course/export`
    const res = await instance.post(url, body, { responseType: "blob" });
    const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "statistics.xlsx"; // Set the file name

    // Programmatically click the link to start download
    document.body.appendChild(link);
    link.click();

    // Clean up the link element
    document.body.removeChild(link);
    return res;
}