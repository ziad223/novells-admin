"use client";
import { alert_msg, lower, print, confirm_deletion } from "@/public/script/public";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { DataTable } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import Loader from "@/app/component/loader";

export default function Table({
  columns,
  data,
  add,
  edit,
  delete_,
  search,
  async_search,
  no_search,
  no_add,
  no_edit,
  no_delete,
  btn_name,
  hide
}) {
  const config = useSelector((state) => state.config);
  const isDark =
    useSelector((state) => state.config.theme) === "dark" ? true : false;
  const isRtl =
    useSelector((state) => state.config.lang) === "ar" ? true : false;
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [query, setQuery] = useState("");
  const [sortStatus, setSortStatus] = useState({
    columnAccessor: "",
    direction: "asc",
  });
  const [items, setItems] = useState([]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [loader, setLoader] = useState(false);

  const check_empty = (data_table) => {
    if (data_table?.length)
      document.querySelector(".datatables").classList.remove("empty");
    else document.querySelector(".datatables").classList.add("empty");
  };
  

  

  const deleteRow = async (id) => {
    if (!selectedRecords.length && !id) return;
  
    let selectedRows = selectedRecords || [];
    if (id) selectedRows = [{ id: id }];
  
    const ids = selectedRows.map((_) => _.id);
  
     const payload =  {
      id: ids
    };
    confirm_deletion('user', async function() {
      setLoader(true);
  
      const deleteSuccess = await delete_(payload);
      if (deleteSuccess) {
        const result = items.filter((_) => !ids.includes(_.id));
        setRecords(result);
        setInitialRecords(result);
        setItems(result);
        setSelectedRecords([]);
        setQuery("");
        setPage(1);
        check_empty(result);
        // alert_msg(
        //   `${ids.length} ${config.text.items} ${config.text.deleted_successfully}`
        // );
      } else {
        alert_msg(config.text.alert_error, "error");
      }
  
      setLoader(false);
    });
  };
  


  
  const searchData = () => {
    let result = search(items, query);

    if (!async_search) {
      setInitialRecords(result);
      check_empty(result);
    }
  };
  useEffect(() => {
    setItems(data);
    setInitialRecords(sortBy(data, ""));
    check_empty(data);
  }, [data]);
  useEffect(() => {
    setPage(1);
  }, [pageSize]);
  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecords([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);
  useEffect(() => {
    const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data2.reverse() : data2);
    setPage(1);
  }, [sortStatus]);

  return (
    <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
      <div className="invoice-table">
        <div className="mb-4.5 flex select-none flex-col gap-5 px-5 md:flex-row md:items-center">
          {!no_search && (
            <div className="ltr:ml-auto rtl:mr-auto">
              <input
                type="text"
                className="form-input w-auto"
                placeholder={config.text.search}
                value={query}
                style={{ width: "20rem" }}
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={(e) => {
                  async_search
                    ? e.key === "Enter" && searchData()
                    : searchData();
                }}
              />
            </div>
          )}
        </div>

        <div className="datatables pagination-padding">
          {loader ? (
            <div className="relative h-[20rem] w-full">
              <Loader />
            </div>
          ) : (
            <DataTable
              className={`${isDark} table-hover select-none whitespace-nowrap`}
              records={records}
              columns={[
                ...columns().map((_) => {
                  _.textAlignment = isRtl ? "right" : "left";
                  _.title = config.text[lower(_.title)] || "";
                  return _;
                }),
                {
                  accessor: "action",
                  sortable: false,
                  title: config.text.actions,
                  textAlignment: isRtl ? "right" : "left",
                  render: ({ id }) => (
                    <div className="mx-auto flex w-full items-center gap-3">
                      {!no_edit && (
                        <button
                          type="button"
                          onClick={() => edit(id)}
                          className="btn border-primary px-3 py-[5px] text-[.8rem] tracking-wide text-primary shadow-none hover:bg-primary hover:text-white"
                        >
                          {config.text.show}
                        </button>
                      )}
                      {!no_delete && (
                        <button
                          type="button"
                          onClick={() => deleteRow(id)}
                          className="btn border-danger px-3 py-[5px] text-[.8rem] tracking-wide text-danger shadow-none hover:bg-danger hover:text-white"
                        >
                          {config.text.delete}
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
              highlightOnHover
              totalRecords={initialRecords.length}
              recordsPerPage={pageSize}
              page={page}
              onPageChange={(p) => setPage(p)}
              recordsPerPageOptions={PAGE_SIZES}
              onRecordsPerPageChange={setPageSize}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              paginationText={({ from, to, totalRecords }) =>
                `${config.text.showing}  ${from} - ${to} ${config.text.of} ${totalRecords}`
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}