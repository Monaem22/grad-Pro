import React from 'react';
import { useParams } from 'react-router-dom';
import SingleBanner from '../SingleBanner/SingleBanner';
import img from '../../Assets/images/grad2.jpg';
import AccountSettings from './AccountSettings';
import Transcript from './Transcript';
import ChangePassword from './ChangePassword';
import UserSidebar from './UserSidebar';
import PrivateChatMessages from './PrivateChatMessages';
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS

export default function MyAccount() {
  const { activepage } = useParams();

  return (
    <div className="container-fluid">
      <SingleBanner heading="My Profile" bannerimage={img} />

      {/* UserProfile, showing {activepage} */}
      <div className="row">
        <div className="col-md-3">
          <div className="d-flex flex-column h-100">
            <div className="border p-3 rounded mb-3">
              <UserSidebar activepage={activepage} />
            </div>
            <div className="flex-grow-1"></div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="d-flex flex-column h-100">
            <div className="border p-3 rounded">
              {activepage === 'AccountSettings' && <AccountSettings />}
              {activepage === 'ChangePassword' && <ChangePassword />}
              {activepage === 'Transcript' && <Transcript />}
              {activepage === 'ChatMessages' && <PrivateChatMessages />}
            </div>
            <div className="flex-grow-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}