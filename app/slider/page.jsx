"use client";
import {
  api,
  fix_date,
  matching,
  fix_number,
  get_session,
  alert_msg,
} from "@/public/script/public";
import Table from "@/app/component/table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
export default function Products() {
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
        accessor: "Image",
        sortable: true,
        title: "Image",
        render: ({ image }) => (
          <div className="flex items-center font-semibold">
            <div className="layer-div h-7 w-7 overflow-hidden rounded-[.5rem] ltr:mr-3 rtl:ml-3">
              <img
                src={`${image}`}
                className="h-full w-full rounded-[.5rem] object-cover"
                onLoad={(e) =>
                  e.target.src.includes("_icon")
                    ? e.target.classList.add("empty")
                    : e.target.classList.remove("empty")
                }
                onError={(e) => (e.target.src = `/media/public/empty_icon.png`)}
              />
            </div>
           
          </div>
        ),
      },
       
     
     
    ];
  };
  const get = async () => {
    await fetch("https://webtoon.future-developers.cloud/api/admin/slider",  {
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

const delete_ = async (payload) => {
  try {
    const response = await fetch(
      `https://webtoon.future-developers.cloud/api/admin/slider/delete`,
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
        matching(item.name, query) ||
        matching(item.category, query) ||
        matching(item.type, query) ||
        matching(item.orders, query) ||
        // matching(fix_number(item.price, "float"), query) ||
        // matching(fix_number(item.orders), query) ||
        matching(
          item.active ? config.text.active : config.text.stopped,
          query
        ) ||
        matching(item.created_at, query) ||
        matching(fix_date(item.created_at), query)
    );

    return result;
  };
  useEffect(() => {
    document.title = config.text.all_products;
    get();
  }, []);
  
  return (
    <Table
      columns={columns}
      data={data}
      delete_={delete_}
      search={search}
      async_search={false}
      btn_name="add_product"
      add={() => router.push(`/slider/add`)}
      edit={(id) => router.push(`/slider/edit/${id}`)}
      no_delete={!data.length}
      no_search={!data.length}
    />
  );
}