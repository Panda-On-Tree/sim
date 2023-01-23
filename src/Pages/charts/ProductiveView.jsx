import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { baseurl } from "../../api/apiConfig";
import moment from "moment/moment";

export const ProductiveView = () => {
    const [innerWidth, setInnerWidth] = useState(window.innerWidth - 100)
	const [productList, setProductList] = useState([]);
	const [modelList, setModelList] = useState([]);
	const [plantList, setPlantList] = useState([]);
	const [prodLineList, setProdLineList] = useState([]);
	const [chartSeries, setChartSeries] = useState([]);
	const [prodViewData, setProdViewData] = useState({
        plant_id:""
    });
	const [productiveTableData, setProductiveTableData] = useState([]);
    const [endDatevalue, setEndDatevalue] = useState(null)
    const [startDateValue, setStartDateValue] = useState(null);
    const [prodColumn, setProdColumn] = useState([])

    useEffect(()=>{
        window.onresize = function(){
            setInnerWidth(window.innerWidth - 100)
          
        }
    },[])

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
				//console.log(res.data.data);
				setProdLineList(res.data.data);
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response.data.message);
			});
	}
   
	function fetchGraph(value) {
        console.log("interval");
       
		const data ={
			plant_id:prodViewData.plant_id,
			start_date:moment(startDateValue).format("YYYY-MM-DD"),
			end_date:moment(endDatevalue).format("YYYY-MM-DD")
		}
		console.log(data);
		axios({
			method: "post",
			url: `${baseurl.base_url}/sim/get-graph-view`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data
		    })
			.then((res) => {
				//console.log(res);
				let arr = [];
				res?.data?.data?.forEach((element) => {
                        let name_data = element.filter((item)=>{
                            if(item.title){
                                return item
                            }
                        })[0]?.title;
                        if(name_data){
                            arr.push({
                                name: name_data,
                                data: element.map((item) => {
                                    return {
                                        x: item.time_slot_name,
                                        y: item.qty
                                    }
                                }),
                            });
                        }
						
				});
				setChartSeries(arr);
                setTimeout(() => {
                    fetchGraph(value)
                }, 60000);
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response.data.message);
			});
	}

   
	function fetchProductiveView() {
        console.log(prodViewData);
		axios({
			method: "post",
			url: `${baseurl.base_url}/sim/get-productive-view`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			data: prodViewData,
		})
			.then((res) => {
			//	console.log(res);
                setProdColumn(Object.keys(res.data.data[0]))
				setProductiveTableData(res.data.data);
                /* setTimeout(() => {
                    fetchProductiveView();
                }, 60000); */
			})
			.catch((err) => {
				console.log(err);
			});
	}

	const options = {
		title: {
			text: "Chart",
		},
		chart: {
			id: "basic-bar",
			toolbar: {
				show: true,
				tools: {
					download: true,
					selection: false,
					zoom: false,
					zoomin: false,
					zoomout: false,
					pan: false,
				},
			},
		},
		stroke: {
			curve: "smooth",
		},
		noData: {
			text: "No Data",
			align: "center",
			verticalAlign: "middle",
		},
        markers: {
            size: 4,
            colors: undefined,
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            onClick: undefined,
            onDblClick: undefined,
            showNullDataPoints: true,
            hover: {
              size: undefined,
              sizeOffset: 3
            }
        }
	};
	const series = [
		{
			name: "series-1",
			data: [
				{ x: 1991, y: 10 },
				{ x: 1992, y: 25 },
				{ x: 1993, y: 50 },
				{ x: 1994, y: 0 },
			],
		},
		{
			name: "series-2",
			data: [
				{ x: 1991, y: 5 },
				{ x: 1992, y: 30 },
				{ x: 1993, y: 35 },
				{ x: 1994, y: 60 },
			],
		},
	];

	const optionsTable = {
		tableBodyMaxHeight: "64vh",
		responsive: "standard",
		selectableRowsHideCheckboxes: true,
		sort: false,
		rowsPerPage: 15,
		viewColumns: false,
	};

	const columns = [
		{ name: "plant_name", label: "Plant Name" },
		{ name: "prod_line_name", label: "Prod Line Name" },
		{ name: "product_name", label: "Product Name" },
		{ name: "sap_part_code", label: "Sap Part Code" },
		{ name: "model_name", label: "Model Name" },
		{ name: "date", label: "Date" },
		{ name: "from", label: "From" },
		{ name: "to", label: "To" },
		{ name: "qty", label: "Qty" },
		{ name: "qc_incharge", label: "Qc Incharge" },
		{ name: "line_incharge", label: "Line Incharge" },
		{ name: "created_by", label: "Created By" },
	];

	return (
		<Box>
			<Box sx={{ display: "flex", mb: 10, gap: "30px", flexWrap: "wrap" }}>
				<Autocomplete
					className="autocomp-input"
					/* value={serialGenData.product_id} */
					onChange={(event, newValue) => {
						if (newValue?.id) {
							setProdViewData({ ...prodViewData, product_id: newValue.id });
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
							setProdViewData({ ...prodViewData, model_id: newValue.id });
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
							setProdViewData({ ...prodViewData, plant_id: newValue.id });
							//fetchGraph(newValue.id);
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
							setProdViewData({ ...prodViewData, prodline_id: newValue.id });
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
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DateTimePicker
                    className="autocomp-input"
						renderInput={(props) => <TextField {...props} />}
						label="Start Date"
						value={startDateValue}
						onChange={(newValue) => {
                            setStartDateValue(newValue)
                            setProdViewData({ ...prodViewData, start_date_time: moment(newValue._d).format("YYYY-MM-DD HH:00:00") });
						}}
					/>
				</LocalizationProvider>
				<LocalizationProvider dateAdapter={AdapterMoment}>
					<DateTimePicker
                    className="autocomp-input"
						renderInput={(props) => <TextField {...props} />}
						label="End Date"
                        value={endDatevalue}
						onChange={(newValue) => {
                            setEndDatevalue(newValue)
                            setProdViewData({ ...prodViewData, end_date_time: moment(newValue._d).format("YYYY-MM-DD HH:00:00") });
						}}
					/>
				</LocalizationProvider>
				<Button sx={{minWidth:'150px'}}  variant="outlined" onClick={()=>{
					fetchProductiveView()
					fetchGraph()
				}}>
					Get Data
				</Button>
			</Box>
			<Box sx={{display:'flex', justifyContent:'center', minWidth:'100%'}}>
            <Chart options={options} series={chartSeries} type="line" width={innerWidth} height={400} />
            </Box>
			<Box sx={{ mt: 8, mb: 10 }}>
				<MUIDataTable title={"Last Scans"} data={productiveTableData} columns={prodColumn} options={optionsTable} />
			</Box>
		</Box>
	);
};
