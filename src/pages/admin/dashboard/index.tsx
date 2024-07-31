import { Card, DatePicker, DatePickerProps } from "antd"
import { useEffect, useState } from "react"
import './Dashboard.style.scss'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, Legend, YAxis, Tooltip, Bar, Rectangle } from "recharts";
import { getStatisticByTime } from "../../../services/StatisticService";
type statisticType = {
    name: string,
    total: number
}
function Dashboard() {
    const [year, setYear] = useState<number>();
    const [statisticByYear, setStatisticByYear] = useState<statisticType[]>();
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

    const fetchStatisticByTime = async (time: string) => {
        const res = await getStatisticByTime(time);
        if (res.status === 200) {
            const data = res.data;
            setStatisticByYear(data);
        }

    }
    useEffect(() => {
        let time: string = "";
        fetchStatisticByTime(time);
    }, [year])

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-header">THỐNG KÊ</h1>
            <div className="dashboard-card-container">
                <Card title="Đơn hàng" bordered={false} style={{ width: 300 }}>
                    <p>10</p>
                </Card>
                <Card title="Đánh giá" bordered={false} style={{ width: 300 }}>
                    <p>10</p>
                </Card>
                <Card title="Khóa học" bordered={false} style={{ width: 300 }}>
                    <p>10</p>
                </Card>
                <Card title="Học sinh" bordered={false} style={{ width: 300 }}>
                    <p>10</p>
                </Card>
            </div>
            <div className="dashboard-input-year">
                <span>Chọn năm</span>
                <DatePicker onChange={onChange} picker="year" />
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
    )
}

export default Dashboard