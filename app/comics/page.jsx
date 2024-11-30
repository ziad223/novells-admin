"use client";
import { api, matching, fix_date, get_session, alert_msg } from "@/public/script/public";
import Table from "@/app/component/table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function comics() {
  const router = useRouter();
  const config = useSelector((state) => state.config);
  const [data, setData] = useState([]);
  

  const columns = () => {
    return [
      {
        accessor: "invoice",
        sortable: true,
        title: "id",
        render: ({ id }) => (
          <div className="default select-text font-semibold">{id}</div>
        ),
      },
      {
        accessor: "info",
        sortable: true,
        title: "name",
        render: ({ vertical_thumbnail, id, title }) => (
          <div className="flex items-center font-semibold">
            <div className="layer-div h-7 w-7 overflow-hidden rounded-[.5rem] ltr:mr-3 rtl:ml-3">
              <img
                src={`${vertical_thumbnail}`}
                className="h-full w-full rounded-[.5rem] object-cover"
                onLoad={(e) =>
                  e.target.src.includes("_icon")
                    ? e.target.classList.add("empty")
                    : e.target.classList.remove("empty")
                }
                onError={(e) => (e.target.src = `/media/public/empty_icon.png`)}
              />
            </div>
            <div className="default max-w-[15rem] select-text truncate font-semibold">
              {title}
            </div>
          </div>
        ),
      },
    
      {
        accessor: "active",
        sortable: true,
        title: "status",
        render: ({ status, id }) => (
          <span
            className={`badge badge-outline-${status ? "success" : "danger"}`}
          >
            {status ? config.text.status : config.text.stopped}
          </span>
        ),
      },
      {
        accessor: "views",
        sortable: true,
        title: "views",
        render: ({ views, id }) => (
          <div className="default select-text font-semibold">
            {(views)}
          </div>
        ),
      },
      
    ];
  };

  const get = async () => {
    await fetch("https://webtoon.future-developers.cloud/api/admin/comics", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${get_session("user")?.access_token}`, // استخدام التوكن في الهيدر
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const delete_ = async (payload) => {
    try {
      const response = await fetch(
        `https://webtoon.future-developers.cloud/api/admin/comics/delete`,
        {
          method: "POST",
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

  const search = (items, query) => {
    let result = items.filter(
      (item) =>
        matching(`--${item.id}`, query) ||
        matching(item.title, query) ||
        matching(item.products, query) ||
        matching(item.description, query) ||
        matching(
          item.active ? config.text.active : config.text.stopped,
          query
        ) ||
        matching(item.slug, query) ||
        matching((item.slug), query)
    );

    return result;
  };
  useEffect(() => {
    document.title = config.text.all_comics || "";
    get();
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      delete_={delete_}
      search={search}
      async_search={false}
      edit={(id) => router.push(`/comics/edit/${id}`)}
      no_delete={!data.length}
      no_search={!data.length}
    />
  );
}
