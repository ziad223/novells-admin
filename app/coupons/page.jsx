"use client";
import { api, date as dt, alert_msg, matching, fix_date, print, fix_number, get_session } from '@/public/script/public';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Table from "@/app/component/table";
import Form from "./form";

export default function Coupons () {

    const config = useSelector((state) => state.config);
    const [data, setData] = useState([]);
    const [coupon, setCoupon] = useState({});
    const [model, setModel] = useState(false);
    const [loader, setLoader] = useState(false);
    

    const columns = () => {
        
        return [
            {
                accessor: 'id', sortable: true, title: 'id',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>
            },
            {
                accessor: 'code', sortable: true, title: 'coupon',
                render: ({ code, id }) => (
                    <div className="flex items-center font-semibold default">
                        <div className="ltr:mr-2 rtl:ml-2">
                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" 
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 
                                    7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 
                                    7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 
                                    9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 
                                    10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 
                                    11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 
                                    11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 
                                    10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 
                                    9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 
                                    7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 
                                    7.02251Z" stroke="currentColor" strokeWidth="1.5">
                                </path>
                                <path d="M19 9C19 12.866 15.866 16 12 16C8.13401 16 5 12.866 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9Z" 
                                    stroke="currentColor" strokeWidth="1.5">
                                </path>
                                <path d="M12 16.0678L8.22855 19.9728C7.68843 20.5321 7.41837 20.8117 7.18967 20.9084C6.66852 21.1289 
                                    6.09042 20.9402 5.81628 20.4602C5.69597 20.2495 5.65848 19.8695 5.5835 19.1095C5.54117 18.6804 5.52 18.4658 
                                    5.45575 18.2861C5.31191 17.8838 5.00966 17.5708 4.6211 17.4219C4.44754 17.3554 4.24033 17.3335 3.82589 
                                    17.2896C3.09187 17.212 2.72486 17.1732 2.52138 17.0486C2.05772 16.7648 1.87548 16.1662 2.08843 15.6266C2.18188 
                                    15.3898 2.45194 15.1102 2.99206 14.5509L5.45575 12" stroke="currentColor" strokeWidth="1.5">
                                </path>
                                <path d="M12 16.0678L15.7715 19.9728C16.3116 20.5321 16.5816 20.8117 16.8103 20.9084C17.3315 21.1289 17.9096 
                                    20.9402 18.1837 20.4602C18.304 20.2495 18.3415 19.8695 18.4165 19.1095C18.4588 18.6804 18.48 18.4658 18.5442 
                                    18.2861C18.6881 17.8838 18.9903 17.5708 19.3789 17.4219C19.5525 17.3554 19.7597 17.3335 20.1741 17.2896C20.9081 
                                    17.212 21.2751 17.1732 21.4786 17.0486C21.9423 16.7648 22.1245 16.1662 21.9116 15.6266C21.8181 15.3898 21.5481 
                                    15.1102 21.0079 14.5509L18.5442 12" stroke="currentColor" strokeWidth="1.5">
                                </path>
                            </svg>
                        </div>
                        <div className="font-semibold select-text truncate max-w-[20rem]">{code}</div>
                    </div>
                ),
            },
            {
                accessor: 'discount', sortable: true, title: 'discount_',
                render: ({ discount, id }) => <div className="font-semibold select-text default">{fix_number(discount, true)}</div>
            },
            {
                accessor: 'quantity', sortable: true, title: 'quantity',
                render: ({ quantity, id }) => <div className="font-semibold select-text default">{fix_number(quantity)}</div>
            },
            {
                accessor: 'active', sortable: true, title: 'status',
                render: ({ status, id }) => <span className={`badge badge-outline-${status ? 'success' : 'danger'}`}>
                    {status ? config.text.active : config.text.stopped}
                </span>
            },
            {
                accessor: 'created_at', sortable: true, title: 'date',
                render: ({ created_at, id }) => <div className="font-semibold select-text default">{fix_date(created_at || dt())}</div>
            },
        ];

    }
    // const get = async() => {

    //     const response = await api('coupon');
    //     setData(response.coupons || []);
        

    // }
   const delete_ = async (payload) => {
  try {
    const response = await fetch(
      `https://sahl.future-developers.cloud/api/admin/coupon/delete`,
      {
        method: "DELETE",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          Authorization: `Bearer ${get_session("user")?.access_token}`, // Use the token in the header
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const result = await response.json();
    alert_msg(`${config.text.deleted_successfully}`);
    return true; // Return true to indicate success
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    return false; // Return false to indicate failure
  }
};
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.name, query) ||
            matching(item.discount, query) ||
            matching(item.uses, query) ||
            matching(item.created_at, query) ||
            matching(fix_date(item.created_at), query) ||
            matching(item.active ? config.text.active : config.text.stopped, query)
        );

        return result;

    }

     const get_item = async (id) => {
    const Id = Number(id);
    const token = get_session("user")?.access_token;
    if (!token) {
      setLoader(false);
      return alert_msg("Authorization token is missing", "error");
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await fetch(
        `https://sahl.future-developers.cloud/api/admin/coupon/show/${id}`,
        {
          headers: headers,
          method: "GET",
        }
      );
      if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
      const result = await response.json();
      setLoader(false);
      const coupon = result.data;
      console.log(coupon);
      setFormData(coupon)

      if (coupon?.id){
        setModel(true);
      };
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
    }
  };

    // const save_coupon = async() => {
    //     console.log(coupon);
        
    //     if ( !coupon.name ) return alert_msg(config.text.coupon_required, 'error');
        
    //     setLoader(true);
    //     const response = await api(`coupon/${coupon.id ? `${coupon.id}/update` : 'store'}`, coupon);
    //     setLoader(false);

    //     if ( response.errors?.name ) return alert_msg(config.text.error_coupon, 'error');
    //     if ( !response.status ) return alert_msg(config.text.alert_error, 'error');

    //     if ( coupon.id ) {
    //         let new_data = data.map(_ => _.id === coupon.id ? coupon : _);
    //         setData([...new_data]);
    //         setModel(false);
    //         alert_msg(`${config.text.item} ( ${coupon.id} ) - ${config.text.updated_successfully}`);
    //     }
    //     else {
    //         let new_data = data;
    //         new_data.unshift({...coupon, id: response.coupon?.id || 0});
    //         setData([...new_data]);
    //         setModel(false);
    //         alert_msg(config.text.new_item_added);
    //     }

    // }
    const [formData, setFormData] = useState({
    code: '',
    discount: '',
    description: '',
    quantity: '',
    status: 1,
    expires_at: ''
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const save_coupon = async () => {
    console.log(coupon);

    // تحقق من وجود اسم الكوبون
    if (!formData.code) return alert_msg(config.text.coupon_required, 'error');

    // تعيين حالة التحميل
    setLoader(true);

    // تحديد الرابط بناءً على ما إذا كان يتم إنشاء كوبون جديد أو تعديل كوبون موجود
    const endpoint = formData.id 
        ? `https://sahl.future-developers.cloud/api/admin/coupon/update/${formData.id}`
        : 'https://sahl.future-developers.cloud/api/admin/coupon/create';

    try {
        // إرسال الطلب باستخدام fetch
        const response = await fetch(endpoint, {
            method:'POST', // استخدام PUT للتحديث وPOST للإضافة
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${get_session("user")?.access_token}`,
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();


        // إيقاف حالة التحميل
        setLoader(false);

        // التحقق من وجود أخطاء
        if (data.errors?.code) return alert_msg(config.text.error_coupon, 'error');
        if (!data.status) return alert_msg(config.text.alert_error, 'error');

        if (formData.id) {
            // تحديث الكوبون في البيانات
            setModel(false);
            alert_msg(`${config.text.item} ( ${formData.code} ) - ${config.text.updated_successfully}`);
            
        } else {
            // إضافة الكوبون الجديد إلى البيانات
            setModel(false);
            alert_msg(config.text.new_item_added);
        }
        get()
    } catch (error) {
        // التعامل مع الأخطاء إذا حدثت
        setLoader(false);
        console.error('Error saving coupon:', error.message);
        alert_msg(config.text.alert_error, 'error');
    }
};

 const get = async () => {
    await fetch("https://sahl.future-developers.cloud/api/admin/coupon/all",  {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
        Authorization: `Bearer ${get_session("user")?.access_token}`, // Use the token in the header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        const product = response.data;
        setData(product);
        console.log(response.data);
        
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };
    useEffect(() => {

        document.title = config.text.all_coupons || '';
        get();

    }, []);

    return (

        <Fragment>

            <Table 
                columns={columns} data={data} delete_={delete_} search={search} async_search={false} 
                no_delete={!data.length} no_search={!data.length} btn_name="add_coupon"
                add={() => { setCoupon({active: true, discount: 0}); setModel(true); setLoader(false); }} 
                edit={(id) => { get_item(id);setModel(true); setLoader(false); }} 
            />

            <Form config={config}  formData = {formData} handleChange = {handleChange} data={coupon} setData={setCoupon} save={save_coupon} model={model} setModel={setModel} loader={loader}/>

        </Fragment>

    );

};
