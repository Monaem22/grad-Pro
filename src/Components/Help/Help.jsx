import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Help.module.css';
import localImage from '../../Assets/images/Help.jpg';

export default function Help() {
  const admins = [
    { username: 'Monaem', email: 'monaem@gmail.com' },
    { username: 'Assem', email: 'asemahmed55@gmail.com' },
    { username: 'Omar', email: 'omarnader55@gmail.com	' },

  ];

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img alt="homepage" src={localImage} className={styles.image} />
      </div>
      <div className={styles.text}>
        <p className={styles.description} style={{ color: 'rgb(27 93 165)', fontFamily: 'Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif' }}>If you need help, don't hesitate to ask any of our admins</p>
        <ul className={styles.adminList}>
          {admins.map((admin, index) => (
            <li key={index}>
            <strong><Link to={`/projectdetails/663c599d55162c73590e28f4/UserProfile/663c596655162c73590e28e8/`} style={{ textDecoration: 'none' ,color: 'rgb(27 93 165)'}}>{admin.username}</Link></strong>: <a href={`mailto:${admin.email}`} style={{ textDecoration: 'none', color: 'red' }}>{admin.email}</a>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
