import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import logo from "./logo3.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Appbar() {
	const [serial, setSerial] = React.useState(null);
	const open = Boolean(serial);
	const [account, setAccount] = React.useState(null);
	const openAccount = Boolean(account);
	const [scanning, setScanning] = React.useState(null);
	const openScanning = Boolean(scanning);
	const [anchorElNav, setAnchorElNav] = React.useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};
	let navigate = useNavigate();

	return (
		<div className="navbar">
            <AppBar sx={{padding:'4px'}} color="primary" position="fixed">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<img src={logo} height="60px" alt="" />

					<Box sx={{ flexGrow: 1, justifyContent: "flex-end",display: { xs: "flex", md: "none" } }}>
						<IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								justifyContent: "flex-end",
								display: { xs: "block", md: "none" },
							}}>
							{pages.map((page) => (
								<MenuItem key={page} onClick={handleCloseNavMenu}>
									<Typography textAlign="center">{page}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					
					<Box sx={{ flexGrow: 1, gap: "25px", justifyContent: "flex-end", display: { xs: "none", md: "flex" } }}>
						<div>
							<Button
                            
								sx={{minWidth:"110px", color: "white",'&:hover': {
                                    background: "#0000004d",    
                                                 
                                    } }}
								/* endIcon={<KeyboardArrowDownIcon />} */

								onClick={() => {
									navigate("/");
								}}>
								Home
							</Button>
						</div>
						<div>
                            {JSON.parse(localStorage.getItem("module_access"))?.sim_scanning?<Button
								sx={{ minWidth:"110px",color: "white",'&:hover': {
                                    background: "#0000004d",    
                                                 
                                    } }}
								
								id="basic-button"
								aria-controls={openScanning ? "basic-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={openScanning ? "true" : undefined}
								onClick={()=>navigate("/scanning")}>
								Scanning
							</Button>:null}
							
							{/* <Menu
                            
								id="basic-menu"
								anchorEl={scanning}
								open={openScanning}
								onClose={()=>{setScanning(null)}}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}>
								<MenuItem sx={{ minWidth:"150px" }} >Scan</MenuItem>
							</Menu> */}
						</div>
						<div>
							<Button
								sx={{minWidth:"110px", color: "white",'&:hover': {
                                    background: "#0000004d",    
                                                 
                                    } }}
								endIcon={<KeyboardArrowDownIcon />}
								id="basic-button"
								aria-controls={open ? "basic-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}
								onClick={(e) => {
									setSerial(e.currentTarget);
								}}>
								Serial
							</Button>
							<Menu
								id="basic-menu"
								anchorEl={serial}
								open={open}
								onClose={() => {
									setSerial(null);
								}}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}>
                                {JSON.parse(localStorage.getItem("module_access"))?.sim_generation?<MenuItem onClick={()=>navigate("/serial")}>Serial Generation</MenuItem>:null}

								
								<MenuItem onClick={()=>navigate("/filter-serial")}>Serial View</MenuItem>
                                {JSON.parse(localStorage.getItem("module_access"))?.sim_combo?<MenuItem onClick={()=>navigate("/combo-gen")}>Combo Generation</MenuItem>:null}
								
							</Menu>
						</div>
						<div>
							<Button
								sx={{minWidth:"110px", color: "white",'&:hover': {
                                    background: "#0000004d",    
                                                 
                                    } }}
								endIcon={<KeyboardArrowDownIcon />}
								id="account-menus"
								aria-controls={openAccount ? "account-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={openAccount ? "true" : undefined}
								onClick={(e) => {
									setAccount(e.currentTarget);
								}}>
								Account
							</Button>
							<Menu
								id="account-menu"
								anchorEl={account}
								open={openAccount}
								onClose={() => {
									setAccount(null);
								}}
								MenuListProps={{
									"aria-labelledby": "account-menus",
								}}>
								<MenuItem>{localStorage.getItem("fullname")}</MenuItem>
								<MenuItem
									onClick={() => {
										localStorage.clear();
										navigate("/login");
									}}>
									Logout
								</MenuItem>
							</Menu>
						</div>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
        </div>
	);
}
export default Appbar;
