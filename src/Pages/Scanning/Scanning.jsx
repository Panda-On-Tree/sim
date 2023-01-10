import { Autocomplete, Button, Paper, TextField, Typography, Box, Stepper, Step, StepLabel, StepContent, Stack, TableRow, TableCell } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useState, useCallback, useRef } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import { debounce } from "lodash";
import "./Scanning.css";

function Scanning() {
	//const [focused, setFocused] = useState(1);
	const [productList, setProductList] = useState([]);
	const [modelList, setModelList] = useState([]);
	const [submitFocus, setSubmitFocus] = useState(false);
	const [templateDataLength, setTemplateDataLength] = useState(0);
	const [sendTempdata, setSendTempdata] = useState({
		product_id: "",
		model_id: "",
	});
	const [templateData, setTemplateData] = useState();
	const [serialPartMapping, setSerialPartMapping] = useState({
		product_id: "",
		model_id: "",
		serial_number: "",
		plant_id: "",
		prodline_id: "",
		qc_incharge: "",
		line_incharge: "",
		employee_id: localStorage.getItem("employee_id"),
	});
	const [partLookupData, setPartLookupData] = useState([]);
	const [plantList, setPlantList] = useState([]);
	const [prodLineList, setProdLineList] = useState([]);
	const [lastScanData, setLastScanData] = useState([]);
	const [lastSignleScanData, setLastSingleScanData] = useState();
	const [showStepper, setShowStepper] = useState(false);
	const [lastScannedData, setLastScannedData] = useState();
	useQuery("product-list", fetchProductList);
	const focused = useRef(1);
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
	useQuery("plant-list", getplant);

	useQuery("get-last-scans", getLastScans);
	function getLastScans() {
		axios({
			method: "get",
			url: `${baseurl.base_url}/sim/get-last-scans`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				console.log(res.data.data);
				setLastScanData(res.data.data);
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response.data.message);
			});
	}

	//useQuery("get-last-single-scan", getLastSingleScans);
	function getLastSingleScans() {
		axios({
			method: "get",
			url: `${baseurl.base_url}/sim/get-last-single-scans`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => {
				console.log(res.data.data);
				setLastSingleScanData(res.data.data);
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response.data.message);
			});
	}

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
				let array = [];
				for (const item of res.data.data) {
					array.push({ id: item.id, serial_number: "" });
				}
				console.log(array);
				setPartLookupData(array);
				focused.current = 1;
				setTemplateDataLength(array.length);
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response.data.message);
			});
	}

	function sendSerialPartMapping() {
		console.log(serialPartMapping);
		const data = serialPartMapping;
		data.part_lookup = partLookupData;
		console.log(data);
		setLastScannedData(data);

		axios({
			method: "post",
			url: `${baseurl.base_url}/sim/store-serial-part-mapping`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data,
		})
			.then((res) => {
				console.log(res);
				toast.success(res.data.message);
				setSerialPartMapping({ ...serialPartMapping, serial_number: "" });

				fetchPartTemplate();
				getLastScans();
				handleReset();
			})
			.catch((err) => {
				toast.error(err.response.data.message);
				setSerialPartMapping({ ...serialPartMapping, serial_number: "" });
				fetchPartTemplate();
				handleReset();
			});
	}

	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		focused.current = focused.current + 1
		//setFocused(focused + 1);
		console.log(focused);
		console.log(activeStep);
		console.log(templateDataLength);
		if (activeStep === templateDataLength) {
			setSubmitFocus(true);
		}
	};
	const handleDebounce = useCallback(debounce(handleNext, 800), [])
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
		focused.current = focused.current - 1
		//setFocused(focused - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		focused.current = 1
		//setFocused(1);
		setSubmitFocus(false);
	};

	const options = {
		tableBodyMaxHeight: "64vh",
		responsive: "standard",
		selectableRowsHideCheckboxes: true,
		sort: false,
		rowsPerPage: 15,
		viewColumns: false,
		expandableRows: true,
		expandableRowsHeader: false,
		expandableRowsOnClick: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const colSpan = rowData.length + 1;
            console.log(rowMeta);
            return (
                <TableRow>
                    <TableCell colSpan={colSpan}>
                        <Stack sx={{p:2}} direction="row" spacing={2}>
                            {lastScanData[rowMeta.dataIndex]?.child?.map((item,i)=>{
                                return(
                                    <Paper key={i} sx={{display:'flex', flexDirection:'column', gap:'10px', p:2, flexWrap:'wrap'}}>
                                    <Box sx={{display:'flex', minWidth:'200px', gap:'20px', justifyContent:'space-between'}}><Typography variant="body2" >Product Name</Typography><Typography variant="body2">{item.product_name}</Typography></Box>
                                    <Box sx={{display:'flex', minWidth:'200px', gap:'20px', justifyContent:'space-between'}}><Typography variant="body2">Model Name</Typography><Typography variant="body2">{item.model_name}</Typography></Box>
                                    <Box sx={{display:'flex', minWidth:'200px', gap:'20px' , justifyContent:'space-between'}}><Typography variant="body2">Serial Number</Typography><Typography variant="body2">{item.serial_number}</Typography></Box>  
                                </Paper>
                                )
                            })}
                           
                        </Stack>
                    </TableCell>
              </TableRow>
            );
          },
	};
	const columns = [
		{ name: "product_name", label: "Product Name", options: { filter: true, sort: true } },
		{ name: "model_name", label: "Model Name", options: { filter: true, sort: true } },
		{ name: "plant_location", label: "Plant Location", options: { filter: true, sort: true } },
		{ name: "prod_line_name", label: "ProdLine Name", options: { filter: true, sort: true } },
		{ name: "serial_number", label: "Serial Number", options: { filter: true, sort: true } },
		{ name: "qc_incharge", label: "QC Incharge", options: { filter: true, sort: true } },
		{ name: "line_incharge", label: "Line Incharge", options: { filter: true, sort: true } },
		{ name: "created_by", label: "Scanned By", options: { filter: true, sort: true } },
	];
	return (
		<div>
			<div className="home-autocomplete-input-main">
				<Autocomplete
					className="autocomp-input"
					onChange={(event, newValue) => {
						if (newValue?.id) {
							fetchModelList(newValue?.id);
							setSendTempdata({ ...sendTempdata, product_id: newValue.id });
							setSerialPartMapping({ ...serialPartMapping, product_id: newValue.id });
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
							setSerialPartMapping({ ...serialPartMapping, model_id: newValue.id });
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
				<Autocomplete
					className="autocomp-input"
					onChange={(event, newValue) => {
						if (newValue?.id) {
							setSerialPartMapping({ ...serialPartMapping, plant_id: newValue.id });
							fetchProdList(newValue.id);
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
							setSerialPartMapping({ ...serialPartMapping, prodline_id: newValue.id });
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
			<Box sx={{ display: "flex", gap: "20px", mt: 3, flexWrap: "wrap" }}>
				<TextField sx={{ minWidth: "300px" }} onChange={(e) => setSerialPartMapping({ ...serialPartMapping, qc_incharge: e.target.value })} size="small" label="QC Incharge"></TextField>
				<TextField sx={{ minWidth: "300px" }} onChange={(e) => setSerialPartMapping({ ...serialPartMapping, line_incharge: e.target.value })} size="small" label="Line Incharge"></TextField>
				<Button
					sx={{ width: "150px" }}
					/* disabled={()=>{
                    if(serialPartMapping.plant_id&&serialPartMapping.prodline_id&&serialPartMapping.qc_incharge&&serialPartMapping.line_incharge){
                        return false
                    }
                    return false
                }} */ disabled={false}
					variant="contained"
					onClick={() => setShowStepper(true)}>
					Save
				</Button>
			</Box>

			<Paper elevation={3} sx={{ minHeight: "60vh", mt: 6, mb: 10, padding: "1px", position: "relative" }}>
				<div style={{ overflow: "hidden" }}>
					{lastScannedData ? (
						<Stack className="last-scans" sx={{ mt: 3, ml: 6, p: "5px", overflowX: "auto" }} direction="row" spacing={2}>
							<Paper sx={{ p: 1 }}>
								<Typography sx={{ minWidth: "max-content" }} variant="subtitle2">
									Last Scanned Master Serial No :
								</Typography>
								<Typography sx={{ color: "rgba(0, 0, 0, 0.7)", minWidth: "max-content" }} variant="subtitle1">
									{lastScannedData.serial_number.toUpperCase()}
								</Typography>
							</Paper>
							{lastScannedData.part_lookup.map((item) => {
								return (
									<Paper sx={{ p: 1 }}>
										<Typography variant="subtitle2">Part Name :</Typography>
										<Typography sx={{ color: "rgba(0, 0, 0, 0.7)", minWidth: "max-content" }} variant="subtitle1">
											Serial Number: {item.serial_number.toUpperCase()}
										</Typography>
									</Paper>
								);
							})}
						</Stack>
					) : (
						<Typography></Typography>
					)}
				</div>
				{templateData && showStepper ? (
					<Box sx={{ maxWidth: 800, p: 5 }}>
						<Stepper activeStep={activeStep} orientation="vertical">
							{templateData ? (
								<Step>
									<StepLabel>Scan Main Serial Number To Start</StepLabel>
									<StepContent>
										<TextField
											value={serialPartMapping.serial_number}
											autoFocus={focused.current == 1 ? true : false}
											focused={focused.current == 1 ? true : false}
											size="small"
											sx={{ width: "400px", mt: 3 }}
											label="Serial Number"
											inputProps={{ style: { textTransform: "uppercase" } }}
											onChange={(e) => {
												setSerialPartMapping({ ...serialPartMapping, serial_number: e.target.value });
												handleDebounce();
												/* if (e.target.value.length === 18) {
													handleNext();
												} */
											}}></TextField>
										<Box sx={{ mb: 2, mt: 2 }}>
											<div>
												{/* <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
											Continue
										</Button> */}
												<Button disabled onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
													Back
												</Button>
											</div>
										</Box>
									</StepContent>
								</Step>
							) : null}
							{templateData?.map((item, i) => {
								return (
									<Step key={i}>
										<StepLabel>Scan For Model Name : {item.model_name}</StepLabel>
										<StepContent>
											<Box display="flex" gap="40px" alignItems="center" mt={2} justifyContent="space-between" marginBottom="2vh">
												<div>
													<Typography sx={{ color: "GrayText" }}>Product Name : {item.product_name}</Typography>
													<Typography sx={{ color: "GrayText" }}>Model Name : {item.model_name} </Typography>
												</div>
												<TextField
													sx={{ minWidth: "300px" }}
													value={
														partLookupData.filter((prop) => {
															if (prop.id == item.id) {
																return prop;
															}
														})[0].serial_number
													}
													inputProps={{ style: { textTransform: "uppercase" } }}
													focused={focused.current == i + 2 ? true : false}
													autoFocus={focused.current == i + 2 ? true : false}
													size="small"
													onChange={(e) => {
														setPartLookupData(
															[...partLookupData].map((object) => {
																if (item.id == object.id) {
																	return {
																		...object,
																		serial_number: e.target.value,
																	};
																} else return object;
															})
														);
														handleDebounce()
													}}></TextField>
											</Box>
											<Box sx={{ mb: 2, mt: 2 }}>
												<div>
													<Button disabled variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
														Continue
													</Button>
													<Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
														Back
													</Button>
												</div>
											</Box>
										</StepContent>
									</Step>
								);
							})}
							<Step>
							<StepLabel>Scan For Submit</StepLabel>
							<StepContent>
								<TextField
								size="small"
								autoFocus={submitFocus}
								focused={submitFocus}
								 onChange={(e)=>{
									if(e.target.value == "submit"){
										sendSerialPartMapping();
									}
								}}></TextField>
							</StepContent>
							</Step>
						</Stepper>
						{activeStep === templateData?.length + 1 && (
							<Paper square elevation={0} sx={{ p: 3 }}>
								<Typography sx={{ mb: 2 }}>All steps completed - you&apos;re finished</Typography>
								<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
									Reset
								</Button>
							</Paper>
						)}
					</Box>
				) : (
					<h3 className="template-data-alter">Please Search to view Template</h3>
				)}
			</Paper>
			<div style={{ paddingBottom: "10vh" }} className="report-table table-ceam">
				<MUIDataTable title={"Last Scans"} data={lastScanData} columns={columns} options={options} />
			</div>
		</div>
	);
}

export default Scanning;
