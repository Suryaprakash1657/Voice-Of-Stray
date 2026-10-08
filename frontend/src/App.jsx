import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import UiShowroom from './pages/UiShowroom.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Auth Routes (without global Navbar and Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Standard App Pages (with global Navbar and Footer) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="community" element={<Community />} />
          <Route path="report" element={<Report />} />
          <Route path="rescue" element={<Rescue />} />
          <Route path="adopt" element={<Adopt />} />
          <Route path="adopt/pet/:petId" element={<PetDetails />} />
          <Route path="adopt/apply/:petId" element={<AdoptionApplication />} />
          <Route path="donate" element={<Donate />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="volunteer/activities" element={<Volunteer />} />
          <Route path="volunteer-activities" element={<Volunteer />} />
          <Route path="user-dashboard" element={<UserDashboard />} />
          <Route path="ngo-dashboard" element={<NgoDashboard />} />
          <Route path="ui-showroom" element={<UiShowroom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
