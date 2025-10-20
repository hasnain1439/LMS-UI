import { LuBookOpen, LuFileQuestion, LuUserCheck, LuUsers } from "react-icons/lu";
import StatCard from "../../../../component/StatCard";
import LineCharts from "./LineChart";
import EnrollmentCharts from "./EnrollmentStatusCharts";
import RecentActiveStudent from "./RecentActiveStudent";

export default function DashboardHome() {
  const stats = [
    { title: "Total Courses", value: 6 , status: "Up 5% from last week", icon: <LuUsers />},
    { title: "Total Quizzes", value: 18 , status: "Up 5% from last week", icon: <LuBookOpen />},
    { title: "Students Enrolled", value: 145, status: "Up 5% from last week",  icon: <LuFileQuestion />},
    { title: "Pending Grading", value: 5 , status: "Up 5% from last week", icon: <LuUserCheck />}
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} status={s.status} icon={s.icon} />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-lg shadow"><LineCharts/></div>
        <div className="bg-white p-4 rounded-lg shadow"><EnrollmentCharts/></div>
      </div>  
      <div className="w-full bg-white p-3 sm:p-5 rounded-lg shadow my-4">
        <RecentActiveStudent/>
      </div>
    </div>
  );
}
