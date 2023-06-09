import React from "react";
import styles from "./Search.module.css";
import { Card,Form,Select,Input, DatePicker } from "antd";
const {RangePicker}=DatePicker;
const Search = ({getAccountingInformation,getTotalTransaction,getTotalShipping, getTotalVoucher, getTotalGift, getNetIncome}) => {
    const [form]=Form.useForm()
  const types = [
    { key: "all", label: "All", value: "" },
    { key: "other", label: "Other", value: "other" },
    { key: "placed", label: "Order placed", value: "order_placed" },
    { key: "changed", label: "Order changed", value: "order_changed" },
    { key: "refunded", label: "Order refunded", value: "order_refunded" },
    { key: "payout", label: "Payout", value: "payout" },
  ];
  const status = [
    { key: "all", label: "All", value: "" },
    { key: "pending", label: "Pending", value: "P" },
    { key: "completed", label: "Completed", value: "C" },
    { key: "declined", label: "Declined", value: "D" },
  ];
  const onValueChange = (a, values) => {
    if(values.dates){
      let startDate = new Date(values?.dates[0]?.$y,values?.dates[0]?.$M, values?.dates[0]?.$D).getTime()/1000;
      let endDate = new Date(values?.dates[1]?.$y,values?.dates[1]?.$M, values?.dates[1]?.$D).getTime()/1000;
      let data={...values, start_date:startDate, end_date:endDate}
      getAccountingInformation(data)
    }else{
      getAccountingInformation(values)
    }
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  return (
    <div className={styles.container}>
      <Card bordered={true}>
        <Form
          layout="vertical"
          form={form}
          className={styles.form}
          name="basic"
          wrapperCol={{}}
          autoComplete="off"
          onValuesChange={onValueChange}
          initialValues={
            {
                types:types[0].value,
                status:status[0].value
            }
          }
        >
          <div className={styles.search_inputs}>
            <Form.Item id="req" label="Type" name="types"
            style={{width:'200px'}}
            >
              <Select
                showSearch
                placeholder="Select a type"
                optionFilterProp="children"
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={types}
              />
            </Form.Item>
            <Form.Item id="status" 
            label="Approval Status" 
            name="status"
            style={{width:'200px'}}>
              <Select
                showSearch
                optionFilterProp="children"
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={status}
              />
            </Form.Item> 
            <Form.Item id="date" 
            label="Select Dates" 
            name="dates">
            <RangePicker/>
            </Form.Item>
           
          </div>
        </Form>
      </Card>
      <Card bordered={true} className={styles.right_card}>
          <div className={styles.right_container}>
          <div className={styles.title}>
            <h3>Total</h3>
          </div>
          <div className={styles.right_card_body}>
                <h5>Total Transaction value:
                <span >रु{getTotalTransaction()}</span>
                </h5>
                <h5>Shipping cost:
                <span className={styles.red}>रु{getTotalShipping()}</span></h5>
                <h5>Voucher cost:
                <span className={styles.red}>रु{getTotalVoucher()}</span></h5>
                <h5>Gift certificate cost:
                <span className={styles.red}>रु{getTotalGift()}</span></h5> 
                <h5>Net income:
                <span>रु{getNetIncome()}</span></h5>
          </div>
          </div>
      </Card>
    </div>
  );
};

export default Search;
