import { Button, DatePicker, DatePickerProps } from "antd";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import dayjs from 'dayjs';
import { useEffect, useState } from "react"
import './StatisticMonth.style.scss'
import { exportByTime, getStatisticByTime } from "../../../../services/StatisticService";
import { formatCurrency } from "../../../../utils/Format";
import { FaFileExcel } from "react-icons/fa6";
type statisticType = {
    name: string,
    total: number
}
function StatisticMonth() {
    const currentMonth = dayjs().startOf('month');
    const currentTime = dayjs().format('YYYY-MM');
    const [time, setTime] = useState<string>(currentTime);
    const [statisticByMonth, setStatisticByMonth] = useState<statisticType[]>();
    const onChange: DatePickerProps['onChange'] = (_date, dateString) => {
        setTime(dateString);
    };

    const fetchStatisticByTime = async (time: string) => {
        const res = await getStatisticByTime(time);
        console.log(res);
        if (res.status === 200) {
            const data = res.data;
            setStatisticByMonth(data);
        }

    }


    const handleExport = async () => {
        if (statisticByMonth && statisticByMonth.length > 0) {
            const res = await exportByTime(statisticByMonth);
            if (res.status == 200) {
                alert("success");
            }
        } else {
            alert("No data to export")
        }
    }

    useEffect(() => {
        let param: string = "";
        if (time) {
            const dateArray = time.split("-");
            const newYearNum = parseInt(dateArray[0]);
            const newMonthNum = parseInt(dateArray[1])
            console.log(newMonthNum);
            console.log(newYearNum);
            param += `?year=${newYearNum}&month=${newMonthNum}`
        }
        fetchStatisticByTime(param);
    }, [time])
    return <div className="dashboard-chart-month-container">
        <div className="dashboard-input-month">

            <div className="dashboard-month-year-left">
                <span>Chọn tháng</span>
                <DatePicker onChange={onChange} picker="month" defaultValue={currentMonth} />
            </div>
            <div className="dashboard-month-year-right">
                <Button onClick={handleExport} className="dashboard-month-year-btn-export" icon={<FaFileExcel />}>Xuất file</Button>
            </div>
        </div>
        <div className="dashboard-chart-container">
            <div className="dashboard-chart-header">
                Biểu đồ doanh thu theo từng ngày trong tháng
            </div>
            <ResponsiveContainer width="100%" height="80%" >
                <BarChart
                    width={500}
                    height={300}
                    data={statisticByMonth}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: "10px" }} >
                    </XAxis>
                    <YAxis style={{ fontSize: "10px" }}
                        tickFormatter={(value) => {
                            return `${formatCurrency(value)}`
                        }} />
                    <Tooltip formatter={(value: number) => {
                        return `${formatCurrency(value)}`
                    }} />
                    <Legend verticalAlign="top" margin={{ bottom: 50 }} />
                    <Bar name="Tổng tiền" dataKey="total" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>;
}

export default StatisticMonth;