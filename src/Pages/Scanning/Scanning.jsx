import { Autocomplete, Button, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import "./Scanning.css";
function Scanning() {
	const [productList, setProductList] = useState([]);
	const [modelList, setModelList] = useState([]);
	const [sendTempdata, setSendTempdata] = useState({
		product_id: "",
		model_id: "",
	});
	const [templateData, setTemplateData] = useState();
	const [serialPartMapping, setSerialPartMapping] = useState({
		product_id: "",
		model_id: "",
		serial_number: "",
		employee_id: localStorage.getItem("employee_id"),
	});
    const [partLookupData, setPartLookupData] = useState([])

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

	function fetchPartTemplate() {
		axios({
			method: "post",
			url: `${baseurl.base_url}/sim/get-part-template`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data: sendTempdata,
		})
			.then((res) => {
				console.log(res);
				setTemplateData(res.data.data);
                let array =[];
                for (const item of res.data.data) {
                    array.push({id:item.id, serial_number:""})
                }
                console.log(array);
                setPartLookupData(array)

			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response.data.message);
			});
	}

    function sendSerialPartMapping(){
        console.log(serialPartMapping)
        const data = serialPartMapping
        data.part_lookup = partLookupData;
        console.log(data);
        
        axios({
			method: "post",
			url: `${baseurl.base_url}/sim/store-serial-part-mapping`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
            data
		})
        .then((res)=>{
            console.log(res);
            toast.success(res.data.message)
        })
        .catch((err)=>{
            toast.error(err.response.data.message)
        })
    }

	return (
		<div>
			<div className="home-autocomplete-input-main">
				<Autocomplete
					className="autocomp-input"
					onChange={(event, newValue) => {
						if (newValue?.id) {
							fetchModelList(newValue?.id);
							setSendTempdata({ ...sendTempdata, product_id: newValue.id });
                            setSerialPartMapping({...serialPartMapping, product_id:newValue.id})
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
							setSendTempdata({ ...sendTempdata, model_id: newValue.id });
                            setSerialPartMapping({...serialPartMapping, model_id:newValue.id})

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
				<Button
					size="large"
					style={{ width: "150px" }}
					variant="contained"
					onClick={() => {
						fetchPartTemplate();
					}}>
					Search
				</Button>
			</div>
			<Box sx={{ border: "1px solid rgba(0, 0, 0, 0.12)", borderRadius: "10px", height: "60vh", width: "80%", margin: "30px 0px 0px 0px", padding: "15px" }}>
				<TextField margin="dense"  sx={{ width: "400px"}} label="Serial Number" onChange={(e)=>{
                    setSerialPartMapping({...serialPartMapping, serial_number:e.target.value})
                }}></TextField>
				<div style={{ marginTop: "5vh" }}>
					{templateData?.map((item) => {
						return (
							<Box display="flex" gap="40px" alignItems="center" justifyContent="space-between" marginBottom="4vh" padding="0px 20vw 0px 0px">
								<div>
									<Typography>Product Name : {item.product_name}</Typography>
									<Typography>Model Name : {item.model_name} </Typography>
								</div>
								<TextField size="small" onChange={(e)=>{
                                    setPartLookupData([...partLookupData].map(object =>{
                                        if(item.id == object.id){
                                            return{
                                                ...object,
                                                serial_number:e.target.value
                                            }
                                        }
                                        else return object;
                                    }))

                                }}></TextField>
							</Box>
						);
					})}
				</div>
				{templateData?<Button sx={{ marginTop: "20px" }} variant="contained" size="large" onClick={()=>{
                    sendSerialPartMapping()
                    
                }}>
					Send Data
				</Button>:null}
			</Box>
		</div>
	);
}

export default Scanning;
