import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import "./Serial.css";


function Serial() {

    const [openDialog, setOpenDialog] = useState(false)
const [continueButtonTwo, setContinueButtonTwo] = useState(false)
    const [showPlantProdInput, setShowPlantProdInput] = useState(false)
  const [productList, setProductList] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [comboData, setComboData] = useState();
  const [plantList, setPlantList] = useState([])
  const [prodLineList, setProdLineList] = useState([])

  const [serialGenData, setSerialGenData] = useState({
    combo_id:"",
    plant_id:"",
    model_id:"",
    product_id:""
  })



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
        console.log(res);
        setComboData(res.data.data.splice(0,3));
        handleNext()
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  }

  useQuery("plant-list", getplant)

  function getplant(){
    axios({
        method: "get",
        url: `${baseurl.base_url}/sim/get-plant`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
        console.log(res.data.data);
        setPlantList(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
  }

  function sendSerialGenData(){
    console.log(serialGenData);
    axios({
        method: "post",
        url: `${baseurl.base_url}/sim/get-serial-number-history`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data:serialGenData
      })
      .then((res) => {
        console.log(res);
        
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
  }

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
        <Box sx={{ maxWidth: '100%' }}>
      <Stepper activeStep={activeStep} orientation="vertical">
       
          <Step >
            <StepLabel>
              Select Product And Model
            </StepLabel>
            <StepContent>
            <div className="home-autocomplete-input-main">
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
           
        </div>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={()=>{
                        
                        getComboCode()
                    }}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {/* index === steps.length - 1 ? 'Finish' :  */'Continue'}
                  </Button>
                  <Button
                     disabled
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step >
            <StepLabel>
              Select One Combo
            </StepLabel>
            <StepContent>
            <FormControl>
            
            <RadioGroup
                value={serialGenData.combo_id}
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={(e)=>{
                    console.log(e.target.value);
                    setSerialGenData({...serialGenData,combo_id:e.target.value})
              }}
            >
              {comboData?.map((item,i) => {
                return( 
                <FormControlLabel onSelect={(e)=>{
                    console.log(e.target.value);
                }} key={i} value={i} control={<Radio />} label={`Combo Code: ${item.combo_code}, ECN No. : ${item.ecn_mjo_number},  Socket Type: ${item.socket_type}, ${item.is_rnd?"Prod":""}${item.is_productive?"R&D":""} `} />
                )
              })}
            </RadioGroup>
        </FormControl>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={()=>{
                        if(serialGenData.combo_id){
                            handleNext()
                        }
                        else{
                            toast.error("Please Select  One")
                        }
                    }}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {/* index === steps.length - 1 ? 'Finish' :  */'Continue'}
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
          <Step >
            <StepLabel>
              Select Plant And Production Line
            </StepLabel>
            <StepContent>
            <div style={{"display":"flex","gap":"30px","marginTop":"7   vh"}} className="">
        <Autocomplete
          className="autocomp-input"
          onChange={(event, newValue) => {
            if (newValue?.id) {
                fetchProdList(newValue.id)
                setSerialGenData({...serialGenData,plant_id:newValue.id})
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
                setContinueButtonTwo(true)
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
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {/* index === steps.length - 1 ? 'Finish' :  */'Continue'}
                  </Button>
                  <Button
                    /* disabled={index === 0} */
                    onClick={()=>{
                        handleBack()
                    }}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        
      </Stepper>
      {activeStep === 3 && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
        </div> 
    </div>
  );
}

export default Serial;
