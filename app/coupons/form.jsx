"use client";
import { fix_date, fix_number, date } from '@/public/script/public';
import { Dialog, Transition } from '@headlessui/react';
import Loader from '@/app/component/loader';
import { Fragment, useState } from 'react';

export default function Form_Coupon ({ config, data, formData , handleChange ,  setData, save, model, setModel, loader }) {

    return (

        <Transition appear show={model} as={Fragment}>

            <Dialog as="div" open={model} onClose={() => setModel(false)} className="relative z-50">

                <div className="fixed inset-0 overflow-y-auto bg-[black]/60">

                    <div className="flex min-h-full items-center justify-center px-4 py-8 edit-item-info">

                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                           
                            <Dialog.Panel className="relative panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                
                                <button type="button" onClick={() => setModel(false)} className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600">
                                    
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>

                                </button>

                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    
                                    {formData.id ? config.text.edit_coupon : config.text.add_coupon}

                                </div>

                                <form className="p-5 mt-2">

                                    <div className='flex justify-between lg:flex-row flex-col'>

                                        <div className='w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6'>
                                            <label htmlFor="code" className='text-[.95rem] tracking-wide'>{config.text.code}</label>
                                            <input id="code" name = 'code' type="text" className="form-input mt-1" value={formData.code} onChange={handleChange} autoComplete='off'/>
                                        </div>
                                        

                                        <div className='w-full mb-6'>
                                            <label htmlFor="quantity" className='text-[.95rem] tracking-wide'>{config.text.quantity}</label>
                                            <input id="quantity" name = 'quantity' type="number" min="0" className="form-input mt-1"  value={formData.quantity} onChange={handleChange}/>
                                        </div>
                                       

                                    </div>
                                    
                                      <div className='w-full mb-6'>
                                            <label htmlFor="discount" className='text-[.95rem] tracking-wide'>{config.text.discount} %</label>
                                            <input id="discount" name='discount' type="number" min="0" className="form-input mt-1 text-gray-100" value={formData.discount} onChange={handleChange}/>
                                        </div>
                                    <div className='flex justify-between lg:flex-row flex-col mb-4'>

                                        <div className='w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-6'>
                                            <label htmlFor="expires_at" className='text-[.95rem] tracking-wide'>{config.text.date}</label>
                                            <input id="expires_at" name='expires_at' type="date" className="form-input mt-1 default" value={formData.expires_at.split('T')[0]} onChange={handleChange}/>
                                        </div>

                                        <div className='w-full mb-6'>
                                            <label htmlFor="description" className='text-[.95rem] tracking-wide'>{config.text.description}</label>
                                            <input id="description" name = 'description' type="text"  className="form-input mt-1 default" value={formData.description} onChange={handleChange}/>
                                        </div>
                                        
                                    </div>

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative" htmlFor="status" >
                                            
                                              <input
                                                   onChange={(e) => handleChange(e)}  // Make sure handleChange handles the 'checked' value correctly
                                                   name="status"
                                                   checked={!!formData.status}  // Convert status to a boolean value using !! to avoid undefined issues
                                                   id="status"
                                                   type="checkbox"
                                                   className="absolute w-full h-full opacity-0 z-10 pointer peer"
                                                 />

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="status" className="ltr:pl-3 rtl:pr-3 pointer">{config.text.active}</label>

                                    </div>
                    
                                    <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mt-9"/>

                                    <div className="mt-6 mb-1 flex items-center justify-end">

                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModel(false)}>
                                            {config.text.cancel}
                                        </button>

                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={save}>
                                            {formData.id ? config.text.update : config.text.submit}
                                        </button>

                                    </div>

                                </form>

                                { loader && <Loader /> }

                            </Dialog.Panel>

                        </Transition.Child>

                    </div>

                </div>

            </Dialog>

        </Transition>

    );

};
