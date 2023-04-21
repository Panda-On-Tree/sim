import React, { useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { TextField, Autocomplete, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, InputLabel, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Link, TableRow, TableCell, Typography } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import "./Home.css";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DataGrid } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";
import { Stack } from "@mui/system";
function Home() {

  const [comboHistoryData, setComboHistoryData] = useState([])
  const [historyComboId, setHistoryComboId] = useState()
  const [dIndex, setDIndex] = useState()
  const [rowsExpand, setRowsExpand] = useState([])
  const [openDialog, setOpenDialog] = useState(false);
  const [radioEdit, setRadioEdit] = useState("");
  const [openAddNewCN, setOpenAddNewCN] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false)
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [socketList, setSocketList] = useState();
  const [bomList, setBomList] = useState();
  const [editComboNumber, setEditComboNumber] = useState({
    combo_id: "",
    ecn_number: "",
    ecn_implementation_date: "",
    employee_id: localStorage.getItem("employee_id"),
  });
  const model_product_id = useRef({
    model_id: "",
    product_id: "",
    product_name: "",
    model_name: "",
    product_id: "",
    model_id: "",
  });

  const [sendComboNumberData, setSendComboNumberData] = useState({
    product_id: "",
    model_id: "",
    ecn_number: "",
    bom_id: "",
    socket_id: "",
    type: "",
    ecn_implementation_date: "",
    combo_description: "",
    employee_id: localStorage.getItem("employee_id"),
  });

  const [comboData, setComboData] = useState([]);

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

