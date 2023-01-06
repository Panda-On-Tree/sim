import { Autocomplete, Button, Paper, TextField, Typography, Box, Stepper, Step, StepLabel, StepContent } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import "./Scanning.css";

function Scanning() {
	const [focused, setFocused] = useState(1);
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
	const [partLookupData, setPartLookupData] = useState([]);

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
				let array = [];
				for (const item of res.data.data) {
					array.push({ id: item.id, serial_number: "" });
				}
				console.log(array);
				setPartLookupData(array);
				setFocused(1);
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
				handleReset();
			})
			.catch((err) => {
				toast.error(err.response.data.message);
			});
	}

	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setFocused(focused + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
		setFocused(focused - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		setFocused(1);
	};

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

			<Paper elevation={4} sx={{ minHeight: "60vh", mt: 6, mb: 20 }}>
				{templateData ? (
					<Box sx={{ maxWidth: 800, p: 5 }}>
						<Stepper activeStep={activeStep} orientation="vertical">
							{templateData ? (
								<Step>
									<StepLabel>Scan Main Serial Number To Start</StepLabel>
									<StepContent>
										<TextField
											value={serialPartMapping.serial_number}
											autoFocus={focused == 1 ? true : false}
											focused={focused == 1 ? true : false}
											size="small"
											sx={{ width: "400px", mt: 3 }}
											label="Serial Number"
											inputProps={{ style: { textTransform: "uppercase" } }}
											onChange={(e) => {
												setSerialPartMapping({ ...serialPartMapping, serial_number: e.target.value });
												if (e.target.value.length === 18) {
													handleNext();
												}
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
													focused={focused == i + 2 ? true : false}
													autoFocus={focused == i + 2 ? true : false}
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
														if (e.target.value.length === 18) {
															handleNext();
														}
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
						</Stepper>
						{activeStep === templateData?.length + 1 && (
							<Paper square elevation={0} sx={{ p: 3 }}>
								<Typography sx={{ mb: 2 }}>All steps completed - you&apos;re finished</Typography>
								<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
									Reset
								</Button>
								<Button variant="contained" onClick={sendSerialPartMapping} sx={{ mt: 1, mr: 1 }}>
									Send Data
								</Button>
							</Paper>
						)}
					</Box>
				) : (
					<h3 className="template-data-alter">Please Search to view Template</h3>
				)}
			</Paper>
		</div>
	);
}

export default Scanning;
