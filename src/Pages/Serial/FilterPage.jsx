import { Autocomplete, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import "./Serial.css";
import moment from "moment/moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import MUIDataTable from "mui-datatables";

function FilterPage() {
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [comboData, setComboData] = useState([]);
  const [socketList, setSocketList] = useState([]);
  const [sendFilterSerialData, setSendFilterSerialData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  useQuery("product-list", fetchProductList);
  function fetchProductList() {
    axios({
      method: "get",
      url: `${baseurl.base_url}/sim/get-product`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setProductList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  function fetchModelList(value) {
    const data = {
      product_id: value,
    };
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-model`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    })
      .then((res) => {
        setModelList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  useQuery("socket-list", () => {
    axios({
      method: "get",
      url: `${baseurl.base_url}/sim/get-socket`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setSocketList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  });

  function getComboCode(value) {
    const data = {
      model_id: value,
    };
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-combo-code`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    })
      .then((res) => {
        console.log(res.data.data);
        setComboData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getFilteredData() {
    console.log(sendFilterSerialData);
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-serial-number-view`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: sendFilterSerialData,
    })
      .then((res) => {
        console.log(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.message(err.data.message);
      });
  }
  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    selectableRowsHideCheckboxes: true,
  };
  const columns = [
    
      {
        name: "product_code",
        label: "product code",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "product_name",
        label: "product name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "model_code",
        label: "model code",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "model_name",
        label: "model name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "sap_part_code",
        label: "sap part code",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "plant_code",
        label: "plant code",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "plant_name",
        label: "plant name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "prod_line_code",
        label: "prod line code",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "prod_line_name",
        label: "prod line name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "ecn_mjo_number",
        label: "ecn mjo number",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "ecn_impl_date",
        label: "ecn impl date",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "socket_code",
        label: "socket code",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "socket_type",
        label: "socket type",
        options: {
          filter: true,
          sort: true,
          
        },
      },
      {
        name: "serial_number_start",
        label: "serial number start",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "serial_number_end",
        label: "serial number end",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "quantity",
        label: "quantity",
        options: {
          filter: true,
          sort: true,
        },
      },
  ];

  return (
    <div className="filter-page-main">
      <div className="filter-page-input-main">
        <Autocomplete
        size="small"
          className=""
          /* value={serialGenData.product_id} */
          onChange={(event, newValue) => {
            if (newValue?.id) {
              fetchModelList(newValue.id);
              setSendFilterSerialData({
                ...sendFilterSerialData,
                product_id: newValue.id,
              });
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) =>
            `${option.product_name} (${option.product_code})`
          }
          options={productList}
          sx={{ width: 280 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Product Name"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />
        <Autocomplete
        size="small"
          className=""
          onChange={(event, newValue) => {
            if (newValue?.id) {
              setSendFilterSerialData({
                ...sendFilterSerialData,
                model_id: newValue.id,
              });
              getComboCode(newValue.id);
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) =>
            `${option.model_name} (${option.model_code})`
          }
          options={modelList}
          sx={{ width: 280 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Model Name"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />
        <Autocomplete
        size="small"
          className=""
          onChange={(event, newValue) => {
            if (newValue) {
              console.log(newValue.combo_id);
              setSendFilterSerialData({
                ...sendFilterSerialData,
                combo_id: newValue.combo_id,
              });
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) =>
            `${option.combo_code} (${option.combo_id})`
          }
          options={comboData}
          sx={{ width: 280 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Combo Code"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />
        <Autocomplete
        size="small"
          className=""
          onChange={(event, newValue) => {
            if (newValue) {
              console.log(newValue.id);
              setSendFilterSerialData({
                ...sendFilterSerialData,
                socket_id: newValue.id,
              });
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) => `${option.socket_type}`}
          options={socketList}
          sx={{ width: 280 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Socket Type"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
          className="date-filter"
            label="Start Date"
            value={sendFilterSerialData.start_date}
            onChange={(newValue) => {
              setSendFilterSerialData({
                ...sendFilterSerialData,
                start_date: moment(newValue._d).format("YYYY-MM-DD"),
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
           className="date-filter"
            label="End Date"
            value={sendFilterSerialData.end_date}
            onChange={(newValue) => {
              setSendFilterSerialData({
                ...sendFilterSerialData,
                end_date: moment(newValue._d).format("YYYY-MM-DD"),
              });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          sx={{ minWidth: "200px" }}
          variant="contained"
          color="primary"
          onClick={() => {
            getFilteredData();
          }}
        >
          Search
        </Button>
      </div>
      <div
        style={{ paddingBottom: "5vh", marginTop: "5vh" }}
        className="report-table table-ceam"
      >
        <MUIDataTable
          title={"Serial Data"}
          data={filteredData}
          columns={columns}
          options={options}
        />
      </div>
    </div>
  );
}

export default FilterPage;
