"use client";

import { get_session } from "@/public/script/public";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axios from "axios";
import Chart from "./component/chart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

  // Prepare data for comics by category (Line Chart)
  const comicsData = {
    labels: statistics?.comicsByCategory.map((category) => category.category),
    datasets: [
      {
        label: "Comics by Category",
        data: statistics?.comicsByCategory.map((category) => category.comics_count),
        borderColor: "#4A90E2", // Color of the line
        backgroundColor: "rgba(74, 144, 226, 0.2)", // Background under the line
        fill: true, // Fill area under the line
        tension: 0.4, // Smooth the line
        pointBackgroundColor: "#4A90E2", // Color of the points
        pointBorderColor: "#fff", // Border color of the points
        pointBorderWidth: 2,
        pointRadius: 5, // Size of the points
        borderWidth: 2,
      },
    ],
  };

  // Prepare data for users by month (Doughnut Chart)
  const usersData = {
    labels: statistics?.usersByMonth.map((user) => `${user.month} ${user.year}`),
    datasets: [
      {
        label: "Users by Month",
        data: statistics?.usersByMonth.map((user) => user.user_count),
        backgroundColor: [
          "#FF6F61", // User Count Color 1
          "#FFD700", // User Count Color 2
          "#4CAF50", // User Count Color 3
          "#2196F3", // User Count Color 4
          "#9C27B0", // User Count Color 5
        ],
        borderWidth: 0,
      },
    ],
  };

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
              series={[]}
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


         <div className="flex justify-center gap-5 flex-col lg:flex-row">
            <div className="bg-[#0f1a2c] shadow rounded-lg p-4 lg:w-1/2 w-[90%]">
              <h2 className="text-lg font-bold mb-2">Comics by Category</h2>
              <div className="w-full h-[400px]"> {/* Increased height */}
                <Line
                  data={comicsData}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw} Comics`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: true, // Show grid lines on the X-axis
                          color: '#4A90E2', // Color for grid lines
                        },
                        ticks: {
                          beginAtZero: true, // Ensure the ticks start at 0
                        },
                        borderColor: '#4A90E2', // Vertical center line color
                        borderWidth: 2, // Width of the vertical center line
                      },
                      y: {
                        grid: {
                          display: true, // Show grid lines on the Y-axis
                          color: '#4A90E2', // Color for grid lines
                        },
                        ticks: {
                          beginAtZero: true, // Ensure the ticks start at 0
                        },
                        borderColor: '#4A90E2', // Horizontal center line color
                        borderWidth: 2, // Width of the horizontal center line
                      },
                    },
                  }}
                />
              </div>

            </div>

            <div className="bg-[#0f1a2c] shadow rounded-lg p-4 lg:w-1/2 w-[90%] mx-auto">
              <h2 className="text-lg font-bold mb-2">Users by Month</h2>
              <div className="flex justify-center items-center w-full h-72">
                <Doughnut
                  data={usersData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw} Users`;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

         </div>


        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
}
