"use client";

import { get_session } from "@/public/script/public";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "@/app/component/chart";
import axios from "axios";

export default function Home() {
  const config = useSelector((state) => state.config);

  const [statistics, setStatistics] = useState(null);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        "https://webtoon.future-developers.cloud/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${get_session("user")?.access_token}`,
          },
        }
      );

      const data = response.data;
      console.log("Fetched Statistics:", data.data);

      setStatistics({
        totalAdmins: data.data.total_admins,
        totalUsers: data.data.total_users,
        totalComics: data.data.total_comics,
        totalCategories: data.data.total_categories,
        usersByMonth: data.data.users_per_month,
        comicsByCategory: data.data.comics_per_category,
        pendingRequests: data.data.pending_requests,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    document.title = config.text.dashboard || get_session("text")?.dashboard;
    fetchStatistics();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {statistics ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <Chart
              type="area"
              label="Total Users"
              title="Total Users"
              color="info"
              icon="user"
              total={statistics.totalUsers || 0}
              series={[]}
            />

            <Chart
              type="area"
              label="Total Admins"
              title="Total Admins"
              color="success"
              icon="admin"
              total={statistics.totalAdmins || 0}
              series={[]}
            />

            <Chart
              type="area"
              label="Total Comics"
              title="Total Comics"
              color="warning"
              icon="comic"
              total={statistics.totalComics || 0}
              series={
                Array.isArray(statistics.comicsByCategory)
                  ? statistics.comicsByCategory.map((item) => item.comics_count)
                  : []
              }
            />

            <Chart
              type="area"
              label="Total Categories"
              title="Total Categories"
              color="secondary"
              icon="category"
              total={statistics.totalCategories || 0}
              series={[]}
            />
          </div>

          {/* Pending Requests */}
          <div className="bg-[#0f1a2c] shadow rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Pending Requests</h2>
            <p className="text-xl font-semibold text-red-500">{statistics.pendingRequests || 0}</p>
          </div>

          {/* Comics by Category */}
          <div className="bg-[#0f1a2c] shadow rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Comics by Category</h2>
            <div className="overflow-auto">
              <table className="min-w-full table-auto border-collapse border border-blue-800">
                <thead>
                  <tr className="bg-[#0f1a2c]">
                    <th className="px-4 py-2 border border-blue-800">Category</th>
                    <th className="px-4 py-2 border border-blue-800">Comics Count</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.comicsByCategory.map((category, index) => (
                    <tr key={index} className="bg-[#0f1a2c]">
                      <td className="px-4 py-2 border border-blue-800">{category.category}</td>
                      <td className="px-4 py-2 border border-blue-800">{category.comics_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users per Month */}
          <div className="bg-[#0f1a2c] shadow rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">Users by Month</h2>
            <div className="overflow-auto">
              <table className="min-w-full table-auto border-collapse border border-blue-800">
                <thead>
                  <tr className="bg-[#0f1a2c]">
                    <th className="px-4 py-2 border border-blue-800">Year</th>
                    <th className="px-4 py-2 border border-blue-800">Month</th>
                    <th className="px-4 py-2 border border-blue-800">User Count</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.usersByMonth.map((user, index) => (
                    <tr key={index} className="bg-[#1a2941]">
                      <td className="px-4 py-2 border border-blue-800">{user.year}</td>
                      <td className="px-4 py-2 border border-blue-800">{user.month}</td>
                      <td className="px-4 py-2 border border-blue-800">{user.user_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
}
