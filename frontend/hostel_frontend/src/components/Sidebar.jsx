
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { getUser, logoutUser } from "../utils/auth";

function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    // Remove saved JWT tokens and user information.
    logoutUser();

    // Redirect to Login page.
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "▦" },
    { label: "Manage Hostels", path: "/hostels", icon: "⌂" },
    { label: "Manage Rooms", path: "/rooms", icon: "▤" },
    { label: "Manage Students", path: "/students", icon: "♙" },
    { label: "Room Occupancy", path: "/occupancy", icon: "▥" },
    { label: "Payments", path: "/payments", icon: "✔" },
    { label: "My Profile", path: "/profile", icon: "◎" },
  ];

  return (
    <aside className="app-sidebar">
      {/* Sidebar Brand and User */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">H</div>

        <div className="sidebar-user">
          <h4>{user?.username || "Hostel Owner"}</h4>
          <p>Hostel Management Portal</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="sidebar-section-label">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <span className="sidebar-link-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-owner">
          <div className="sidebar-owner-avatar">O</div>

          <div>
            <strong>Hostel Owner</strong>
            <span>Management Portal</span>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-link-icon">↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

// import { NavLink, useNavigate } from "react-router-dom";
// import "../styles/Sidebar.css";
// import { getUser, logoutUser } from "../utils/auth";

// function Sidebar() {
//   const navigate = useNavigate();
//   const user = getUser();

//   const handleLogout = () => {
//     // Remove saved JWT tokens and user information.
//     logoutUser();

//     // Redirect to Login page.
//     navigate("/login", { replace: true });
//   };

//   const navItems = [
//     { label: "Dashboard", path: "/dashboard", icon: "▦" },
//     { label: "Manage Hostels", path: "/hostels", icon: "⌂" },
//     { label: "Manage Rooms", path: "/rooms", icon: "▤" },
//     { label: "Manage Students", path: "/students", icon: "♙" },
//     { label: "Room Occupancy", path: "/occupancy", icon: "▥" },
//     { label: "My Profile", path: "/profile", icon: "◎" },
//   ];

//   return (
//     <aside className="app-sidebar">
//       {/* Sidebar Brand and User */}
//       <div className="sidebar-brand">
//         <div className="sidebar-brand-icon">H</div>

//         <div className="sidebar-user">
//           <h4>{user?.username || "Hostel Owner"}</h4>
//           <p>Hostel Management Portal</p>
//         </div>
//       </div>

//       {/* Navigation Section */}
//       <div className="sidebar-section-label">
//         MAIN MENU
//       </div>

//       <nav className="sidebar-nav">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) =>
//               `sidebar-link${isActive ? " active" : ""}`
//             }
//           >
//             <span className="sidebar-link-icon">
//               {item.icon}
//             </span>

//             <span>{item.label}</span>
//           </NavLink>
//         ))}
//       </nav>

//       {/* Sidebar Bottom */}
//       <div className="sidebar-bottom">
//         <div className="sidebar-owner">
//           <div className="sidebar-owner-avatar">O</div>

//           <div>
//             <strong>Hostel Owner</strong>
//             <span>Management Portal</span>
//           </div>
//         </div>

//         <button
//           type="button"
//           className="sidebar-logout"
//           onClick={handleLogout}
//         >
//           <span className="sidebar-link-icon">↪</span>
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;







// import { NavLink, useNavigate } from "react-router-dom";
// import "../styles/Sidebar.css";
// import { getUser, logoutUser } from "../utils/auth";

// const user = getUser();

// const handleLogout = () => {
//     logoutUser();
//     navigate("/login", { replace: true });
// };

// function Sidebar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Remove the JWT tokens used by your login system.
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("token");

//     navigate("/login", { replace: true });
//   };

//   const navItems = [
//     { label: "Dashboard", path: "/dashboard", icon: "▦" },
//     { label: "Manage Hostels", path: "/hostels", icon: "⌂" },
//     { label: "Manage Rooms", path: "/rooms", icon: "▤" },
//     { label: "Manage Students", path: "/students", icon: "♙" },
//     { label: "Room Occupancy", path: "/occupancy", icon: "▥" },
//   ];

//   return (
//     <aside className="app-sidebar">
//       <div className="sidebar-brand">
//         <div className="sidebar-brand-icon">H</div>
//         <div className="sidebar-user">
//             <h4>{user?.username || "Hostel Owner"}</h4>
//             <p>Hostel Management Portal</p>
//        </div>
//       </div>

//       <div className="sidebar-section-label">MAIN MENU</div>

//       <nav className="sidebar-nav">
//         {navItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             className={({ isActive }) =>
//               `sidebar-link${isActive ? " active" : ""}`
//             }
//           >
//             <span className="sidebar-link-icon">{item.icon}</span>
//             <span>{item.label}</span>
//           </NavLink>
//         ))}
//       </nav>

//       <div className="sidebar-bottom">
//         <div className="sidebar-owner">
//           <div className="sidebar-owner-avatar">O</div>
//           <div>
//             <strong>Hostel Owner</strong>
//             <span>Management Portal</span>
//           </div>
//         </div>
//         <button onClick={handleLogout}>
//         Logout
//         </button>

//         {/* <button
//           type="button"
//           className="sidebar-logout"
//           onClick={handleLogout}
//         >
//           <span className="sidebar-link-icon">↪</span>
//           Logout
//         </button> */}
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;