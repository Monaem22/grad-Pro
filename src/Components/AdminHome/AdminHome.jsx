import React from 'react';
import styles from './AdminHome.module.css';
import img from '../../Assets/images/admin.jpg';

export default function AdminHome() {
  return (
    <div className={styles.container}>
      <img className={styles.bgImage} src={img} alt="Admin Background" />
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Welcome to Admin Panel</h1>
        </header>
        <main className={styles.main}>
          <p className={styles.description}>
            Manage your application efficiently from this dashboard.
          </p>
        </main>
      </div>
    </div>
  );
}
