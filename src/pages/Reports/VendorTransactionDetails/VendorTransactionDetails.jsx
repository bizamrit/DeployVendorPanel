import React, { useRef, useState, useCallback } from "react";
import { Breadcrumb } from "antd";
import styles from "./VendorTransactionDetails.module.css";
import { useEffect } from "react";
import { apicall2 } from "../../../utils/apicall/apicall2";
import useDebounce from "../../../utils/Hooks/useDebounce";
import VendorTransactionDetailsSearch from "../../../pagecomponents/Reports/VendorTransactionDetails/Search/Search";
import VendorTransactionsReportTable from "../../../pagecomponents/Reports/VendorTransactionDetails/Table/Table";
import { useGetVendorTransactionDetails } from "../../../apis/ReportsApi";
const INITIAL_PARAMS={
  time_from:'',
  time_to:'',
  vendor:''
}
const VendorTransactionDetails = () => {
  const [sValue, setSearchValue] = useState({});
  const [params, setParams]=useState(INITIAL_PARAMS)
  const [accountOrderDetails, setAccountOrderDetails] = useState([]);
  const [radio, setRadio] = useState("O");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [dload, setDload] = useState(false);
  const page1 = useRef(1);
  const [sortBy, setSortBy] = useState("");
  const [bottom, setBottom] = useState(false);
  const stateChange = Object.values(sValue).join("");
  const {isLoading:transactionLoading, data:transactionData}=useGetVendorTransactionDetails(params)
  useDebounce(
    () => {
      getAccountOrderDetails(sValue);
    },
    1200,
    [stateChange, dload]
  );
// get vendor transaction details
 const getTransaction=()=>{
  if(transactionData?.data?.report){
    return transactionData?.data?.report;
  }
  return []
 }
  useEffect(() => {
    document
      .querySelector("#reportaccount > div > div.ant-table-body")
      ?.addEventListener("scroll", handleScroll);

    return () => {
      document
        .querySelector("#reportaccount > div > div.ant-table-body ")
        ?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = (event) => {
    const condition =
      event.target.scrollTop + event.target.offsetHeight + 100 >
      event.target.scrollHeight;
    setBottom(condition);
  };

  useEffect(() => {
    getAccountOrderDetails(sValue);
  }, [load, sortBy?.order, sortBy?.field, radio]);

  const getPostUrl = (searchValue) => {
    let initial = true;
    let postUrl = "?";

    if (searchValue.orderno && searchValue.orderno.length > 0) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      postUrl = postUrl + "order_id=" + searchValue.orderno;
      initial = false;
    }
    if (searchValue.customername && searchValue.customername.length > 0) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      postUrl = postUrl + "customer=" + searchValue.customername;
      initial = false;
    }
    if (searchValue.customerphone && searchValue.customerphone.length > 0) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      postUrl = postUrl + "phone=" + searchValue.customerphone;
      initial = false;
    }
    if (searchValue.paymentmethod && searchValue.paymentmethod.length > 0) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      postUrl = postUrl + "payment_id=" + searchValue.paymentmethod;
      initial = false;
    }
    if (searchValue.accountstatus && searchValue.accountstatus.length > 0) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      postUrl = postUrl + "account_status=" + searchValue.accountstatus;
      initial = false;
    }
    if (searchValue.startDate && searchValue.startDate.length > 1) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      let sdate = searchValue.startDate.split("-");
      postUrl =
        postUrl + "time_from=" + sdate[2] + "/" + sdate[1] + "/" + sdate[0];
      initial = false;
    }
    if (searchValue.endDate && searchValue.endDate.length > 1) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      let edate = searchValue.endDate.split("-");
      postUrl =
        postUrl + "time_to=" + +edate[2] + "/" + edate[1] + "/" + edate[0];
      initial = false;
    }
    if (sortBy?.order) {
      if (!initial) {
        postUrl = postUrl + "&";
      }
      const orderType = sortBy?.order === "ascend" ? "asc" : "desc";
      postUrl = postUrl + "sort_order=" + orderType;
      initial = false;
      const sortByType = sortBy?.field;
      if (!initial) {
        postUrl = postUrl + "&";
      }
      postUrl = postUrl + "sort_by=" + sortByType;
      initial = false;
    }
    if (!initial) {
      postUrl = postUrl + "&";
    }
    postUrl = postUrl + "filter_date=" + radio;
    return postUrl + `&page=${page1.current}&items_per_page=${50}`;
  };

  const getAccountOrderDetails = async () => {
    setLoading(true);
    const result = await apicall2({
      preurl: "AccountOrderDetail",
      posturl: getPostUrl(sValue),
    });

    if (result?.status === 200) {
      setAccountOrderDetails(result.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (accountOrderDetails.length < 50) {
      return;
    }
    if (!bottom) {
      return;
    }
    page1.current = page1.current + 1;
    getMoreAccountOrderDetails(sValue);
  }, [bottom]);

  const getMoreAccountOrderDetails = async () => {
    setLoading(true);
    const result = await apicall2({
      preurl: "AccountOrderDetail",
      posturl: getPostUrl(sValue),
    });

    if (result?.status === 200) {
      setAccountOrderDetails((prev) => [...prev, ...result.data]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Reports</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Vendor transaction details</Breadcrumb.Item>
      </Breadcrumb>
      <VendorTransactionDetailsSearch
        setSearchValue={setSearchValue}
        sValue={sValue}
       params={params}
       setParams={setParams}
      />
      <VendorTransactionsReportTable
        accountOrderDetails={getTransaction()}
        page1={page1}
        setSortBy={setSortBy}
        loading={transactionLoading}
      />
    </div>
  );
};

export default VendorTransactionDetails;
