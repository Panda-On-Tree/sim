import { Autocomplete, Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Stack, Step, StepContent, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import "./Serial.css";

function Serial() {
  const [showSerialNumberData, setShowSerialNumberData] = useState();
  const [serialHistoryDataTable, setSerialHistoryDataTable] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [continueButtonTwo, setContinueButtonTwo] = useState(false);
  const [showPlantProdInput, setShowPlantProdInput] = useState(false);
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [comboData, setComboData] = useState();
  const [plantList, setPlantList] = useState([]);
  const [prodLineList, setProdLineList] = useState([]);

  const [serialGenData, setSerialGenData] = useState({
    combo_id: "",
    plant_id: "",
    model_id: "",
    product_id: "",
    prodline_id: "",
    quantity: "",
    employee_id: localStorage.getItem("employee_id"),
  });

  const model_product_id = useRef({
    model_id: "",
    product_id: "",
    product_name: "",
    model_name: "",
  });
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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
  function fetchProdList(value) {
    const data = {
      plant_id: value,
    };
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-prodline`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    })
      .then((res) => {
        console.log(res.data.data);
        setProdLineList(res.data.data);
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
        console.log(res)
        res.data?.data?.map(item=>{
          console.log(item);
        })
        setComboData(res.data.data);
        if(!res.data.data?.length){
            alert("No Combo Code Found ! \n Please Create Atleast one active combo code")
            handleReset()
            return
        }
        handleNext();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  useQuery("plant-list", getplant);

  function getplant() {
    axios({
      method: "get",
      url: `${baseurl.base_url}/sim/get-plant`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setPlantList(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  function sendSerialGenData() {
    console.log(serialGenData);
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/get-serial-number-history`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: serialGenData,
    })
      .then((res) => {
        console.log(res);
        if (!res.data.success) {
          setOpenDialog(true);
          return;
        }
        setSerialHistoryDataTable(res.data.data);
        handleNext();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  function sendCreateSerialNumber() {
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/create-serial-number`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: serialGenData,
    })
      .then((res) => {
        setOpenDialog(false);
        sendSerialGenData();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function sendGenSerialNumberList() {
    console.log(serialGenData);
    axios({
      method: "post",
      url: `${baseurl.base_url}/sim/generate-serial-number-list`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: serialGenData,
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setShowSerialNumberData(res.data.data);
          handleNext();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function copyFun() {
    console.log(
      Object.entries(showSerialNumberData)
        .map((item) => {
          return `${item[0]}\t${item[1]}`;
        })
        .join("\n")
    );
    navigator.clipboard.writeText(
      `${Object.entries(showSerialNumberData)
        .map((item) => {
          return `${item[0]}\t${item[1]}`;
        })
        .join("\n")}`
    );
  }
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [createData("Frozen yoghurt", 159, 6.0, 24, 4.0), createData("Ice cream sandwich", 237, 9.0, 37, 4.3), createData("Eclair", 262, 16.0, 24, 6.0), createData("Cupcake", 305, 3.7, 67, 4.3), createData("Gingerbread", 356, 16.0, 49, 3.9)];
  return (
    <div>
      {/*  <div className="home-autocomplete-input-main">
            <Autocomplete
            className="autocomp-input"
            onChange={(event, newValue) => {
                if (newValue?.id) {
                model_product_id.current.product_id = newValue.id;
                setSerialGenData({...serialGenData,product_id:newValue.id})

                // setSendComboNumberData({ ...sendComboNumberData, product_id: newValue.id });
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
                model_product_id.current.model_id = newValue.id;
                setSerialGenData({...serialGenData,model_id:newValue.id})
                //setSendComboNumberData({ ...sendComboNumberData, model_id: newValue.id });
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
        </div> */}

      <div className="combo-radio-main">
        <Box sx={{ maxWidth: "100%" }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel sx={{fontSize:"1rem"}}>Select Product And Model</StepLabel>
              <StepContent>
                <div style={{ marginTop: "20px", marginBottom: "15px" }} className="home-autocomplete-input-main">
                  <Autocomplete
                    className="autocomp-input"
                    /* value={serialGenData.product_id} */
                    onChange={(event, newValue) => {
                      if (newValue?.id) {
                        model_product_id.current.product_id = newValue.id;
                        setSerialGenData({ ...serialGenData, product_id: newValue.id });

                        // setSendComboNumberData({ ...sendComboNumberData, product_id: newValue.id });
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
                        model_product_id.current.model_id = newValue.id;
                        setSerialGenData({ ...serialGenData, model_id: newValue.id });
                        //setSendComboNumberData({ ...sendComboNumberData, model_id: newValue.id });
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
                </div>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        getComboCode();
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {/* index === steps.length - 1 ? 'Finish' :  */ "Continue"}
                    </Button>
                    <Button disabled onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Select One Combo</StepLabel>
              <StepContent>
                <FormControl>
                  <RadioGroup
                    style={{ marginTop: "20px", marginBottom: "15px" }}
                    value={serialGenData.combo_id}
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setSerialGenData({ ...serialGenData, combo_id: e.target.value });
                    }}
                  >
                    {comboData?.map((item, i) => {
                      return (
                        <FormControlLabel
                          onSelect={(e) => {
                            console.log(e.target.value);
                          }}
                          key={i}
                          value={item.combo_id}
                          control={<Radio />}
                          label={`Combo Code: ${item.combo_code}, ECN No. : ${item.ecn_mjo_number},  Socket Type: ${item.socket_type}, || ${item.is_rnd ? "R&D" : ""}${item.is_productive ? "Prod" : ""} `}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        if (serialGenData.combo_id) {
                          handleNext();
                        } else {
                          toast.error("Please Select  One");
                        }
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {/* index === steps.length - 1 ? 'Finish' :  */ "Continue"}
                    </Button>
                    <Button
                      /* disabled={index === 0} */
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Select Plant And Production Line</StepLabel>
              <StepContent>
                <div style={{ display: "flex", gap: "30px", marginTop: "20px", marginBottom: "15px" }} className="">
                  <Autocomplete
                    className="autocomp-input"
                    onChange={(event, newValue) => {
                      if (newValue?.id) {
                        fetchProdList(newValue.id);
                        setSerialGenData({ ...serialGenData, plant_id: newValue.id });
                      }
                    }}
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => `${option.plant_name} (${option.plant_code})`}
                    options={plantList}
                    sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Plant Name"
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
                        setSerialGenData({ ...serialGenData, prodline_id: newValue.id });
                      }
                    }}
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => `${option.prod_line_name} (${option.prod_line_code})`}
                    options={prodLineList}
                    sx={{ width: 280 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ProdLine Name"
                        inputProps={{
                          ...params.inputProps,
                        }}
                      />
                    )}
                  />
                </div>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        sendSerialGenData();
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {/* index === steps.length - 1 ? 'Finish' :  */ "Continue"}
                    </Button>
                    <Button
                      /* disabled={index === 0} */
                      onClick={() => {
                        handleBack();
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Create Serial Numbers</StepLabel>
              <StepContent>
                <div style={{ marginTop: "20px", marginBottom: "15px" }}>
                  <TextField
                    id="quantut"
                    size="small"
                    label="Serial Number Quantity"
                    variant="outlined"
                    onChange={(e) => {
                      setSerialGenData({ ...serialGenData, quantity: e.target.value });
                    }}
                  />
                  <TableContainer sx={{ maxWidth: 800, marginTop: "30px" }} component={Paper}>
                    <Table sx={{ maxWidth: 800 }} size="small" aria-label="a dense table">
                      <TableHead className="table-head-history">
                        <TableRow>
                          <TableCell>Series Starting</TableCell>
                          <TableCell align="right">Series Ending</TableCell>
                          <TableCell align="right">Created By</TableCell>
                          <TableCell align="right">Created Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {serialHistoryDataTable?.map((row, i) => (
                          <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              {row?.series_starting}
                            </TableCell>
                            <TableCell align="right">{row?.series_ending}</TableCell>
                            <TableCell align="right">{row?.created_by}</TableCell>
                            <TableCell align="right">{row?.created_at?.split("T").join("  ").split(".")[0]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                        {serialHistoryDataTable.length? "" :<p style={{textAlign:"center"}}>No Previous Data</p>}
                  </TableContainer>
                </div>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        sendGenSerialNumberList();
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {/* index === steps.length - 1 ? 'Finish' :  */ "Continue"}
                    </Button>
                    <Button
                      /* disabled={index === 0} */
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Data</StepLabel>
              <StepContent>
                <Card sx={{ maxWidth: 700 }}>
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button
                      onClick={() => {
                        copyFun();
                      }}
                      size="small"
                    >
                      Copy
                    </Button>
                  </CardActions>
                  <CardContent sx={{ display: "flex" }}>
                    <Stack direction="row" spacing={10}>
                      <Stack className="serial-stack">
                        <Typography variant="body2" component="div">
                          Product Name:
                        </Typography>
                        <Typography variant="body2" component="div">
                          Model Name:
                        </Typography>
                        <Typography variant="body2" component="div">
                          Sap Part Code:
                        </Typography>
                        <Typography variant="body2" component="div">
                          ECN Number:
                        </Typography>
                        <Typography variant="body2" component="div">
                          Socket Type:
                        </Typography>
                        <Typography variant="body2" component="div">
                          Type:
                        </Typography>
                        <Typography variant="body2" component="div">
                          Serial Number Starting:
                        </Typography>
                        <Typography variant="body2" component="div">
                          Serial Number Ending:
                        </Typography>
                      </Stack>
                      <Stack className="serial-stack">
                        <Typography variant="subtitle2">{showSerialNumberData?.product_name}</Typography>
                        <Typography variant="subtitle2">{showSerialNumberData?.model_name}</Typography>
                        <Typography variant="subtitle2">{showSerialNumberData?.sap_part_code ? showSerialNumberData.sap_part_code : "Null"}</Typography>
                        <Typography variant="subtitle2">{showSerialNumberData?.ecn_mjo_number}</Typography>
                        <Typography variant="subtitle2">{showSerialNumberData?.socket_type}</Typography>
                        <Typography variant="subtitle2">{showSerialNumberData?.socket_type}</Typography>
                        <Typography variant="subtitle2">{showSerialNumberData?.serial_number_start}</Typography>
                        <Typography variant="subtitle2">{showSerialNumberData?.serial_number_end}</Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                <Box sx={{ mb: 2 }}>
                  <div style={{"marginTop":"20px"}}>
                  <Typography>Serial Number Series Successfully Generated - you&apos;re finished</Typography>
                  <Typography variant="body2">(Use Copy Buttton to copy to Excel)</Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        handleReset()
                        setSerialGenData(
                            {
                                combo_id: "",
                                plant_id: "",
                                model_id: "",
                                product_id: "",
                                prodline_id: "",
                                quantity: "",
                                employee_id: localStorage.getItem("employee_id"),
                            }
                        )
                        model_product_id.current = {
                          model_id: "",
                          product_id: "",
                          product_name: "",
                          model_name: "",
                        }
                      }}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {/* index === steps.length - 1 ? 'Finish' :  */ "Finish"}
                    </Button>
                   
                  </div>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
          {/* {activeStep === 4 && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )} */}
        </Box>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Information</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Serial Number With Provided Information Does Not Exist Previously. Do you Want to create?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              sendCreateSerialNumber();
            }}
          >
            Create
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setOpenDialog(false);
            }}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Serial;
