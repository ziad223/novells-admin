import React, { useState, useEffect } from "react";
import axios from "axios";
import { get_session } from "@/public/script/public";

const SettingsPage = () => {
    const [formData, setFormData] = useState({
        vision: "",
        video: "",
        our_vision_image: null,
        our_vision_text1: "",
        our_vision_text2: "",
        our_mission_text1: "",
        our_mission_text2: "",
        management: [{ image: null, name: "", position: "" }],
    });

    const [isLoading, setIsLoading] = useState(false);

    // Get token from session
    const token = get_session("user").access_token;

    // Axios instance with token
    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Fetch settings data
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axiosInstance.get(
                    "https://webtoon.future-developers.cloud/api/admin/settings/all"
                );
                const data = response.data;
                setFormData({
                    vision: data.vision || "",
                    video: data.video || "",
                    our_vision_image: null,
                    our_vision_text1: data.our_vision_text1 || "",
                    our_vision_text2: data.our_vision_text2 || "",
                    our_mission_text1: data.our_mission_text1 || "",
                    our_mission_text2: data.our_mission_text2 || "",
                    management: data.management || [
                        { image: null, name: "", position: "" },
                    ],
                });
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchSettings();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle management change
    const handleManagementChange = (index, field, value) => {
        const updatedManagement = [...formData.management];
        updatedManagement[index][field] = value;
        setFormData({ ...formData, management: updatedManagement });
    };

    const addManagementField = () => {
        setFormData({
            ...formData,
            management: [...formData.management, { image: null, name: "", position: "" }],
        });
    };

    const removeManagementField = (index) => {
        setFormData({
            ...formData,
            management: formData.management.filter((_, i) => i !== index),
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const dataToSubmit = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "management") {
                // Convert management array to JSON string
                dataToSubmit.append(key, JSON.stringify(formData[key]));
            } else {
                dataToSubmit.append(key, formData[key]);
            }
        });

        try {
            const response = await axiosInstance.post(
                "https://webtoon.future-developers.cloud/api/admin/settings/update",
                dataToSubmit
            );
            console.log("Settings updated successfully:", response.data);
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Failed to update settings.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-2 bg-white dark:bg-[#0e1726]">
            <h6 className="text-lg font-bold mb-5 no-select">Settings</h6>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 home-form">
                        {/* Vision */}
                        <div>
                            <label htmlFor="vision" className="block mb-2">Vision (max 50 characters)</label>
                            <input
                                id="vision"
                                type="text"
                                name="vision"
                                value={formData.vision}
                                onChange={handleInputChange}
                                maxLength="50"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                required
                            />
                        </div>

                        {/* Video */}
                        <div>
                            <label htmlFor="video" className="block mb-2">Video URL</label>
                            <input
                                id="video"
                                type="url"
                                name="video"
                                value={formData.video}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                required
                            />
                        </div>

                        {/* Our Vision Image */}
                        <div>
                            <label htmlFor="our_vision_image" className="block mb-2">Our Vision Image</label>
                            <input
                                id="our_vision_image"
                                type="file"
                                name="our_vision_image"
                                onChange={(e) => setFormData({ ...formData, our_vision_image: e.target.files[0] })}
                                className="w-full p-2 bg-gray-700 rounded"
                            />
                        </div>

                        {/* Text fields */}
                        {["our_vision_text1", "our_vision_text2", "our_mission_text1", "our_mission_text2"].map(
                            (field, index) => (
                                <div key={index}>
                                    <label htmlFor={field} className="block mb-2">{field.replace(/_/g, " ")}</label>
                                    <input
                                        id={field}
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        maxLength="50"
                                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                        required
                                    />
                                </div>
                            )
                        )}

                        {/* Management */}
                        <div className="sm:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Management</h2>
                            {formData.management.map((manager, index) => (
                                <div key={index} className="mb-4 p-4 bg-gray-700 rounded space-y-2">
                                    <div>
                                        <label className="block mb-2">Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                handleManagementChange(index, "image", e.target.files[0])
                                            }
                                            className="w-full p-2 rounded bg-gray-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={manager.name}
                                            onChange={(e) =>
                                                handleManagementChange(index, "name", e.target.value)
                                            }
                                            className="w-full p-2 rounded bg-gray-600 border border-gray-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Position</label>
                                        <input
                                            type="text"
                                            value={manager.position}
                                            onChange={(e) =>
                                                handleManagementChange(index, "position", e.target.value)
                                            }
                                            className="w-full p-2 rounded bg-gray-600 border border-gray-500"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeManagementField(index)}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addManagementField}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Add Management
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="sm:col-span-2 mt-4 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className={`px-6 py-2 bg-green-600 text-white rounded ${isLoading ? "opacity-50" : "hover:bg-green-700"}`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save Settings"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SettingsPage;
