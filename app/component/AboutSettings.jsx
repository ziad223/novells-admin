import React, { useEffect, useState } from "react";
import axios from "axios";
import { get_session, api_host , alert_msg } from "@/public/script/public";

const AboutSettings = () => {
    const [settings, setSettings] = useState({
        vision: "",
        video: "",
        our_vision_image: null,
        our_vision_text1: "",
        our_vision_text2: "",
        our_mission_text1: "",
        our_mission_text2: "",
        make_money_link: "",
        make_money_button: "",
        publish_story_title: "",
        publish_story_link: "",
        publish_story_button: "", 
        contact_title: "",
        about_title: "",
        about_content_one: "",
        about_content_two: "",
        about_content_three: "",
        about_content_four: "",
        contact_content_one: "",
        contact_content_two: "",
        contact_content_three: "",
        contact_content_four: "",
    });

    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState({});
    const token = get_session("user")?.access_token;

    useEffect(() => {
        axios
            .get(`${api_host}/admin/settings/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data.status === "success") {
                    const data = response.data.data;
                    const filteredSettings = {
                        vision: data.vision || "",
                        video: data.video || "",
                        our_vision_image: data.our_vision_image || null,
                        our_vision_text1: data.our_vision_text1 || "",
                        our_vision_text2: data.our_vision_text2 || "",
                        our_mission_text1: data.our_mission_text1 || "",
                        our_mission_text2: data.our_mission_text2 || "",
                        make_money_link: data.make_money_link || "",
                        make_money_button: data.make_money_button || "", // تحميل ديناميكي
                        publish_story_title: data.publish_story_title || "",
                        publish_story_link: data.publish_story_link || "",
                        publish_story_button: data.publish_story_button || "", // تحميل ديناميكي
                        contact_title: data.contact_title || "",
                        about_title: data.about_title || "",
                        about_content_one: data.about_content_one || "",
                        about_content_two: data.about_content_two || "",
                        about_content_three: data.about_content_three || "",
                        about_content_four: data.about_content_four || "",
                        contact_content_one: data.contact_content_one || "",
                        contact_content_two: data.contact_content_two || "",
                        contact_content_three: data.contact_content_three || "",
                        contact_content_four: data.contact_content_four || "",
                    };
                    setSettings(filteredSettings);

                }
            })
            .catch((error) => {
                console.error("Error fetching settings", error);
            })
            .finally(() => setLoading(false));
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        setSettings((prevState) => ({
            ...prevState,
            [name]: file,
        }));
        if (file) {
            setImagePreview((prev) => ({
                ...prev,
                [name]: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (settings.video && !isValidURL(settings.video)) {
            alert("Please enter a valid URL for the video field.");
            return;
        }

        const formData = new FormData();

        Object.entries(settings).forEach(([key, value]) => {
            if (key === "management") {
                value.forEach((member, index) => {
                    formData.append(`management[${index}][name]`, member.name);
                    formData.append(`management[${index}][position]`, member.position);
                    if (member.image) {
                        formData.append(`management[${index}][image]`, member.image);
                    }
                });
            } else {
                formData.append(key, value);
            }
        });

        axios
            .post(`${api_host}/admin/settings/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data.status === "success") {
               alert_msg('Settings updated successfully');

                }
            })
            .catch((error) => {
                console.error("Error updating settings", error);
            });
    };

    const isValidURL = (url) => {
        const regex = /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/\S*)?$/;
        return regex.test(url);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-[#0e1726] rounded-lg shadow-md text-white">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {Object.keys(settings).map((key) => {
                        if (key === "our_vision_image") {
                            return (
                                <div key={key}>
                                    <label className="block text-gray-300 capitalize">
                                        {key.replace(/_/g, " ")}
                                    </label>
                                    <div
                                        className="mt-1 w-32 h-32 bg-[#121e32] border border-gray-600 rounded-md flex items-center justify-center cursor-pointer overflow-hidden"
                                        onClick={() => document.getElementById("our_vision_image_input").click()}
                                    >
                                        {imagePreview[key] ? (
                                            <img
                                                src={imagePreview[key]}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-400">Choose Image</span>
                                        )}
                                    </div>
                                    <input
                                        id="our_vision_image_input"
                                        type="file"
                                        name={key}
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            );
                        } else if (key === "video") {
                            return (
                                <div key={key}>
                                    <label className="block text-gray-300 capitalize">
                                        {key.replace(/_/g, " ")}
                                    </label>
                                    <input
                                        type="url"
                                        name={key}
                                        value={settings[key]}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 bg-[#121e32] border border-gray-600 rounded-md text-white"
                                        placeholder="Enter a valid URL"
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <div key={key}>
                                    <label className="block text-gray-300 capitalize">
                                        {key.replace(/_/g, " ")}
                                    </label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={settings[key]}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full p-2 bg-[#121e32] border border-gray-600 rounded-md text-white"
                                    />
                                </div>
                            );
                        }
                    })}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AboutSettings;
