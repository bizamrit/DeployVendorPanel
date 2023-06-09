import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Space, Table, Dropdown, Image, Button, Modal, Tag } from "antd";
import styles from "./Table.module.css";
import { DownOutlined } from "@ant-design/icons";
import { apicall } from "../../../utils/apicall/apicall";
import { AiFillEdit, AiFillDelete, AiFillSetting } from "react-icons/ai";
import { loadTableData } from "../../../redux/features/products/productSlice";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../../utils/Hooks/useWindowSize";
const { confirm } = Modal;
const ProductTable = ({
  setPage,
  setLoading,
  loading,
  handleScroll,
  setSortBy,
  getProducts,
}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.product.products);
  const [productId, setProductId] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();
  const windowSize = useWindowSize();
  useEffect(() => {
    document
      .querySelector("#product > div > div.ant-table-body")
      ?.addEventListener("scroll", handleScroll);

    return () => {
      document
        .querySelector("#product > div > div.ant-table-body")
        ?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // delete confirmation
  function showConfirm(title, message = "", id) {
    confirm({
      title: title,
      content: message,
      async onOk() {
        try {
          deleteProduct(id);
        } catch (e) {
          return console.log("Oops errors!");
        }
      },
      onCancel() {},
    });
  }
  // Delete data
  const deleteProduct = async (id) => {
    setLoading(true);
    // perform api call to retrieve data
    if (id) {
      var result = await apicall({
        method: "delete",
        url: `products/${id}`,
      });

      if (result.status == "204") {
        setLoading(false);
        getProducts();
      }
      setLoading(false);
    }
  };

  //This  is for product deletion of multiple products
  const deleteSelectedProduct = async (ids) => {
    setLoading(true);
    let final_delete_ids = { product_ids: {} };
    ids?.map((id, i) => {
      final_delete_ids.product_ids[i] = id;
    });
    let result = await apicall({
      url: `BulkProducts`,
      method: "delete",
      data: final_delete_ids,
    });
    if (result.statusText == "OK") {
      setSelectedRowKeys([]);
      getProducts();
      setLoading(false);
    }
    setLoading(false);
  };
  // Set id
  const setSelectedRow = async (id, method) => {
    setProductId(id);
    window.localstorage.setItem("productRowId", JSON.stringify(id));
    if (method === "detail") {
      navigate("Edit Product");
    }
  };

  //UpdateProduct status
  const updateProductStatus = async (id, status) => {
    const timeOutId = setTimeout(async () => {
      const result = await apicall({
        method: "put",
        data: {
          status,
        },
        url: `products/${id}`,
      });
      if (result?.statusText == "OK") {
        const allData = await apicall({
          url: `products/`,
        });
        await dispatch(loadTableData(allData?.data?.products));
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  };

  //  set Status of product
  const getProductStatus = (status) => {
    switch (status) {
      case "H":
        return <Tag color="purple">Hidden</Tag>;
      case "A":
        return <Tag color="green">Active</Tag>;
      case "D":
        return <Tag color="orange">Disabled</Tag>;
      case "R":
        return <Tag color="red">Requires Approval</Tag>;
      case "X":
        return <Tag color="magenta">Disapproved</Tag>;
      default:
        return "Attention required";
    }
  };
  //  console.log(data)
  const statusItems = [
    {
      key: "1",
      label: (
        <div onClick={() => updateProductStatus(productId, "A")}>Active</div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={() => updateProductStatus(productId, "D")}>Disabled</div>
      ),
    },
    {
      key: "3",
      label: (
        <div onClick={() => updateProductStatus(productId, "H")}>Hidden</div>
      ),
    },
  ];
  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() =>
            navigate("../Products/Products/Edit Product/" + productId)
          }
        >
          Edit <AiFillEdit />
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          rel="noopener noreferrer"
          href="#"
          className={styles.action_items}
          onClick={() => showConfirm("Are you sure to delete?", "", productId)}
        >
          Delete
          <AiFillDelete />
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "Name/Code",
      dataIndex: ["product_id", "product", "product_code", "main_pair"],
      data: "data",
      key: "product",
      render: (text, row) => (
        <div className={styles.product_info}>
          <Image
            width={70}
            src={!row["main_pair"] ? "" : row["main_pair"].detailed.image_path}
            alt={""}
          />
          <div className={styles.product_name}>
            <a
              onClick={() =>
                navigate(`../Products/Products/Edit Product/` + row?.product_id)
              }
            >
              <strong>
                {row["product"]?.length > 15
                  ? row["product"].substring(0, 15) + "..."
                  : row["product"]}
              </strong>
            </a>
            <small>{row["product_code"]}</small>
          </div>
        </div>
      ),
      sorter: (a, b) => {},
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => {},
      render: (price) => <p>{parseFloat(price).toFixed(2)}</p>,
    },
    {
      title: "Quantity",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => {},
    },
    {
      title: "Action",
      key: "action",
      dataIndex: ["product_id"],
      render: (id) => (
        <div
          className={styles.product_action}
          onClick={() => setSelectedRow(id)}
        >
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            arrow
            trigger={["click"]}
          >
            <AiFillSetting size={20} className={styles.icons} />
          </Dropdown>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: ["status", "product_id"],
      defaultFilteredValue: "Requires Approval",
      render: (text, row) => (
        <div>
          {row.status == "R" || row.status == "X" ? (
            getProductStatus(row.status)
          ) : (
            <Dropdown menu={{ items: statusItems }}>
              <Space onMouseOver={() => setProductId(row["product_id"])}>
                {getProductStatus(row["status"])}
              </Space>
            </Dropdown>
          )}
        </div>
      ),
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  function onChange(pagination, filters, sorter, extra) {
    setPage(1);
    setSortBy(sorter);
  }

  return (
    <div>
      <div style={{ backgroundColor: "white", padding: "10px" }}>
        <Button
          type="primary"
          onClick={() => deleteSelectedProduct(selectedRowKeys)}
          disabled={!hasSelected}
        >
          Delete
        </Button>
      </div>
      <Table
        id="product"
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={false}
        onChange={onChange}
        scroll={{
          y: windowSize.height > 670 ? 400 : 200,
          x: 1000,
        }}
      />
    </div>
  );
};

export default ProductTable;
