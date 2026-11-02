import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Community from './pages/Community.jsx';
import Report from './pages/Report.jsx';
import Rescue from './pages/Rescue.jsx';
import Adopt from './pages/Adopt.jsx';
import { PetDetails } from './pages/Adopt/components/PetDetails.jsx';
import { AdoptionApplication } from './pages/Adopt/components/AdoptionApplication.jsx';
import Donate from './pages/Donate.jsx';
import Volunteer from './pages/Volunteer.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import NgoDashboard from './pages/NgoDashboard.jsx';
import Notifications from './pages/Notifications.jsx';
import UserEditProfile from './pages/UserEditProfile.jsx';
import NgoEditProfile from './pages/NgoEditProfile.jsx';
import NgoSettings from './pages/NgoSettings.jsx';
import NgoReportsManage from './pages/NgoReportsManage.jsx';
import NgoReportReview from './pages/NgoReportReview.jsx';
import NgoRescueManage from './pages/NgoRescueManage.jsx';
import NgoVolunteerManage from './pages/NgoVolunteerManage.jsx';
import NgoAdoptManage from './pages/NgoAdoptManage.jsx';
import NgoPetManage from './pages/NgoPetManage.jsx';
import NgoDonationManage from './pages/NgoDonationManage.jsx';
import UiShowroom from './pages/UiShowroom.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login.html" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup.html" element={<Signup />} />

        {/* Standard App Pages */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="index.html" element={<Home />} />
          
          <Route path="community" element={<Community />} />
          <Route path="community.html" element={<Community />} />

          <Route path="report" element={<Report />} />
          <Route path="report.html" element={<Report />} />

          <Route path="rescue" element={<Rescue />} />
          <Route path="rescue.html" element={<Rescue />} />

          <Route path="adopt" element={<Adopt />} />
          <Route path="adopt.html" element={<Adopt />} />
          <Route path="adopt/pet/:petId" element={<PetDetails />} />
          <Route path="adopt/preview" element={<PetDetails />} />
          <Route path="pet-details" element={<PetDetails />} />
          <Route path="pet-details.html" element={<PetDetails />} />
          <Route path="adopt/apply/:petId" element={<AdoptionApplication />} />
          <Route path="adopt-apply.html" element={<AdoptionApplication />} />

          <Route path="donate" element={<Donate />} />
          <Route path="donate.html" element={<Donate />} />

          <Route path="volunteer" element={<Volunteer />} />
          <Route path="volunteer.html" element={<Volunteer />} />
          <Route path="volunteer/activities" element={<Volunteer />} />
          <Route path="volunteer-activities" element={<Volunteer />} />
          <Route path="volunteer-activities.html" element={<Volunteer />} />

          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="user-dashboard.html" element={<UserDashboard />} />

          <Route path="ngo-dashboard" element={<NgoDashboard />} />
          <Route path="ngo-dashboard.html" element={<NgoDashboard />} />
          
          {/* User Profile & Notifications */}
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications.html" element={<Notifications />} />

          <Route path="user-edit-profile" element={<UserEditProfile />} />
          <Route path="user-edit-profile.html" element={<UserEditProfile />} />

          {/* NGO Operations & Management Subpages */}
          <Route path="ngo-edit-profile" element={<NgoEditProfile />} />
          <Route path="ngo-edit-profile.html" element={<NgoEditProfile />} />

          <Route path="ngo-settings" element={<NgoSettings />} />
          <Route path="ngo-settings.html" element={<NgoSettings />} />

          <Route path="ngo-reports-manage" element={<NgoReportsManage />} />
          <Route path="ngo-reports-manage.html" element={<NgoReportsManage />} />

          <Route path="ngo-report-review" element={<NgoReportReview />} />
          <Route path="ngo-report-review.html" element={<NgoReportReview />} />
          <Route path="ngo-report-review/:reportId" element={<NgoReportReview />} />

          <Route path="ngo-rescue-manage" element={<NgoRescueManage />} />
          <Route path="ngo-rescue-manage.html" element={<NgoRescueManage />} />

          <Route path="ngo-volunteer-manage" element={<NgoVolunteerManage />} />
          <Route path="ngo-volunteer-manage.html" element={<NgoVolunteerManage />} />

          <Route path="ngo-adopt-manage" element={<NgoAdoptManage />} />
          <Route path="ngo-adopt-manage.html" element={<NgoAdoptManage />} />

          <Route path="ngo-pet-manage" element={<NgoPetManage />} />
          <Route path="ngo-pet-manage.html" element={<NgoPetManage />} />

          <Route path="ngo-donation-manage" element={<NgoDonationManage />} />
          <Route path="ngo-donation-manage.html" element={<NgoDonationManage />} />

          <Route path="ui-showroom" element={<UiShowroom />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
