"use client";
import { api, matching, fix_date, get_session, alert_msg } from "@/public/script/public";
import Table from "@/app/component/table";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Categories() {
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
        render: ({ name }) => (
          <div className=" font-semibold">
           
            <div className="default max-w-[15rem] select-text truncate font-semibold">
              {name}
            </div>
          </div>
        ),
      },
     
     
    ];
  };

  const get = async () => {
    await fetch("https://webtoon.future-developers.cloud/api/admin/categories", {
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
        setData(response.data);
        console.log(response.data);
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
        `https://webtoon.future-developers.cloud/api/admin/categories`,
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
    document.title = config.text.all_categories || "";
    get();
  }, []);

  return (
    <Table
      columns={columns}
      data={data}
      delete_={delete_}
      search={search}
      async_search={false}
      add={() => router.push(`/categories/add`)}
      btn_name="add_category"
      edit={(id) => router.push(`/categories/edit/${id}`)}
      no_delete={!data.length}
      no_search={!data.length}
    />
  );
}
