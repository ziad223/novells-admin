import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import axios from 'axios';

const Editor = ({ value, onChange }) => {
    const editorRef = useRef(null);
    const [editorInstance, setEditorInstance] = useState(null);

    useEffect(() => {
        if (!editorInstance && editorRef.current) {
            const newEditorInstance = new EditorJS({
                holder: editorRef.current,
                data: value,
                placeholder: 'Start typing here...',
                onChange: async () => {
                    const savedData = await newEditorInstance.save();
                    onChange(savedData); // Update the value when editor content changes
                },
            });

            setEditorInstance(newEditorInstance);
        }

        return () => {
            if (editorInstance) {
                editorInstance.isReady
                    .then(() => {
                        editorInstance.destroy(); // Cleanup the editor instance when unmounting
                        setEditorInstance(null);
                    })
                    .catch((error) => console.error('Error during editor cleanup:', error));
            }
        };
    }, [editorInstance, value, onChange]);

    return (
        <div
            ref={editorRef}
            style={{
                border: '1px solid #ddd',
                padding: '10px',
                minHeight: '200px',
                width: '100%',
            }}
        />
    );
};

const TermsSettings = () => {
    const [data, setData] = useState({
        message1: {},
        message2: {},
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post('https://webtoon.future-developers.cloud/api/admin/settings/update', {
                message1: data.message1,
                message2: data.message2,
            });

            if (response.status === 200) {
                setSuccess('Data updated successfully!');
            }
        } catch (err) {
            setError('There was an error while updating.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative switch">
            <div>
                <label htmlFor="editor1">Message 1</label>
                <Editor
                    value={data.message1}
                    onChange={(value) => setData({ ...data, message1: value })}
                />
            </div>

            <div className="my-5">
                <label htmlFor="editor2">Message 2</label>
                <Editor
                    value={data.message2}
                    onChange={(value) => setData({ ...data, message2: value })}
                />
            </div>

            <div className="my-5">
                {/* زر حفظ التعديلات */}
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* عرض رسائل النجاح أو الفشل */}
            {success && <p className="text-green-500">{success}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default TermsSettings;
