import { alert_msg, get_session } from "@/public/script/public";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Form_gateways = ({ id }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    photo: null,
    fee: "",
  });
  const [preview, setPreview] = useState(null);
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
            `https://webtoon.future-developers.cloud/api/admin/payment/gateways/show?gateway_id=${id}`,
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
              fee: data.data.fee || "",
              photo: null, // لن نقوم بتعديل photo هنا لأننا نعرض الرابط فقط
            });

            // تعيين الصورة المعاينة إذا كانت موجودة
            if (data.data.photo) {
              setPreview(data.data.photo);
            }
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
    const { name, value, files } = event.target;
    if (name === "photo") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

    const requestData = new FormData();
    requestData.append("name", formData.name);
    requestData.append("fee", formData.fee);
    if (formData.photo) {
      requestData.append("photo", formData.photo);
    }

    const url = id
      ? "https://webtoon.future-developers.cloud/api/admin/payment/gateways/update"
      : "https://webtoon.future-developers.cloud/api/admin/payment/gateways/store";

    if (id) {
      requestData.append("gateway_id", id);
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: requestData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);

        alert_msg(
          id
            ? "Payment gateway updated successfully!"
            : "Payment gateway created successfully!"
        );
        router.push('/geteways');
      } else {
        const errorData = await response.text();
        console.error("Error:", errorData);
        alert("Failed to process the request.");
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
        {id ? "Update Payment Gateway" : "Create Payment Gateway"}
      </h2>

      <div className="space-y-4">
        {/* صورة */}
        <div>
          <label className="block text-sm font-medium mb-2">Photo</label>
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 lg:w-[300px] lg:h-[300px] object-cover rounded border cursor-pointer"
                onClick={() => document.getElementById('photoInput').click()}
              />
            ) : (
              <button
                type="button"
                className="w-32 h-32 bg-gray-200 rounded border"
                onClick={() => document.getElementById('photoInput').click()}
              >
                Add Photo
              </button>
            )}
            <input
              type="file"
              id="photoInput"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>
        </div>

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

        {/* Fee */}
        <div>
          <label className="block text-sm font-medium mb-2">Fee</label>
          <input
            type="number"
            name="fee"
            value={formData.fee}
            onChange={handleChange}
            className="w-full p-4 rounded bg-[#0e1726]"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-4 block mt-5 py-4 lg:w-[300px]  bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Processing..." : id ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default Form_gateways;
