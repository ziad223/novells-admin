'use client'
import React, { useState } from "react";

const page = () => {
    // States for managing story and episodes
    const [storyTitle, setStoryTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [episodes, setEpisodes] = useState([]);

    // Function to add a new episode
    const addEpisode = () => {
        setEpisodes([...episodes, { title: "", date: "", status: "Scheduled" }]);
    };

    // Function to update episode title
    const updateEpisodeTitle = (index, newTitle) => {
        const updatedEpisodes = [...episodes];
        updatedEpisodes[index].title = newTitle;
        setEpisodes(updatedEpisodes);
    };

    // UI structure
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Page Title */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-semibold text-blue-600">Comic Story Management</h1>
                <p className="text-lg text-gray-600">Add, Manage, and Review Comic Stories & Episodes</p>
            </div>

            {/* Add New Story Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Story</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-600">Title</label>
                        <input
                            type="text"
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                            className="mt-2 p-3 w-full bg-gray-50 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600">Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-2 p-3 w-full bg-gray-50 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-2 p-3 w-full bg-gray-50 border border-gray-300 rounded-lg"
                            rows="4"
                        ></textarea>
                    </div>
                    <button className="bg-blue-600 text-white p-3 rounded-lg w-full">Add Story</button>
                </form>
            </div>

            {/* Manage Episodes Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Manage Episodes</h2>
                <button
                    onClick={addEpisode}
                    className="bg-green-600 text-white p-3 rounded-lg mb-4"
                >
                    Add New Episode
                </button>
                {episodes.length === 0 ? (
                    <p className="text-gray-600">No episodes available.</p>
                ) : (
                    <div>
                        {episodes.map((episode, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
                            >
                                <div className="flex justify-between items-center">
                                    <input
                                        type="text"
                                        value={episode.title}
                                        onChange={(e) => updateEpisodeTitle(index, e.target.value)}
                                        className="p-2 bg-white border border-gray-300 rounded-lg w-full"
                                        placeholder="Episode Title"
                                    />
                                    <button className="bg-red-600 text-white p-2 ml-4 rounded-lg">Delete</button>
                                </div>
                                <div className="mt-2 text-gray-600">Date: {episode.date || "Not Set"}</div>
                                <div className="mt-2 text-gray-600">Status: {episode.status}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Review Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Content Review</h2>
                <div className="text-gray-600">Review submitted stories and episodes before publishing.</div>
                {/* You can add a table or list to display submitted content here */}
            </div>

            {/* Story Stats Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Story Statistics</h2>
                <div className="text-gray-600">Views: 120</div>
                <div className="text-gray-600">Likes: 50</div>
                <div className="text-gray-600">Comments: 10</div>
                {/* Add dynamic stats depending on your data */}
            </div>
        </div>
    );
};

export default page;
