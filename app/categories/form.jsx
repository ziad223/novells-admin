import { alert_msg, get_session } from "@/public/script/public";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Form_Category = ({ id }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    color: "",
  });
  const [loading, setLoading] = useState(false);

  // جلب البيانات إذا كان هناك ID
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        const token = get_session("user")?.access_token;

        if (!token) {
          alert("Access token is required. Please login.");
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `https://webtoon.future-developers.cloud/api/admin/categories/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setFormData({
              name: data.data.name || "",
              color: data.data.color || "",
            });
          } else {
            console.error("Failed to fetch data.");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const token = get_session("user")?.access_token;

    if (!token) {
      alert("Access token is required. Please login.");
      setLoading(false);
      return;
    }

    const requestData = {
      name: formData.name,
      color: formData.color,
    };

    const url = id
      ? `https://webtoon.future-developers.cloud/api/admin/categories/${id}`
      : "https://webtoon.future-developers.cloud/api/admin/categories";

    if (id) {
      requestData.category_id = id;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);

        alert_msg(
          id
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
        router.push('/categories');
      } else {
        const errorData = await response.text();
        console.error("Error:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#1a2941] rounded">
      <h2 className="text-lg font-bold mb-4">
        {id ? "Update Category" : "Create Category"}
      </h2>

      <div className="space-y-4">
        {/* اسم */}
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 rounded bg-[#0e1726]"
            required
          />
        </div>

        {/* اللون */}
        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full p-4 rounded bg-[#0e1726]"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="p-4 block mt-10 lg:w-[300px] bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Processing..." : id ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default Form_Category;
