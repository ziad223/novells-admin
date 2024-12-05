"use client";
import {
  alert_msg,
  api,
  date,
  fix_date,
  print,
  get_session,
  confirm_deletion,
} from "@/public/script/public";
import Files from "@/app/component/files";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/app/component/loader";
import Image from "next/image";

export default function Form_comics({ id }) {

  const handleShow = (id) => {
    router.push(`/chapter/${id}`);  // توجيه المستخدم إلى صفحة التفاصيل
  };
  const router = useRouter();
  const config = useSelector((state) => state.config);
  const [menu, setMenu] = useState("");
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);
  const [chapters, setChapters] = useState([]);

  const default_item = async () => {
    setData({
      id: 0,
      name: "",
      status: true,
    });

    setLoader(false);
  };

  const get_item = async () => {
    const Id = id ? parseInt(id, 10) : null;
    const token = get_session("user")?.access_token;
    if (!token) {
      setLoader(false);
      return alert_msg("Authorization token is missing", "error");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // إضافة Content-Type
    };

    await fetch(
      `https://webtoon.future-developers.cloud/api/admin/comics/show/${Id}`,
      {
        headers: headers,
        method: "GET",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        // if (!response.data?.id) return router.replace("/comics");        
        setData(response.data);
        setChapters(response.data.chapters)
        setLoader(false);
        document.title = `${config.text.edit_comics} | ${
          response.data.title || ""
        }`;
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };
  



  const delete_item = async () => {
    const Id = {
      id: [id]
    }
  try {
      const response = await fetch(
        `https://webtoon.future-developers.cloud/api/admin/comics/chapter/delete`,
        {
          method: "POST",
          body: JSON.stringify(Id),
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
      router.replace('/comics')
      setLoader(false)
      return true; // Return true to indicate success
    } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      return false; // Return false to indicate failure
    }
  };

  const close_item = async () => {
    return router.replace("/comics");
  };
  useEffect(() => {
    setMenu(localStorage.getItem("menu"));
    id ? get_item() : default_item();
  }, []);


  return (
    <div className="edit-item-info relative">
      {loader ? (
        <Loader bg />
      ) : (
       <>
            <div className="flex flex-col gap-2.5 xl:flex-row ">
              <div className="flex flex-1 flex-col xl:w-[70%] ">
                <div className="panel no-select flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
                  <div className="px-4">
                    <div className="mx-auto flex flex-col justify-between ">
                     

                      <div className="div-3 w-full ">
                        <Image src={data?.comic?.vertical_thumbnail} className="mx-auto block" width={300} height={300} alt="comic vertical_thumbnail" />

                      </div>
                      <div className="div-3 w-full mt-5  ">
                        <div className="flex items-center">
                          <label
                            htmlFor="name"
                            className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                          >
                            {config.text.title}
                          </label>
                          <input
                          readOnly
                            id="title"
                            type="text"
                            value={data?.comic?.title || ""}
                            onChange={(e) =>
                              setData({ ...data, title: e.target.value })
                            }
                            className="form-input flex-1"
                            autoComplete="off"
                          />
                        </div>

                      </div>
                      <div className="div-3 w-full mt-5  ">
                        <div className="flex items-center">
                          <label
                            htmlFor="summary"
                            className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                          >
                            Summary
                          </label>
                          <input
                            readOnly
                            id="summary"
                            type="text"
                            value={data?.comic?.summary || ""}
                            onChange={(e) =>
                              setData({ ...data, summary: e.target.value })
                            }
                            className="form-input flex-1"
                            autoComplete="off"
                          />
                        </div>

                      </div>
                      <div className="div-3 w-full mt-5  ">
                        <div className="flex items-center">
                          <label
                            htmlFor="day"
                            className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                          >
                            Day
                          </label>
                          <input
                            id="day"
                            type="text"
                            value={data?.comic?.day || ""}
                            onChange={(e) =>
                              setData({ ...data, day: e.target.value })
                            }
                            className="form-input flex-1"
                            autoComplete="off"
                          />
                        </div>

                      </div>
                      <div className="div-3 w-full mt-5  ">
                        <div className="flex items-center">
                          <label
                            htmlFor="likes"
                            className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                          >
                            Likes
                          </label>
                          <input
                            readOnly
                            id="likes"
                            type="text"
                            value={data?.comic?.likes || ""}
                            onChange={(e) =>
                              setData({ ...data, likes: e.target.value })
                            }
                            className="form-input flex-1"
                            autoComplete="off"
                          />
                        </div>

                      </div>
                      <div className="div-3 w-full mt-5  ">
                        <div className="flex items-center">
                          <label
                            htmlFor="views"
                            className="mb-0 w-1/3 ltr:mr-2 ltr:pl-8 rtl:ml-2 rtl:pr-8"
                          >
                            Views
                          </label>
                          <input
                            readOnly
                            id="views"
                            type="text"
                            value={data?.comic?.views || ""}
                            onChange={(e) =>
                              setData({ ...data, views: e.target.value })
                            }
                            className="form-input flex-1"
                            autoComplete="off"
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>

             

            </div>
            <div className="overflow-x-auto mt-5 rounded-lg shadow-lg">
              <table className="table-auto w-full border-collapse bg-[#0e1726] text-white">
                <thead>
                  <tr className="bg-gray-700 text-gray-100">
                    <th className="px-6 py-3 text-center font-medium capitalize">ID</th>
                    <th className="px-6 py-3 text-center font-medium capitalize">image</th>
                    <th className="px-6 py-3 text-center font-medium capitalize">Title</th>
                    <th className="px-6 py-3 text-center font-medium capitalize">likes</th>
                    <th className="px-6 py-3 text-center font-medium capitalize">actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter, index) => (
                    <tr
                      key={chapter.id}
                      className={`text-center ${index % 2 === 0 ? "bg-[#1c2534]" : "bg-[#0e1726]"
                        }`}
                    >
                      <td className="px-6 py-4 text-center font-light capitalize">{chapter.id}</td>
                      <td className="px-6 py-4">
                        <Image
                          src={chapter.thumbnail}
                          alt={chapter.title}
                          width={50}
                          height={70}
                          className="mx-auto rounded-md shadow-md"
                        />
                      </td>
                      <td className="px-6 py-4 text-center font-light capitalize">{chapter.title}</td>

                      <td className="px-6 py-4 text-center font-light capitalize">
                        {chapter.likes_count}
                        </td>
                        <td className="flex justify-center gap-5">
                        <button 
                          onClick={() => handleShow(chapter.id)} 
                          className="border border-blue-500 text-blue-500 font-medium px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition duration-300">
                          Show
                        </button>
                        <button
                        onClick={delete_item}
                        className="border border-red-500 text-red-500 font-medium px-4 py-2 rounded hover:bg-red-500 hover:text-white transition duration-300">
                          Delete
                        </button>

                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className={`left-tab no-select mt-6 w-full xl:mt-0 xl:w-[30%] ${menu === "vertical" ? "" : "space"
                }`}
            >
              <div>


              

              </div>
              
            </div>
            <div className="panel mt-5">
              <div className="flex  gap-4">
                <button
                  type="button"
                  className="pointer btn btn-warning flex-1 gap-2"
                  onClick={close_item}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                  >
                    <path
                      d="M12 7V13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                    <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
                    <path
                      opacity="0.5"
                      d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                  <span>{config.text.cancel}</span>
                </button>

                {id && (
                  <button
                    type="button"
                    className="pointer btn btn-danger flex-1 gap-2"
                    onClick={delete_item}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ltr:mr-2 rtl:ml-2"
                    >
                      <path
                        opacity="0.5"
                        d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M20.5001 6H3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        opacity="0.5"
                        d="M9.5 11L10 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                      <path
                        opacity="0.5"
                        d="M14.5 11L14 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                    <span>{config.text.delete}</span>
                  </button>
                )}
              </div>
            </div>
       </>
      )}
    </div>
  );
}
