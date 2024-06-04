import React from 'react'
import Style from './Notfound.module.css'
import localImage from '../../Assets/images/404.png'; 
export default function Notfound() {

  return  <>
   
      <div className="not-found-content">
      <img src={localImage} alt="Profile" style={{width: '600px', height: '600px',margin: '0 auto', display: 'block'}} />
      <a href="/" style={{ fontSize:'30px',textAlign: 'center', display: 'block', textDecoration:'none',color: '#178ae5',fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif',fontWeight: 'bold'  }}>Go back to the home page</a>
      </div>
    <br/>
    <br/>
    <br/>
    </>
  
}
