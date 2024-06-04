import React from 'react';
import Style from './SingleBanner.module.css';

export default function SingleBanner({ bannerimage, heading }) {
  return (
    <div className={Style.singlebanner}>
      <div className={Style.bannerimgfilter}></div>
      <img className={Style.bannerimg} src={bannerimage} alt='no-img-found' />
      <div className={Style.bannerheading}>
        <h2>{heading}</h2>
      </div>
    </div>
  );
}