const getHistory = (id) => {
    const data = {
      combo_id: id,
    };
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-combo-history-data`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    })
      .then((res) => {
        console.log(res);
        setOpenHistoryDialog(true)
        setComboHistoryData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message)
      });
  };

  useQuery("socket-list", () => {
    getBom();
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

  function sendEditComboNumber() {
    if (radioEdit == 1) {
      console.log(editComboNumber);
      axios({
        method: "post",
        url: `${baseurl.base_url}/sim/edit-combo-code-set-inactive`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: editComboNumber,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (radioEdit == 2) {
      console.log(editComboNumber);
      axios({
        method: "post",
        url: `${baseurl.base_url}/sim/edit-combo-code-set-obsolete`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: editComboNumber,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (radioEdit == 3) {
      console.log(editComboNumber);
      axios({
        method: "post",
        url: `${baseurl.base_url}/sim/edit-combo-code-add-ecn`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: editComboNumber,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
    } else {
      alert("Select One First");
    }
  }

  function getBom() {
    const data = {
      model_id: "10",
      // model_id: model_product_id.current.model_id,
    };

    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-bom`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    })
      .then((res) => {
        setBomList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  function getComboCode() {
    setComboData([]);

    const data = {
      model_id: model_product_id.current.model_id,
    };
    console.log(data);
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
        console.log(res);
        if (res.data.data.length === 0) {
          setOpenDialog(true);
          return;
        }
        setComboData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  function postComboNumberData() {
    console.log(sendComboNumberData);
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/add-new-combo-number`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: sendComboNumberData,
    })
      .then((res) => {
        toast.success(res.data.message);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  function postAddNewComboNumberData() {
    console.log(sendComboNumberData);
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/add-new-combo-number-pre-combo`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: sendComboNumberData,
    })
      .then((res) => {
        toast.success(res.data.message);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  const handleClose = () => {
    setOpenDialog(false);
  };


  const columnsmui = [
    /*  {
      name: "id",
      label: "Sr. No.",
    }, */
    { name: "product_name", label: "Product Name", options: { filter: true, sort: true,filterType :'textField' } },
    { name: "product_code", label: "Product Code", options: { filter: true, sort: true } },
    { name: "model_name", label: "Model Name", options: { filter: true, sort: true } },
    { name: "model_code", label: "Model Code", options: { filter: true, sort: true } },
    { name: "sap_part_code", label: "SAP Part Code", options: { filter: true, sort: true } },
    { name: "combo_code", label: "Combo Code", options: { filter: true, sort: true } },
    { name: "combo_id", label: "Combo ID", options: { filter: false, sort: true , display:false} },
    { name: "socket_type", label: "Socket Type", options: { filter: true, sort: true } },
    { name: "bom_type", label: "Bom Type", options: { filter: false, sort: true, display: false } },
    { name: "combo_description", label: "Combo Description", options: { filter: false, sort: true } },
    { name: "ecn_mjo_number", label: "ECN No.", options: { filter: true, sort: true } },
    { name: "ecn_impl_date", label: "ECN Date", options: { filter: true, sort: true } },
    { name: "start_serial", label: "Start Serial", options: { filter: true, sort: true } },
    { name: "end_serial", label: "End Serial", options: { filter: true, sort: true } },
    {
      name: "is_productive",
      label: "In Prod",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value == 1) {
            return <div>True</div>;
          } else if (value == 0) {
            return <div>false</div>;
          }
        },
      },
    },
    {
      name: "is_rnd",
      label: "R&D",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          if (value == 1) {
            return <div>True</div>;
          } else if (value == 0) {
            return <div>false</div>;
          }
        },
      },
    },
    {
      name: 'active_flag',
      label: "Edit",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
        
          return (
            <div>
              {comboData[dataIndex].active_flag && !(comboData[dataIndex].obsolete_flag)?<>
                <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setEditComboNumber({ ...editComboNumber, combo_id: comboData[dataIndex].combo_id });
                  setOpenEditDialog(true);
                }}
              >
                Edit
              </Link> |
              <Link
                sx={{
                  
                }}
                component="button"
                variant="body2"
                onClick={() => {
                  setSendComboNumberData({ ...sendComboNumberData, prev_combo_id: comboData[dataIndex].combo_id });
                  setOpenAddNewDialog(true);
                }}
              >
                Add New
              </Link></>:null}
            </div>
          /*   <div style={{"display":"flex", "alignItems":"center","gap":"5px"}}>
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setEditComboNumber({ ...editComboNumber, combo_id: comboData[dataIndex].combo_id });
                  setOpenEditDialog(true);
                }}
              >
                Edit
              </Link>
                  |
              <Link
                sx={{
                  
                }}
                component="button"
                variant="body2"
                onClick={() => {
                  setSendComboNumberData({ ...sendComboNumberData, prev_combo_id: comboData[dataIndex].combo_id });
                  setOpenAddNewDialog(true);
                }}
              >
                Add New
              </Link>
            </div> */
          );
        },
      },
    },
    {
      name:"History",
      label:"History",
      options:{
        filter:false,
        sort:false,
        customBodyRender: (value, tableMeta, updateValue) => {
        
          return(
            <Link
            component="button"
            variant="body2"
            onClick={() => {
              setHistoryComboId(tableMeta.rowData[6])
              getHistory(tableMeta.rowData[6])
              console.log(tableMeta.rowData[6]);
            }}
          >
            History
          </Link>
          )
         
        }
      }
    }
    /* {
      name: "edit_add_new",
      headerName: "Edit/Add New",
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              setEditComboNumber({ ...editComboNumber, combo_id: params.row.combo_id });
              setOpenEditDialog(true);
            }}
          >
            Edit
          </Link>

          <Link
            sx={{
              marginLeft: "10px",
            }}
            component="button"
            variant="body2"
            onClick={() => {
              setSendComboNumberData({ ...sendComboNumberData, prev_combo_id: params.row.combo_id });
              setOpenAddNewDialog(true);
            }}
          >
            Add New
          </Link>
        </>
      ),
    }, */
  ];

  function handleGetRowId(e) {
    return comboData.indexOf(e);
  }

  const options = {
    tableBodyMaxHeight: "64vh",
    responsive: "standard",
    selectableRowsHideCheckboxes: true,
    sort: false,
    rowsPerPage: 15,
    viewColumns: false,
    expandableRows: false,
    expandableRowsHeader: false,
    expandableRowsOnClick: true,
    rowsExpanded:rowsExpand,
    setRowProps: (row, dataIndex, rowIndex) => {
      if(!(comboData[dataIndex].active_flag && !(comboData[dataIndex].obsolete_flag))){
        return{
          style: { backgroundColor: 'rgb(225,201,201,0.3)' }
        }
      }
      return {
       
      };
    },
    isRowExpandable: (dataIndex, expandedRows) => {
      return false
    },
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      return (
        <TableRow>
          <TableCell colSpan={colSpan}>{JSON.stringify(comboHistoryData)}</TableCell>
        </TableRow>
      );
    },
    onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) =>
    {
      getHistory(comboData[curExpanded[0].dataIndex].combo_id)
      setRowsExpand([curExpanded[0].dataIndex])
      setDIndex(curExpanded[0].dataIndex)
      console.log(curExpanded, allExpanded, rowsExpanded)
    },
  };

  return (
    <div>
      <div className="home-autocomplete-input-main">
        <Autocomplete
          className="autocomp-input"
          onChange={(event, newValue) => {
            if (newValue?.id) {
              model_product_id.current.product_name = newValue.product_name;
              model_product_id.current.product_id = newValue.id;
              setSendComboNumberData({ ...sendComboNumberData, product_id: newValue.id });
              fetchModelList(newValue?.id);
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) => `${option.product_name} (${option.product_code}) `}
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
          className="autocomp-input"
          onChange={(event, newValue) => {
            if (newValue?.id) {
              model_product_id.current.model_name = newValue.model_name;
              model_product_id.current.model_id = newValue.id;
              setSendComboNumberData({ ...sendComboNumberData, model_id: newValue.id });
            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) => `${option.model_name} (${option.model_code}) \n SAP-${option.sap_part_code}`}
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
        <Button size="large" style={{ width: "150px" }} variant="contained" onClick={() => getComboCode()}>
          Search
        </Button>
        {/*  <SlButton style={{"width":"150px"}} variant="primary" size="medium" onClick={()=>{
            getComboCode()
        }}>Search</SlButton> */}
        <Dialog open={openDialog} keepMounted aria-describedby="alert-dialog-slide-description">
          <DialogTitle>{"Infomation"}</DialogTitle>
          <DialogContent
            sx={{
              width: "40vw",
            }}
          >
            <DialogContentText id="alert-dialog-slide-description">No Data Found For this Model.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenAddNewCN(true);
                setOpenDialog(false);
                getBom();
              }}
            >
              Create New
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog className="add-new-cm-dialog" open={openAddNewCN} keepMounted aria-describedby="alert-dialog-slide-description">
          <DialogTitle>{"Create New Combo Number"}</DialogTitle>
          <DialogContent
            className="add-new-dialog-content"
            sx={{
              width: "50vw",
              padding: "20px 10px !important",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="product-id"
              value={model_product_id.current.product_name}
              label="Product Id"
              variant="outlined"
            />
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="model-id"
              value={model_product_id.current.model_name}
              label="Model Id"
              variant="outlined"
            />
            <TextField
              id="ecn"
              label="ECN Number"
              variant="outlined"
              onChange={(e) => {
                setSendComboNumberData({ ...sendComboNumberData, ecn_number: e.target.value });
              }}
            />
            <FormControl>
              <InputLabel id="bom-select-label">Bom</InputLabel>
              <Select
                defaultValue=""
                labelId="bom-select-label"
                id="bom-select"
                label="bom"
                onChange={(e) => {
                  setSendComboNumberData({ ...sendComboNumberData, bom_id: e.target.value });
                }}
              >
                {bomList?.map((item, i) => {
                  return (
                    <MenuItem key={`$${i}bom`} value={item.id}>
                      {item.bom_type}-{item.bom_code}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="socket-select-label">Socket Type</InputLabel>
              <Select
                defaultValue=""
                labelId="socket-select-label"
                id="socket-select"
                label="Socket Type"
                onChange={(e) => {
                  setSendComboNumberData({ ...sendComboNumberData, socket_id: e.target.value });
                }}
              >
                {socketList?.map((item, i) => {
                  return (
                    <MenuItem key={`$${i}soc`} value={item.id}>
                      {item.socket_type}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                defaultValue=""
                labelId="type-select-label"
                id="type-select"
                label="Type"
                onChange={(e) => {
                  setSendComboNumberData({ ...sendComboNumberData, type: e.target.value });
                }}
              >
                <MenuItem id="emd" value="rnd">
                  RnD
                </MenuItem>
                <MenuItem id="prod" value="prod">
                  Production
                </MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Ecn Implementation Date"
                value={sendComboNumberData.ecn_implementation_date}
                onChange={(newValue) => {
                  setSendComboNumberData({ ...sendComboNumberData, ecn_implementation_date: moment(newValue._d).format("YYYY-MM-DD") });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <TextField
              id="ecn"
              label="Combo Description"
              variant="outlined"
              onChange={(e) => {
                setSendComboNumberData({ ...sendComboNumberData, combo_description: e.target.value });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              size="large"
              variant="outlined"
              onClick={() => {
                postComboNumberData();
                setOpenAddNewCN(false);
              }}
            >
              Create New
            </Button>
            <Button size="large" variant="outlined" color="error" onClick={() => setOpenAddNewCN(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="home-table" sx={{ height: 400, width: "100%" }}>
        {/*  <DataGrid
          sx={{
            fontSize: "12px",
          }}
          rows={comboData}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[5, 20, 100]}
          getRowId={handleGetRowId}
          getRowHeight={() => "auto"}
        /> */}
        <div style={{ paddingBottom: "10vh" }} className="report-table table-ceam">
          <MUIDataTable title={"Combo List"} data={comboData} columns={columnsmui} options={options} />
        </div>
      </div>
      <Dialog open={openEditDialog} keepMounted aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"Select One"}</DialogTitle>
        <DialogContent
          sx={{
            width: "40vw",
          }}
        >
          <FormControl>
            {/* <FormLabel id="demo-radio-buttons-group-label">Select One </FormLabel> */}
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              onChange={(e) => {
                setRadioEdit(e.target.value);
                console.log(e.target.value);
              }}
            >
              <FormControlLabel value="1" control={<Radio />} label="Mark In-active" />
              <FormControlLabel value="2" control={<Radio />} label="Mark Obsolete" />
              <FormControlLabel value="3" control={<Radio />} label="Link New ECN" />
            </RadioGroup>
            {radioEdit == 3 ? (
              <div className="edit-radio-dialog-input-main">
                <TextField
                  sx={{
                    marginTop: "10px",
                  }}
                  id="outlined-basic"
                  label="Enter New ECN"
                  variant="outlined"
                  onChange={(e) => {
                    setEditComboNumber({ ...editComboNumber, ecn_number: e.target.value });
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ecn Implementation Date"
                    value={editComboNumber.ecn_implementation_date}
                    onChange={(newValue) => {
                      console.log(newValue);
                      console.log(moment(newValue._d).format("YYYY-MM-DD"));
                      setEditComboNumber({ ...editComboNumber, ecn_implementation_date: moment(newValue._d).format("YYYY-MM-DD") });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            ) : (
              ""
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              sendEditComboNumber();
            }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setRadioEdit("");

              setOpenEditDialog(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog className="add-new-cm-dialog" open={openAddNewDialog} keepMounted aria-describedby="alert-dialog-slide-description">
        <DialogTitle>{"New"}</DialogTitle>
        <DialogContent
          className="add-new-dialog-content"
          sx={{
            width: "50vw",
            padding: "20px 10px !important",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <TextField
            InputProps={{
              readOnly: true,
            }}
            id="product-id"
            value={model_product_id.current.product_name}
            label="Product Id"
            variant="outlined"
          />
          <TextField
            InputProps={{
              readOnly: true,
            }}
            id="model-id"
            value={model_product_id.current.model_name}
            label="Model Id"
            variant="outlined"
          />
          <TextField
            id="ecn"
            label="ECN Number"
            variant="outlined"
            value={sendComboNumberData.ecn_number}
            onChange={(e) => {
              setSendComboNumberData({ ...sendComboNumberData, ecn_number: e.target.value });
            }}
          />
          <FormControl>
            <InputLabel id="bom-select-label">Bom</InputLabel>
            <Select
              defaultValue=""
              labelId="bom-select-label"
              id="bom-select"
              label="bom"
              value={sendComboNumberData.bom_id}
              onChange={(e) => {
                setSendComboNumberData({ ...sendComboNumberData, bom_id: e.target.value });
              }}
            >
              {bomList?.map((item, i) => {
                return (
                  <MenuItem key={`$${i}bom`} value={item.id}>
                    {item.bom_type}-{item.bom_code}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="socket-select-label">Socket Type</InputLabel>
            <Select
              defaultValue=""
              labelId="socket-select-label"
              id="socket-select"
              label="Socket Type"
              value={sendComboNumberData.socket_id}
              onChange={(e) => {
                setSendComboNumberData({ ...sendComboNumberData, socket_id: e.target.value });
              }}
            >
              {socketList?.map((item, i) => {
                return (
                  <MenuItem key={`$${i}soc`} value={item.id}>
                    {item.socket_type}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              defaultValue=""
              labelId="type-select-label"
              id="type-select"
              label="Type"
              value={sendComboNumberData.type}
              onChange={(e) => {
                setSendComboNumberData({ ...sendComboNumberData, type: e.target.value });
              }}
            >
              <MenuItem id="emd" value="rnd">
                RnD
              </MenuItem>
              <MenuItem id="prod" value="prod">
                Production
              </MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Ecn Implementation Date"
              value={sendComboNumberData.ecn_implementation_date}
              onChange={(newValue) => {
                console.log(moment(newValue._d).format("YYYY-MM-DD"));
                setSendComboNumberData({ ...sendComboNumberData, ecn_implementation_date: moment(newValue._d).format("YYYY-MM-DD") });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <TextField
            id="ecn"
            label="Combo Description"
            variant="outlined"
            value={sendComboNumberData.combo_description}
            onChange={(e) => {
              setSendComboNumberData({ ...sendComboNumberData, combo_description: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              postAddNewComboNumberData();
            }}
          >
            Create New
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setSendComboNumberData({ ...sendComboNumberData, ecn_number: "", bom_id: "", socket_id: "", type: "", ecn_implementation_date: "", combo_description: "" });
              setOpenAddNewDialog(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openHistoryDialog} keepMounted aria-describedby="alert-dialog-slide-description">
          <DialogTitle>{"Infomation"}</DialogTitle>
          <DialogContent
            sx={{
              width: "40vw",
            }}
          >
            {
              Object.entries(comboHistoryData)?.map((item)=>{
                return(
                  <Stack sx={{
                    alignItems:"center"
                  }} direction="row" spacing={2}>
                  <Typography sx={{marginBottom:"0px", color:"#8366b1"}} variant="subtitle1" gutterBottom>
                    {`${item[0]}:`}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                  {item[1]}
                  </Typography>
                      
                    </Stack>
                )
              })
            }
          
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                  getHistory(comboHistoryData.combo_id)
              }}
            >
              History
            </Button>
            <Button variant="outlined" color="error" onClick={()=> setOpenHistoryDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default Home;
