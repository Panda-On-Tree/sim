import React, { useRef, useState } from "react";
import { TextField, Autocomplete, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem, InputLabel, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { baseurl } from "../../api/apiConfig";
import "./Home.css";
import { toast } from "react-toastify";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from '@mui/x-data-grid';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment/moment";
function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [radioEdit, setRadioEdit] = useState("")
  const [openAddNewCN, setOpenAddNewCN] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddNewDialog, setOpenAddNewDialog] = useState(false)
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [socketList, setSocketList] = useState();
  const [bomList, setBomList] = useState();
  const [editComboNumber, setEditComboNumber] = useState({
    combo_id: "",
    ecn_number: "",
    ecn_implementation_date: "",
    employee_id:localStorage.getItem("employee_id")
  })
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

  const [comboData, setComboData] = useState([])


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
    if(radioEdit == 1){
        console.log(editComboNumber);
        axios({
            method: "post",
            url: `${baseurl.base_url}/sim/edit-combo-code-set-inactive`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data:editComboNumber,
          })
          .then((res)=>{
            console.log(res);
          })
          .catch((err)=>{
            console.log(err);
          })
    }
    else if(radioEdit == 2){
        console.log(editComboNumber);
        axios({
            method: "post",
            url: `${baseurl.base_url}/sim/edit-combo-code-set-obsolete`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data:editComboNumber,
          })
          .then((res)=>{
            console.log(res);
          })
          .catch((err)=>{
            console.log(err);
          })
        
    }
    else if(radioEdit == 3){
        console.log(editComboNumber);
        axios({
            method: "post",
            url: `${baseurl.base_url}/sim/edit-combo-code-add-ecn`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data:editComboNumber,
          })
          .then((res)=>{
            console.log(res);
          })
          .catch((err)=>{
            console.log(err);
            toast.error(err.response.data.message)
          })
    }
    else{
        alert("Select One First")
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
          return
        }
        setComboData(res.data.data)


      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }


  function postComboNumberData(){
    console.log(sendComboNumberData);
    axios({
        method: "post",
        url: `${baseurl.base_url}/sim/add-new-combo-number`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data:sendComboNumberData,
      })
        .then((res) => {
          toast.success(res.data.message)
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
  }

  function postAddNewComboNumberData(){
    console.log(sendComboNumberData);
    axios({
        method: "post",
        url: `${baseurl.base_url}/sim/add-new-combo-number-pre-combo`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data:sendComboNumberData,
      })
      .then((res) => {
        toast.success(res.data.message)
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

  const columns = [
   
     
    { field: 'id', headerName: 'Sr. No.',maxWidth: 60,sortable:false, renderCell:(params) => {
        return(params.id + 1)
    }},
    { field: 'product_name', headerName: 'Product Name',minWidth: 150,sortable:false},
    { field: 'product_code', headerName: 'Product Code',minWidth: 100,sortable:false},
    { field: 'model_name', headerName: 'Model Name',minWidth: 170,sortable:false},
    { field: 'model_code', headerName: 'Model Code',minWidth: 100,sortable:false},
    { field: 'sap_part_code', headerName: 'SAP Part Code',maxWidth: 90,sortable:false},
    { field: 'combo_code', headerName: 'Combo Code',maxWidth: 70,sortable:false},
    { field: 'combo_id',hide:true, headerName: 'Combo ID',minWidth: 100,sortable:false},  
    { field: 'socket_type', headerName: 'Socket Type',minWidth: 150,sortable:false},
    { field: 'bom_type',hide:true, headerName: 'Bom Type',minWidth: 150,sortable:false},
    { field: 'combo_description', headerName: 'Combo Description',minWidth: 150,sortable:false},
    { field: 'ecn_mjo_number', headerName: 'ECN No.',minWidth: 90,sortable:false},
    { field: 'ecn_impl_date', headerName: 'ECN Date',minWidth: 100,sortable:false },
    { field: 'is_productive', headerName: 'In Prod',maxWidth: 80,sortable:false, valueFormatter: (params) => {
        if (params.value == "1") {
          return "True";
        }
        else if (params.value == "0") {
          return "False";
        }
      },},
    { field: 'is_rnd', headerName: 'R&D',maxWidth: 60,sortable:false, valueFormatter: (params) => {
        if (params.value == "1") {
          return "True";
        }
        else if (params.value == "0") {
          return "False";
        }
      },},
    {field: 'edit_add_new', headerName: 'Edit/Add New',minWidth: 200,sortable:false, renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 5 }}
            onClick={()=>{
                setEditComboNumber({...editComboNumber,combo_id:params.row.combo_id})
                setOpenEditDialog(true)
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={()=>{
                setSendComboNumberData({...sendComboNumberData,prev_combo_id:params.row.combo_id})
                setOpenAddNewDialog(true)}}
          >
            Add New
          </Button>
        </>
      ),},
  ];

 function handleGetRowId(e){
    return comboData.indexOf(e);
  }

  return (
    <div>
      <div className="home-autocomplete-input-main">
        <Autocomplete
          className="autocomp-input"
          onChange={(event, newValue) => {
            if (newValue?.id) {
              model_product_id.current.product_name = newValue.product_name;
              model_product_id.current.product_id = newValue.id;
              setSendComboNumberData({...sendComboNumberData,product_id:newValue.id})
              fetchModelList(newValue?.id);
            }
          }}
        
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) => `${option.product_name} (${option.product_code})`}
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
              setSendComboNumberData({...sendComboNumberData,model_id:newValue.id})

            }
          }}
          disablePortal
          id="combo-box-demo"
          getOptionLabel={(option) => `${option.model_name} (${option.model_code})`}
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
            <TextField id="ecn" label="ECN Number" variant="outlined" onChange={(e)=>{
                setSendComboNumberData({...sendComboNumberData,ecn_number:e.target.value})
            }} />
            <FormControl>
              <InputLabel id="bom-select-label">Bom</InputLabel>
              <Select defaultValue="" labelId="bom-select-label" id="bom-select" label="bom" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,bom_id:e.target.value})
              }}>
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
              <Select defaultValue="" labelId="socket-select-label" id="socket-select" label="Socket Type" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,socket_id:e.target.value})
                
              }}>
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
              <Select defaultValue="" labelId="type-select-label" id="type-select" label="Type" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,type:e.target.value})

              }}>
                <MenuItem id="emd" value="rnd">
                  RnD
                </MenuItem>
                <MenuItem id="prod" value="prod">
                  Production
                </MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label="Ecn Implementation Date" value={sendComboNumberData.ecn_implementation_date}  onChange={(newValue) => {
               
                setSendComboNumberData({...sendComboNumberData,ecn_implementation_date:moment(newValue._d).format('YYYY-MM-DD')})
              }} renderInput={(params) => <TextField {...params} />} />
            </LocalizationProvider>

            <TextField id="ecn" label="Combo Description" variant="outlined" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,combo_description:e.target.value})
            }} />
          </DialogContent>
          <DialogActions>
            <Button size="large" variant="outlined" onClick={() =>{
                postComboNumberData()
                setOpenAddNewCN(false)}}>
              Create New
            </Button>
            <Button size="large" variant="outlined" color="error" onClick={() => setOpenAddNewCN(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="home-table" sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={comboData}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5,20,100]}
        getRowId={handleGetRowId}
        /* getRowHeight={() => 'auto'} */
      />       
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
        onChange={(e)=>
        {
            setRadioEdit(e.target.value)
            console.log(e.target.value);
        }}
      >
        <FormControlLabel value="1"  control={<Radio />} label="Mark In-active" />
        <FormControlLabel value="2" control={<Radio />} label="Mark Obsolete" />
        <FormControlLabel value="3" control={<Radio />} label="Link New ECN" />

      </RadioGroup>
             {
                radioEdit == 3? <div className="edit-radio-dialog-input-main">
                    <TextField sx={{
                    "marginTop":'10px'
                }} id="outlined-basic" label="Enter New ECN" variant="outlined" onChange={(e)=>{setEditComboNumber({...editComboNumber,ecn_number:e.target.value})}} />
                  <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label="Ecn Implementation Date" value={editComboNumber.ecn_implementation_date} onChange={(newValue)=>{
                console.log(newValue);
                console.log(moment(newValue._d).format('YYYY-MM-DD'))
                setEditComboNumber({...editComboNumber,ecn_implementation_date:moment(newValue._d).format('YYYY-MM-DD')})}}   
             renderInput={(params) => <TextField {...params} />} />
            </LocalizationProvider>
                </div>:""
            }
    </FormControl>
           
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                sendEditComboNumber()
              }}
            >
              Update
            </Button>
            <Button variant="outlined" color="error" onClick={()=>{
                setRadioEdit("")
                setOpenEditDialog(false)}}>
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
            <TextField id="ecn" label="ECN Number" variant="outlined" onChange={(e)=>{
                setSendComboNumberData({...sendComboNumberData,ecn_number:e.target.value})
            }} />
            <FormControl>
              <InputLabel id="bom-select-label">Bom</InputLabel>
              <Select defaultValue="" labelId="bom-select-label" id="bom-select" label="bom" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,bom_id:e.target.value})
              }}>
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
              <Select defaultValue="" labelId="socket-select-label" id="socket-select" label="Socket Type" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,socket_id:e.target.value})
                
              }}>
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
              <Select defaultValue="" labelId="type-select-label" id="type-select" label="Type" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,type:e.target.value})

              }}>
                <MenuItem id="emd" value="rnd">
                  RnD
                </MenuItem>
                <MenuItem id="prod" value="prod">
                  Production
                </MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker label="Ecn Implementation Date" value={sendComboNumberData.ecn_implementation_date}  onChange={(newValue) => {
                console.log(moment(newValue._d).format('YYYY-MM-DD'));
                setSendComboNumberData({...sendComboNumberData,ecn_implementation_date:moment(newValue._d).format('YYYY-MM-DD')})
              }} renderInput={(params) => <TextField {...params} />} />
            </LocalizationProvider>

            <TextField id="ecn" label="Combo Description" variant="outlined" onChange={(e)=>{
                    setSendComboNumberData({...sendComboNumberData,combo_description:e.target.value})
            }} />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                postAddNewComboNumberData()
              }}
            >
              Create New
            </Button>
            <Button variant="outlined" color="error" onClick={()=>{setOpenAddNewDialog(false)}}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default Home;
