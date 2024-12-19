"use client";
import { api, alert_msg, capitalize, get_session } from '@/public/script/public';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/app/component/loader';

export default function Settings () {

    const config = useSelector((state) => state.config);
    const [data, setData] = useState({});
    const [loader1, setLoader1] = useState(false);
    const [loader3, setLoader3] = useState(false);
    const [deleted, setDeleted] = useState([]);

    const get_data = async() => {
        const token = get_session("user")?.access_token; 
        const response = await api('admin/settings/all', null, 'GET', token); 
        setData(response.settings || {});
    };
    
    const save_data = async() => {
        const token = get_session("user")?.access_token; 

        setLoader1(true);
        const response = await api('admin/settings/update', null, 'POST',  token);
        if ( response.status ) alert_msg('System has been modified successfully');
        else alert_msg('Error, something is went wrong !', 'error');
        setLoader1(false);

    }
    const save_config = async( _data_ ) => {

        setData(_data_);
        setLoader2(true);
        const response = await api('setting/option', {..._data_, token: config.user.token});
        if ( response.status ) alert_msg('System has been modified successfully');
        else alert_msg('Error, something is went wrong !', 'error');
        setLoader2(false);

    }
    const delete_item = async( item ) => {

        if ( !confirm(`Are you sure to delete ${capitalize(item)} from system ?`) ) return;
        setLoader3(true);
        const response = await api('setting/delete', {item: item, token: config.user.token});
        if ( response.status ) alert_msg(`${capitalize(item)} has been deleted successfully`);
        else alert_msg('Error, something is went wrong !', 'error');
        setLoader3(false);

    }
    useEffect(() => {
        
        document.title = "Settings";
        get_data();

        setDeleted([
            'mails', 'chats', 'reports', 'categories', 'auctions',
            'products', 'bookings', 'contacts', 'blogs',
            'supervisors', 'admins', 'clients',
        ]);

    }, []);

    return (

        <div className='settings relative h-full mt-[-.5rem]'>
            <div className='relative w-full'>
           
                    <div className="relative border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-2 bg-white dark:bg-[#0e1726]">

                        <h6 className="text-lg font-bold mb-5 no-select">{config.text.general_information}</h6>

                        <div className="flex flex-col sm:flex-row">

                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 home-form">

                                <div>
                                    <label htmlFor="name">{config.text.site_name}</label>
                                    <input id="name" type="text" value={data.name || ''} onChange={(e) => setData({...data, name: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                                <div>
                                    <label htmlFor="phone">{config.text.phone}</label>
                                    <input id="phone" type="text" value={data.phone || ''} onChange={(e) => setData({...data, phone: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                            <div>
                                <label htmlFor="about">About</label>
                                <input id="about" type="text" value={data.about || ''} onChange={(e) => setData({ ...data, about: e.target.value })} className="form-input" autoComplete="off" />
                            </div>
                                <div>
                                    <label htmlFor="email">{config.text.email}</label>
                                    <input id="email" type="text" value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                                <div>
                                    <label htmlFor="facebook">{config.text.facebook}</label>
                                    <input id="facebook" type="text" value={data.facebook || ''} onChange={(e) => setData({...data, facebook: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="whatsapp">{config.text.whatsapp}</label>
                                        <input id="whatsapp" type="text" value={data.whatsapp || ''} onChange={(e) => setData({...data, whatsapp: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="telegram">{config.text.telegram}</label>
                                        <input id="telegram" type="text" value={data.telegram || ''} onChange={(e) => setData({...data, telegram: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                </div>
                            <div>
                                <label htmlFor="privacy">privacy</label>
                                <input id="privacy" type="text" value={data.privacy || ''} onChange={(e) => setData({ ...data, privacy: e.target.value })} className="form-input" autoComplete="off" />
                            </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="youtube">{config.text.youtube}</label>
                                        <input id="youtube" type="text" value={data.youtube || ''} onChange={(e) => setData({...data, youtube: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                    <div>
                                        <label htmlFor="twitter">{config.text.twitter}</label>
                                        <input id="twitter" type="text" value={data.twitter || ''} onChange={(e) => setData({...data, twitter: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 mt-0 mb-3 buttons-actions flex justify-end">
                                    <button type="button" onClick={save_data} className="btn btn-primary save-data w-[8rem] tracking-wide text-[.9rem]">{config.text.save}</button>
                                </div>
                                
                            </div>

                        </div>

                        { loader1 && <Loader /> }

                    </div>
            </div>

        </div>

    );

};
