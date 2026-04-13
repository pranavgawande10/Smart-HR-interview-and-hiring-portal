function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
      <p className="text-sm text-green-600 mt-1">{subtitle}</p>
    </div>
  );
}

export default StatCard;
