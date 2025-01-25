import React, { useState, useEffect } from "react";
import axios from "axios";
import { get_session, api_host } from "@/public/script/public";

const AboutSettingTwo = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = get_session("user").access_token;
                const response = await axios.get(`${api_host}/admin/settings/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSettings(response.data);
            } catch (err) {
                setError("Failed to fetch settings.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Handle form submission for updating settings
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = get_session("user").access_token;
            await axios.post(
                `${api_host}/admin/settings/update`,
                settings,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Settings updated successfully!");
        } catch (err) {
            alert("Failed to update settings.");
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-transparent rounded-lg mt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="make_money_title">
                        Make Money Title
                    </label>
                    <input
                        type="text"
                        id="make_money_title"
                        name="make_money_title"
                        value={settings.make_money_title || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="make_money_link">
                        Make Money Link
                    </label>
                    <input
                        type="url"
                        id="make_money_link"
                        name="make_money_link"
                        value={settings.make_money_link || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="publish_story_title">
                        Publish Story Title
                    </label>
                    <input
                        type="text"
                        id="publish_story_title"
                        name="publish_story_title"
                        value={settings.publish_story_title || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="publish_story_link">
                        Publish Story Link
                    </label>
                    <input
                        type="url"
                        id="publish_story_link"
                        name="publish_story_link"
                        value={settings.publish_story_link || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="contact_title">
                        Contact Title
                    </label>
                    <input
                        type="text"
                        id="contact_title"
                        name="contact_title"
                        value={settings.contact_title || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="contact_content">
                        Contact Content
                    </label>
                    <textarea
                        id="contact_content"
                        name="contact_content"
                        value={settings.contact_content || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="about_title">
                        About Title
                    </label>
                    <input
                        type="text"
                        id="about_title"
                        name="about_title"
                        value={settings.about_title || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-500 font-medium mb-2" htmlFor="about_content">
                        About Content
                    </label>
                    <textarea
                        id="about_content"
                        name="about_content"
                        value={settings.about_content || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700  rounded-lg outline-none"
                    />
                </div>

              
            </form>
        </div>
    );
};

export default AboutSettingTwo;
