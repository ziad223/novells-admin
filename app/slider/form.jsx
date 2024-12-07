import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { get_session, alert_msg } from "@/public/script/public";
import Loader from "@/app/component/loader";

export default function Form_Slider({ id }) {
  const router = useRouter();
  const [data, setData] = useState({ image: "", link: "https://webtoons-clone.vercel.app" });
  const [loader, setLoader] = useState(true);
  const [imageFile, setImageFile] = useState(null); // لتخزين ملف الصورة
  const [imagePreview, setImagePreview] = useState(""); // لتخزين الصورة المعروضة (معاينة)

  // تحميل بيانات العنصر عند التعديل
  const fetchItem = async () => {
    const token = get_session("user")?.access_token;
    if (!token) {
      setLoader(false);
      return alert_msg("Authorization token is missing", "error");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(
        `https://webtoon.future-developers.cloud/api/admin/slider/show/${id}`,
        { headers, method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      const result = await response.json();
      const product = result.data;

      if (!product?.id) {
        return router.replace("/slider");
      }

      setData({ ...product, link: product.link || "" });
      setImagePreview(product.image); // عرض الصورة الحالية
      setLoader(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoader(false);
    }
  };

  // حفظ الصورة والرابط
  const saveItem = async () => {
    if (!imageFile && !data.image) {
      alert_msg("Please select an image before saving.", "error");
      return;
    }

    setLoader(true);

    const token = get_session("user")?.access_token;
    if (!token) {
      setLoader(false);
      return alert_msg("Authorization token is missing", "error");
    }

    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile); // إضافة الصورة فقط إذا تم تحديدها
    }
    formData.append("link", data.link);

    const url = id ? `admin/slider/update/${id}` : "admin/slider/store";

    try {
      const response = await fetch(`https://webtoon.future-developers.cloud/api/${url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        alert_msg(
          id ? `Item (${id}) updated successfully` : "New item added successfully"
        );
        router.replace("/slider");
      } else {
        alert_msg("Error occurred", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoader(false);
    }
  };

  // تحميل الصورة
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file); // حفظ ملف الصورة
    const imageUrl = URL.createObjectURL(file); // إنشاء رابط معاينة للصورة
    setImagePreview(imageUrl); // عرض الصورة الجديدة
  };

  // تحميل البيانات عند التعديل
  useEffect(() => {
    document.title = id ? "Edit Slider" : "Add Slider";
    id ? fetchItem() : setLoader(false);
  }, [id]);

  return (
    <div className="edit-item-info relative">
      {loader ? (
        <Loader bg />
      ) : (
        <div className="flex flex-col gap-2.5 xl:flex-row">
          <div className="flex flex-1 flex-col xl:w-[70%]">
            <div className="panel no-select flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
              <div className="p-5">
                <div className="flex items-center justify-center w-1/2">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                      )}
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="left-tab no-select mt-6 w-full xl:mt-0 xl:w-[30%]">
            <div className="panel">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-1">
                <button type="button" className="pointer btn btn-success w-full gap-2" onClick={saveItem}>
                  Save
                </button>
                <button type="button" className="pointer btn btn-warning w-full gap-2" onClick={() => router.replace("/slider")}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
