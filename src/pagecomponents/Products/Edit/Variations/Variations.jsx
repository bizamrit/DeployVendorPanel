import React, { useState } from "react";
import { Button, Modal, Select, Input, Image, Dropdown } from "antd";
import styles from "./Variations.module.css";
import { useEffect } from "react";
import VariationTable from "./VariationTable";
import "./index.css";
import { apicall } from "../../../../utils/apicall/apicall";
import { AiFillSetting } from "react-icons/ai";
import ModalTable from "./ModalContent/ModalTable";
// creating an object that is used to map status
const status = {
  A: "Active",
  H: "Hidden",
  D: "Disabled",
  R: "Requires Approval",
};
let id = "";
const { confirm } = Modal;
const feature_data=[
  {
    "feature":"Brand",
    "id":"1",
    "variations":[
      {
        "variant":"Apple",
        "variant_id":"1"
      },
      {
        "variant":"Adidas",
        "variant_id":"2"
      }
    ]
  },
  {
    "feature":"Color",
    "id":"2",
    "variations":[
      {
        "variant":"Green",
        "variant_id":"3"
      },
      {
        "variant":"Yellow",
        "variant_id":"4"
      }
    ]
  }
]
const Variations = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [features, setFeatures] = useState("");
  const [featureList, setFeatureList] = useState([]);
  const [variationData, setVariationData] = useState([]);
  const [columns, setColumns] = useState("");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [selectVariantId, setSelectVariantId] = useState("");
  const [tableData, setTableData]=useState([])
  useEffect(()=>{
    console.log(tableData)
  },[tableData])

  useEffect(() => {
    setFeatures(feature_data.map((item) => ({
      value: item.id,
      label: item.feature,
      variation:item.variations
    })))
    Promise.all([
      getColumns(),
      getProductVariationGroup(data.variation_group_id),
    ]);
  }, [updated]);
  useEffect(() => {
    id = selectVariantId;
  }, [selectVariantId]);
  const status_items = [
    {
      label: <div onClick={() => updateStatus("A")}>Active</div>,
      value: "A",
      key: "0",
    },
    {
      label: <div onClick={() => updateStatus("D")}>Disabled</div>,
      value: "D",
      key: "1",
    },

    {
      label: <div onClick={() => updateStatus("H")}>Hidden</div>,
      value: "H",
      key: "2",
    },
  ];
  // action_items
  const action_items = [
    {
      label: <a onClick={() => onEditPress("detail")}>Edit</a>,
      key: "0",
    },
    {
      label: (
        <a
          href="#"
          onClick={() =>
            showConfirm(
              "Do you want to remove variation from group?",
              "",
              `product_variations/${id}/detach_product_variation`,
              "post"
            )
          }
        >
          Remove variation from group
        </a>
      ),
      key: "1",
    },

    {
      label: (
        <a
          href="#"
          onClick={() =>
            showConfirm(
              "Do you want to delete the item?",
              "",
              `products/${id}`,
              "delete"
            )
          }
        >
          Delete product
        </a>
      ),
      key: "2",
    },
  ];

  // show delete or variation detach confirmation
  function showConfirm(title, message, url, method) {
    confirm({
      title: title,
      content: message,
      async onOk() {
        try {
          setUpdated(true);
          let result = await apicall({
            url: url,
            method: method,
          });
          if (result.status) {
            setUpdated(false);
          }
        } catch (e) {
          return console.log("Oops errors!");
        }
      },
      onCancel() {},
    });
  }
  // on feature select
  const onFeatureSelect = (a,b) => {
    
     setFeatureList((current) => [...current,b]);
    // const tempFeature = features.filter((item) => {
    //   return item.value !== value;
    // });
    // setFeatures(tempFeature);
  };

  const dropdownClose = (open) => {
    if (open === false) {
      // do something
    }
  };

  // get variation group
  const getProductVariationGroup = async () => {
    setLoading(true);
    let result = await apicall({
      url: `product_variations_groups/${data.variation_group_id}/product_variations`,
    });
    if (result.data) {
      setVariationData(result.data?.products);
      setLoading(false);
    }
    setLoading(false);
  };

  //for edit option
  // Set id
  const onEditPress = async (method) => {
    window.localStorage.setItem("productRowId", JSON.stringify(id));
    if (method === "detail") {
      location.reload();
    }
  };
  // update status of variant
  const updateStatus = async (status) => {
    setUpdated(true);
    let res = await apicall({
      url: `products/${id}`,
      method: "put",
      data: {
        status,
      },
    });
    if (res.data) {
      setUpdated(false);
    } else {
      setUpdated(false);
    }
  };
  const handleVariantSelect=(a,b)=>{
      setTableData({...tableData,[b.value]:{
        feature:b.label,
        id:b.value,
        price:100,
        code:'product_123',
        quantity:12,
        name:'Pendrive'
      }})
  }
  const handleVariantDeselect=(a,b)=>{
    console.log(b)
    let temp={...tableData}
    delete temp[b.value]
    console.log(temp)
    setTableData()
  }
  const getColumns = () => {
    let temp = [
      {
        title: "Name/Image",
        dataIndex: "product",
        key: "product",
        render: (item, row) => (
          <div className={styles.image_and_name}>
            <Image
              width={70}
              src={
                !row["main_pair"] ? "" : row["main_pair"].detailed.image_path
              }
              alt={""}
            />
            <p>
              {" "}
              <b>{row.product}</b>
            </p>
          </div>
        ),
      },
      {
        title: "Code",
        dataIndex: "product_code",
        key: "product_code",
      },
    ];
    let sample = Object.values(data.variation_features).map((item, i) => ({
      title: item.internal_name,
      dataIndex: item.internal_name,
      key: item.internal_name,
      render: (text, row) => (
        <div key={i}>{row.variation_features[item.feature_id].variant}</div>
      ),
    }));
    setColumns([
      ...temp,
      ...sample,
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Quantity",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",

        render: (action, row) => (
          <div className={styles.action_btn}>
            <Dropdown
              menu={{
                items: action_items,
              }}
              trigger={["click"]}
            >
              <a href="#">
                <AiFillSetting
                  onClick={() => setSelectVariantId(row.product_id)}
                  size={20}
                  className={styles.icons}
                />
              </a>
            </Dropdown>
          </div>
        ),
      },

      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (value, row) => (
          <div>
            <Dropdown
              menu={{
                items: status_items,
              }}
              trigger={["click"]}
            >
              <a onClick={() => setSelectVariantId(row.product_id)}>
                {status[value]}
              </a>
            </Dropdown>
          </div>
        ),
      },
    ]);
  };
  return (
    <div className={styles.variations}>
      <div className={styles.variations_top}>
        <Input
          style={{ width: "300px" }}
          addonBefore="Variation group"
          defaultValue={data?.variation_group_code}
        />
        <Button
          style={{ float: "right" }}
          type="primary"
          onClick={() => setModalOpen(true)}
        >
          Add variations
        </Button>
        <Modal
          title="Add variation"
          maskClosable={false}
          centered
          width={1000}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          className={styles.variation_modal}
          okButtonProps={{}}
        >
        <div className={styles.modal_body}>
          <div >
            {" "}
            <Select
              showSearch
              style={{
                width: 200,
              }}
              onSelect={onFeatureSelect}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={features}
            />
            <div className={styles.feature_container}>
            </div>
            {featureList?.map((item, index) => {
              return (
                <div key={index} className={styles.feature_main}>
                  <span>
                    <b>{item.label}</b>
                  </span>
                  <Select
                    mode="multiple"
                    onDropdownVisibleChange={dropdownClose}
                    showSearch
                    onDeselect={handleVariantDeselect}
                    onSelect={handleVariantSelect}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    style={{ width: "100%" ,paddingRight:'40px'}}
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={item.variation.map((variant)=>({label:variant.variant,value:variant.variant_id}))}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.modal_variation_table}>
          <ModalTable loading={loading} data={tableData}/>
          </div>
          </div>
        </Modal>
      </div>
      <div className={styles.variations_table}>
        {variationData ? (
          <VariationTable
            loading={loading}
            data={variationData}
            columns={columns}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Variations;
