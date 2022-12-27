import React, { useState } from 'react'
import './Navbar.css'
import { SlButton, SlDialog, SlDivider, SlDropdown, SlIcon, SlMenu, SlMenuItem } from '@shoelace-style/shoelace/dist/react/index';
import logo from './logo2.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from '../../api/apiConfig';
function Navbar() {

    let navigate = useNavigate()



  return (
   <div className='navbar'>
 <div className='navbar-main'>
        <nav className='navbar-inner'>
            <div className='navbar-logo'>
                <img src={logo}  className='navbar-logo' alt="" />  
            </div>
            <h2 className='navbar-head'>Serial Number Inventory</h2>
            <div className='nav-items-main'>
                <SlButton className='nav-item-button nav-item-alternate' caret  onClick={()=>{
                     navigate("/")
                }}>
                    Home
                </SlButton>
           
            <SlDropdown distance={5} className="nav-item">
                <SlButton className='nav-item-button' slot="trigger" caret>
                    Account
                </SlButton>
                <SlMenu>
                <SlMenuItem onclick={()=>{
                   
                }}>{localStorage.getItem("fullname")}</SlMenuItem>
                <SlMenuItem onclick={()=>{
                     localStorage.clear()
                     navigate("/login")
                }}>LogOut</SlMenuItem>
              
                
                </SlMenu>
            </SlDropdown> 
            </div>
        </nav>
    </div>
   </div>
  )
}

export default Navbar