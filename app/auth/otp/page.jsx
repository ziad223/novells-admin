'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']); // مصفوفة لتخزين القيم
    const sessionId = sessionStorage.getItem("session_id"); // الحصول على session_id

    const handleChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const code = otp.join('');
        const numericCode = Number(code); // تحويل الكود إلى رقم
        console.log(numericCode);

        try {
            const response = await axios.post('https://webtoon.future-developers.cloud/api/auth/forget-password/check', {
                code: numericCode, // أرسل الرقم بدلاً من السلسلة
                session_id: sessionId,
            });
            console.log(response.data);
            router.replace('/auth/reset-password');
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };

    const handleResend = async () => {
        try {
            const response = await axios.post('https://webtoon.future-developers.cloud/api/auth/resend-code', {
                session_id: sessionId,
            });
            console.log('Resend response:', response.data);
            alert('Verification code resent successfully!');
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md mx-auto text-center px-4 bg-[#0e1726] sm:px-8 py-10 rounded-xl shadow">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
                    <p className="text-[15px] text-slate-500">Enter the 4-digit verification code that was sent to your phone number.</p>
                </header>
                <form id="otp-form" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-center gap-3">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                className="w-14 h-14 text-center text-2xl font-extrabold text-gray-300 bg-slate-800 border border-transparent appearance-none rounded p-4 outline-none"
                                pattern="\d*"
                                maxLength="1"
                                value={value}
                                onChange={(e) => handleChange(index, e.target.value)}
                            />
                        ))}
                    </div>
                    <div className="max-w-[260px] mx-auto mt-4">
                        <button type="submit" className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">
                            Verify Account
                        </button>
                    </div>
                </form>
                <div className="text-sm text-slate-500 mt-4">
                    Didn't receive code?
                    <a className="font-medium text-indigo-500 hover:text-indigo-600 cursor-pointer" onClick={handleResend}>
                        Resend
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Page;
