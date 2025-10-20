export default function EnrollmentsPage() {
  const students = [
    { name: "Ali Khan", course: "Web Development", status: "Active" },
    { name: "Sara Ahmed", course: "Database Systems", status: "Pending" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Student Enrollments</h1>
      <table className="w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Course</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{s.name}</td>
              <td className="py-2 px-4">{s.course}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    s.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
