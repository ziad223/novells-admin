import React, { useEffect, useState } from "react";
import axios from "axios";
import { alert_msg , api_host } from "@/public/script/public";

const TermsSettings = () => {
    const [privacy, setPrivacy] = useState("");
    const [terms, setTerms] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch data from API
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                 const response = await axios.get(`${api_host}/settings/all`);
                if (response.data.status === "success") {
                    const data = response.data.data;
                    setPrivacy(data.privacy || "");
                    setTerms(data.terms || "");
                } else {
                    alert("Failed to fetch settings data.");
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                alert("An error occurred while fetching settings.");
            }
            setLoading(false);
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = get_session('user').access_token; // استبدل بـ التوكين الخاص بك
            const response = await axios.post(
                `${api_host}/admin/settings/update`,
                { privacy, terms },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.status) {
                alert_msg('System has been updated successfully');
            } else {
                alert("Error updating settings. Please try again.");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("An error occurred while updating settings.");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Terms Settings</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-100 mb-2" htmlFor="privacy">
                            Privacy Policy
                        </label>
                        <textarea
                            id="privacy"
                            className="w-full border rounded p-2 bg-black border-blue-900"
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            rows="5"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-100 mb-2" htmlFor="terms">
                            Terms and Conditions
                        </label>
                        <textarea
                            id="terms"
                            className="w-full border rounded p-2 bg-black border-blue-900"
                            value={terms}
                            onChange={(e) => setTerms(e.target.value)}
                            rows="5"
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
            )}
        </div>
    );
};

export default TermsSettings;
