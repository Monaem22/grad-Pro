import React from 'react';
import styles from './Footer.module.css';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter className={`text-center text-lg-start text-muted ${styles.customPrimaryOpacity}`}>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block text-white'>
          <span>Follow us:</span>
        </div>

        <div>
          <a href='https://facebook.com' className={`me-4 ${styles.socialLink}`}>
            <MDBIcon fab icon='facebook-f' />
          </a>
          <a href='https://twitter.com' className={`me-4 ${styles.socialLink}`}>
            <MDBIcon fab icon='twitter' />
          </a>
          <a href='https://plus.google.com' className={`me-4 ${styles.socialLink}`}>
            <MDBIcon fab icon='google' />
          </a>
          <a href='https://instagram.com' className={`me-4 ${styles.socialLink}`}>
            <MDBIcon fab icon='instagram' />
          </a>
          <a href='https://linkedin.com' className={`me-4 ${styles.socialLink}`}>
            <MDBIcon fab icon='linkedin' />
          </a>
          <a href='https://github.com' className={`me-4 ${styles.socialLink}`}>
            <MDBIcon fab icon='github' />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5 text-white'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4 text-white'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon='user-graduate' className='me-3' />
                Seniors Pal
              </h6>
              <p>
                A platform for senior citizens to connect, learn, and grow together.
              </p>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='/' className='text-white'style={{ textDecoration: 'none' }}>
                  Home
                </a>
              </p>
              <p>
                <a href='/Projects' className='text-white'style={{ textDecoration: 'none' }}>
                  Projects
                </a>
              </p>
              <p>
                <a href='/' className='text-white'style={{ textDecoration: 'none' }}>
                  Recommendation
                </a>
              </p>
              <p>
                <a href='/user/AccountSettings' className='text-white'style={{ textDecoration: 'none' }}>
                  Profile
                </a>
              </p>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='/' className='text-white'style={{ textDecoration: 'none' }}>
                  About Us
                </a>
              </p>
              <p>
                <a href='/Help' className='text-white'style={{ textDecoration: 'none' }}>
                  Help
                </a>
              </p>
              <p>
                <a href='/Help' className='text-white'style={{ textDecoration: 'none' }}>
                  Contact Us
                </a>
              </p>
              <p>
                <a href='/Help' className='text-white'style={{ textDecoration: 'none' }}>
                  Privacy Policy
                </a>
              </p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon icon='home' className='me-2' />
               Helwan University , FCAIH
              </p>
              <p>
                <MDBIcon icon='envelope' className='me-3' />
                seniorspal@gmail.com
              </p>
              <p>
                <MDBIcon icon='phone' className='me-3' /> 
                +201093294180
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center text-white p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © {new Date().getFullYear()} Seniors Pal. All rights reserved.
      </div>
    </MDBFooter>
  );
}





// import React from 'react';
// import styles from './Footer.module.css';
// import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

// export default function Footer() {
//   return (
//     <MDBFooter className={`text-center text-lg-start text-muted ${styles.customPrimaryOpacity}`}>
//       <section className={`p-4 border-bottom ${styles.socialLinks}`}>
//         <div className={`me-5 d-none d-lg-block text-white ${styles.footerContent}`}>
//           <span>Get connected with us on social networks:</span>
//         </div>

        // <div>
        //   <a href='https://facebook.com' className={`me-4 ${styles.socialLink}`}>
        //     <MDBIcon fab icon='facebook-f' />
        //   </a>
        //   <a href='https://twitter.com' className={`me-4 ${styles.socialLink}`}>
        //     <MDBIcon fab icon='twitter' />
        //   </a>
        //   <a href='https://plus.google.com' className={`me-4 ${styles.socialLink}`}>
        //     <MDBIcon fab icon='google' />
        //   </a>
        //   <a href='https://instagram.com' className={`me-4 ${styles.socialLink}`}>
        //     <MDBIcon fab icon='instagram' />
        //   </a>
        //   <a href='https://linkedin.com' className={`me-4 ${styles.socialLink}`}>
        //     <MDBIcon fab icon='linkedin' />
        //   </a>
        //   <a href='https://github.com' className={`me-4 ${styles.socialLink}`}>
        //     <MDBIcon fab icon='github' />
        //   </a>
        // </div>
//       </section>

//       <section className=''>
//         <MDBContainer className={`mt-5 ${styles.footerContent}`}>
//           <MDBRow className='mt-3'>
//             {/* Your existing columns */}
//           </MDBRow>
//         </MDBContainer>
//       </section>

//       <div className={`p-4 ${styles.footerContent}`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
//         © 2024 Copyright:
//         <a href='https://example.com' className='fw-bold' style={{ textDecoration: 'none', color: 'white' }}>
//           Seniors Pal Team
//         </a>
//       </div>
//     </MDBFooter>
//   );
// }
