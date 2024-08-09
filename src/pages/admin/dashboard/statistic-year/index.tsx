import { DatePicker, DatePickerProps } from "antd";
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import dayjs from 'dayjs';
import { useEffect, useState } from "react"
import './StatisticYear.style.scss'
import { getStatisticByTime } from "../../../../services/StatisticService";
type statisticType = {
    name: string,
    total: number
}
function StatisticYear() {
    const currentYear = dayjs().startOf('year');
    const currentYearNum = dayjs().year();
    const [year, setYear] = useState<number>(currentYearNum);
    const [statisticByYear, setStatisticByYear] = useState<statisticType[]>();
    const onChange: DatePickerProps['onChange'] = (_date, dateString) => {
        const newYearNum = parseInt(dateString);
        console.log(dateString);
        console.log(newYearNum);
        setYear(newYearNum);
    };

    const fetchStatisticByTime = async (time: string) => {
        console.log(time);
        const res = await getStatisticByTime(time);
        console.log(res);
        if (res.status === 200) {
            const data = res.data;
            setStatisticByYear(data);
        }

    }
    useEffect(() => {
        let time: string = "";
        if (year) {
            time += `?year=${year}`
        }
        fetchStatisticByTime(time);
    }, [year,])
    return <div className="dashboard-chart-year-container">
        <div className="dashboard-input-year">
            <span>Chọn năm</span>
            <DatePicker onChange={onChange} picker="year" defaultValue={currentYear} />
        </div>
        <div className="dashboard-chart-container">
            <div className="dashboard-chart-header">
                Biểu đồ doanh thu theo từng tháng trong năm
            </div>
            <ResponsiveContainer width="100%" height="80%" >
                <BarChart
                    width={500}
                    height={300}
                    data={statisticByYear}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" >
                    </XAxis>
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" margin={{ bottom: 50 }} />
                    <Bar dataKey="total" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
}

export default StatisticYear;