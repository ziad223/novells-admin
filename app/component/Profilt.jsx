import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { get_session, api_host, alert_msg } from "@/public/script/public";

// إعداد interceptor لتوزيع التوكين في جميع الطلبات
axios.interceptors.request.use(
  (config) => {
    const token = get_session("user")?.access_token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Profit = () => {
  const [profitView, setProfitView] = useState('');
  const [profitPoint, setProfitPoint] = useState('');

  useEffect(() => {
    // تحميل البيانات عند تحميل المكون
    axios.get(`${api_host}/admin/settings/all`)
      .then((response) => {
        const { data } = response;
        if (data && data.data) {
          setProfitView(data.data.profit_view);
          setProfitPoint(data.data.profit_point);
        }
      })
      .catch((error) => {
        console.error("Error fetching settings:", error);
      });
  }, []);

  const handleSave = () => {
    // إرسال البيانات عند التحديث
    axios.post(`${api_host}/admin/settings/update`, {
      profit_view: profitView,
      profit_point: profitPoint
    })
    .then((response) => {
      if (response.data.status === 'success') {
        alert_msg('Settings updated successfully');
        console.log('Settings updated successfully');
      }
    })
    .catch((error) => {
      console.error("Error updating settings:", error);
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Edit Profit Settings</h1>

      <div className="mb-4">
        <label htmlFor="profit_view" className="block text-lg font-medium mb-2">Profit View</label>
        <input 
          type="text" 
          id="profit_view" 
          value={profitView} 
          onChange={(e) => setProfitView(e.target.value)} 
          className="w-full p-3 bg-gray-700  rounded-md shadow-sm  focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="profit_point" className="block text-lg font-medium mb-2">Profit Point</label>
        <input 
          type="text" 
          id="profit_point" 
          value={profitPoint} 
          onChange={(e) => setProfitPoint(e.target.value)} 
          className="w-full p-3 bg-gray-700  rounded-md shadow-sm  focus:ring-indigo-500"
        />
      </div>

      <div className="text-center">
        <button onClick={handleSave} className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Profit;
