'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { get_session, api_host } from '@/public/script/public';
import upload from '../../public/upload.png';
import Image from 'next/image';

const FooterSettings = () => {
  const [logoPreview, setLogoPreview] = useState(null); // للمراجعة الخاصة باللوغو
  const [bannerPreview, setBannerPreview] = useState(null); // للمراجعة الخاصة بصورة البانر
  const [currentLogo, setCurrentLogo] = useState(null);
  const [bannerData, setBannerData] = useState({
    footer_banner_test: '',
    footer_banner_button_text: '',
    footer_banner_link: '',
    footer_banner_img: '',
  });
  const [footerLogo, setFooterLogo] = useState(null); // للمراجعة الخاصة باللوغو
  const [footerBanner, setFooterBanner] = useState(null); // للمراجعة الخاصة باللوغو
  

  const token = get_session('user')?.access_token;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${api_host}/admin/settings/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data?.data || {};
       
        setFooterLogo(response.data?.data.footer_logo);
        setFooterBanner(response.data?.data.footer_banner_img);
        // Set current logo and banner data
        const logoUrl = data.footer_logo ? `${api_host}/storage/${data.footer_logo}` : null;
        setCurrentLogo(logoUrl);
        setLogoPreview(logoUrl); // تعيين المعاينة للوغو
        setBannerData({
          footer_banner_test: data.footer_banner_test || '',
          footer_banner_button_text: data.footer_banner_button_text || '',
          footer_banner_link: data.footer_banner_link || '',
          footer_banner_img: data.footer_banner_img || '',
        });
        setBannerPreview(data.footer_banner_img ? `${api_host}/storage/${data.footer_banner_img}` : null); // تعيين المعاينة للبانر
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      footer_logo: null,
      ...bannerData,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      footer_logo: Yup.mixed()
        .test(
          'fileFormat',
          'Unsupported format. Please upload a PNG or JPG image.',
          (value) => !value || ['image/png', 'image/jpeg'].includes(value?.type)
        ),
      footer_banner_test: Yup.string().required('This field is required'),
      footer_banner_button_text: Yup.string().required('This field is required'),
      footer_banner_link: Yup.string().url('Invalid URL').required('This field is required'),
      footer_banner_img: Yup.mixed()
        .test(
          'fileFormat',
          'Unsupported format. Please upload a PNG or JPG image.',
          (value) => !value || ['image/png', 'image/jpeg'].includes(value?.type)
        )
        .required('This field is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      if (values.footer_logo) formData.append('footer_logo', values.footer_logo);
      formData.append('footer_banner_test', values.footer_banner_test);
      formData.append('footer_banner_button_text', values.footer_banner_button_text);
      formData.append('footer_banner_link', values.footer_banner_link);
      formData.append('footer_banner_img', values.footer_banner_img);

      try {
        await axios.post(`${api_host}/admin/settings/update`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Footer settings updated successfully');
        setLogoPreview(null);
        setBannerPreview(null);
        const updatedResponse = await axios.get(`${api_host}/admin/settings/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedData = updatedResponse.data?.data || {};
        setCurrentLogo(updatedData.footer_logo ? `${api_host}/storage/${updatedData.footer_logo}` : null);
        setBannerData({
          footer_banner_test: updatedData.footer_banner_test || '',
          footer_banner_button_text: updatedData.footer_banner_button_text || '',
          footer_banner_link: updatedData.footer_banner_link || '',
          footer_banner_img: updatedData.footer_banner_img || '',
        });
      } catch (error) {
        console.error('Error updating footer settings:', error);
        alert('An error occurred while updating the settings');
      }
    },
  });

  const handleLogoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file)); // تحديث المعاينة للوغو
      formik.setFieldValue('footer_logo', file); // تعيين القيمة الجديدة للوغو
    }
  };

  const handleBannerImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file)); // تحديث المعاينة للبانر
      formik.setFieldValue('footer_banner_img', file); // تعيين القيمة الجديدة للبانر
    }
  };

  return (
    <div className="p-4 bg-[#0e1726] rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Update Footer Settings</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <label className="block text-white text-xs captalize tracking-wider">
          Upload  Footer Logo
          </label>
        {/* Footer Logo */}
        <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
          
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleLogoFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Image
            src={footerLogo || currentLogo || upload}
            alt="footer logo preview"
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Footer Banner Test */}
        <div>
          <label className="block text-white mb-1">Footer Banner Test</label>
          <input
            type="text"
            name="footer_banner_test"
            value={formik.values.footer_banner_test}
            onChange={formik.handleChange}
            className="w-full p-4 bg-[#121e32]  rounded-lg"
          />
          {formik.errors.footer_banner_test && formik.touched.footer_banner_test && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.footer_banner_test}
            </p>
          )}
        </div>

        {/* Footer Banner Button Text */}
        <div>
          <label className="block text-white mb-1">Footer Banner Button Text</label>
          <input
            type="text"
            name="footer_banner_button_text"
            value={formik.values.footer_banner_button_text}
            onChange={formik.handleChange}
            className="w-full p-4 bg-[#121e32]  rounded-lg"
          />
          {formik.errors.footer_banner_button_text && formik.touched.footer_banner_button_text && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.footer_banner_button_text}
            </p>
          )}
        </div>

        {/* Footer Banner Link */}
        <div>
          <label className="block text-white mb-1">Footer Banner Link</label>
          <input
            type="text"
            name="footer_banner_link"
            value={formik.values.footer_banner_link}
            onChange={formik.handleChange}
            className="w-full p-4 bg-[#121e32]  rounded-lg"
          />
          {formik.errors.footer_banner_link && formik.touched.footer_banner_link && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.footer_banner_link}
            </p>
          )}
        </div>

        {/* Footer Banner Image */}
         <label className="block text-white text-xs captalize tracking-wider">
          Upload  Footer Banner
          </label>
        <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleBannerImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Image
            src={footerBanner || (bannerData.footer_banner_img ? `${api_host}/storage/${bannerData.footer_banner_img}` : upload)}
            alt="footer banner image preview"
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
        {formik.errors.footer_banner_img && formik.touched.footer_banner_img && (
          <p className="text-red-500 text-sm mt-1">
            {formik.errors.footer_banner_img}
          </p>
        )}

        {/* Submit Button */}
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

export default FooterSettings;
