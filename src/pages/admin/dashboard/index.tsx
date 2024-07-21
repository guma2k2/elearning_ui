import { Card, DatePicker, DatePickerProps } from "antd"
import './Dashboard.style.scss'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, Legend, YAxis, Tooltip, Bar, Rectangle, Label } from "recharts";
const data = [
    {
        name: 'Th 1',
        total: 4000,
    },
    {
        name: 'Th 2',
        total: 3000,
    },
    {
        name: 'Th 3',
        total: 2000,
    },
    {
        name: 'Th 4',
        total: 2780,
    },
    {
        name: 'Th 5',
        total: 1890,
    },
    {
        name: 'Th 6',
        total: 2390,
    },
    {
        name: 'Th 7',
        total: 3490,
    },
    {
        name: 'Th 8',
        total: 3000,
    },
    {
        name: 'Th 9',
        total: 2000,
    },
    {
        name: 'Th 10',
        total: 2780,
    },
    {
        name: 'Th 11',
        total: 1890,
    },
    {
        name: 'Th 12',
        total: 2390,
    }
];

function Dashboard() {
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
    };

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
                        data={data}
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