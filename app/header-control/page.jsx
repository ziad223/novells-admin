'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { get_session, api_host } from '@/public/script/public';
import upload from '../../public/upload.png';
import Image from 'next/image';

const HeaderLogoAndBackground = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [headerLogo, setHeaderLogo] = useState(null);
  const [headerBackground, setHeaderBackground] = useState(null);

  const token = get_session('user')?.access_token;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${api_host}/admin/settings/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const logoFileName = response.data?.data?.header_logo || null;
        setHeaderLogo(logoFileName);
        const logoUrl = logoFileName ? `${api_host}/storage/${logoFileName}` : null;

        const backgroundFileName = response.data?.data?.header_background || null;
        const backgroundUrl = backgroundFileName ? `${api_host}/storage/${backgroundFileName}` : null;

        setCurrentLogo(logoUrl); // رابط الصورة الحالية
        setCurrentBackground(backgroundUrl); // رابط الصورة الحالية
        setLogoPreview(logoUrl); // تحديث معاينة اللوجو
        setBackgroundPreview(backgroundUrl); // تحديث معاينة الخلفية
        setHeaderBackground(backgroundFileName); // حفظ اسم الصورة
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      header_logo: null,
      header_background: null,
    },
    validationSchema: Yup.object({
      header_logo: Yup.mixed()
        .test(
          'fileFormat',
          'Unsupported format. Please upload a PNG or JPG image.',
          (value) => !value || ['image/png', 'image/jpeg'].includes(value?.type)
        ),
      header_background: Yup.mixed()
        .test(
          'fileFormat',
          'Unsupported format. Please upload a PNG or JPG image.',
          (value) => !value || ['image/png', 'image/jpeg'].includes(value?.type)
        ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();

      let updateLogo = false;
      let updateBackground = false;

      if (values.header_logo) {
        formData.append('header_logo', values.header_logo);
        updateLogo = true;
      }

      if (values.header_background) {
        formData.append('header_background', values.header_background);
        updateBackground = true;
      }

      if (!updateLogo && !updateBackground) {
        alert('No changes detected!');
        return;
      }

      try {
        await axios.post(`${api_host}/admin/settings/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Settings updated successfully');
        setLogoPreview(null);
        setBackgroundPreview(null);

        const updatedSettings = await axios.get(`${api_host}/admin/settings/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedLogo = updatedSettings.data?.data?.header_logo || null;
        const updatedLogoUrl = updatedLogo ? `${api_host}/storage/${updatedLogo}` : null;

        const updatedBackground = updatedSettings.data?.data?.header_background || null;
        const updatedBackgroundUrl = updatedBackground ? `${api_host}/storage/${updatedBackground}` : null;

        if (updateLogo) {
          setCurrentLogo(updatedLogoUrl);
        }
        if (updateBackground) {
          setCurrentBackground(updatedBackgroundUrl);
        }
      } catch (error) {
        console.error('Error updating settings:', error);
        alert('An error occurred while updating settings');
      }
    },
  });

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      if (field === 'header_logo') {
        setLogoPreview(URL.createObjectURL(file));
        formik.setFieldValue('header_logo', file);
      } else if (field === 'header_background') {
        setBackgroundPreview(URL.createObjectURL(file));
        formik.setFieldValue('header_background', file);
      }
    }
  };

  return (
    <div className="p-4 bg-[#0e1726] rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Update Header Logo and Background</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <label className="block text-white text-lg capitalize tracking-wider">
          Upload Header Logo
        </label>
        <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileChange(e, 'header_logo')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Image
            src={headerLogo || currentLogo || upload}
            alt="logo preview"
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
        {formik.errors.header_logo && formik.touched.header_logo && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.header_logo}</p>
        )}

        <label className="block text-white text-lg capitalize tracking-wider">
          Upload Header Background
        </label>
        <div className="relative w-full h-40 border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileChange(e, 'header_background')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Image
            src={headerBackground || currentBackground || upload}
            alt="background preview"
            width={800}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
        {formik.errors.header_background && formik.touched.header_background && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.header_background}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default HeaderLogoAndBackground;
