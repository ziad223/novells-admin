import React, { useState } from "react";
import axios from "axios";
import { alert_msg, get_session } from "@/public/script/public";

const TermsSettings = () => {
    const [message1, setMessage1] = useState("");
    const [message2, setMessage2] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // منع التحديث الافتراضي للصفحة
        setLoading(true);

        try {
            const token = get_session('user').access_token; // استبدل بـ التوكين الخاص بك
            const response = await axios.post(
                "https://webtoon.future-developers.cloud/api/admin/settings/update",
                { message1, message2 },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // تضمين التوكين في الترويسة
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.status) {
                setMessage1("");
                setMessage2("");
                alert_msg('System has been updated successfully');

            } else {
                alert("Error updating settings. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while updating settings.");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Terms Settings</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-100 mb-2" htmlFor="message1">
                        Message 1
                    </label>
                    <input
                        type="text"
                        id="message1"
                        className="w-full border rounded p-2 bg-black border-blue-900"
                        value={message1}
                        onChange={(e) => setMessage1(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-100 mb-2" htmlFor="message2">
                        Message 2
                    </label>
                    <input
                        type="text"
                        id="message2"
                        className="w-full border rounded p-2 bg-black border-blue-900"
                        value={message2}
                        onChange={(e) => setMessage2(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Settings"}
                </button>
            </form>
        </div>
    );
};

export default TermsSettings;
