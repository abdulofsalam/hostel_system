
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Hostels from "./pages/Hostels";
import Rooms from "./pages/Rooms";
import Students from "./pages/Students";
import Occupancy from "./pages/Occupancy";
import Profile from "./pages/Profile";
import Payments from "./pages/Payments";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Public routes: no sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected pages: shared sidebar */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/students" element={<Students />} />
          <Route path="/occupancy" element={<Occupancy />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="payments" element={<Payments />} />
        </Route>

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Hostels from "./pages/Hostels";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import Rooms from "./pages/Rooms";
// import Students from "./pages/Students";
// import Occupancy from "./pages/Occupancy";


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/hostels"
//           element={
//             <ProtectedRoute>
//               <Hostels />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//          path="/rooms"
//          element={
//           <ProtectedRoute>
//            <Rooms />
//          </ProtectedRoute>
//           }
//         />
//         <Route
//          path="/students"
//          element={
//           <ProtectedRoute>
//             <Students />
//         </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/occupancy"
//           element={
//            <ProtectedRoute>
//              <Occupancy />
//            </ProtectedRoute>
//           }
//         />

//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;