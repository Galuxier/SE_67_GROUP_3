// import Navbar from "../components/Navbar";
// import { Outlet } from "react-router-dom";

// const MainLayout = () => {
//   return (
//     <div>
//       <Navbar />
//       <div className="p-4">
//         <Outlet />  {/* ใช้ Outlet เพื่อให้แสดงหน้าที่แตกต่างกัน */}
//       </div>
//     </div>
//   );
// };

// export default MainLayout;


import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
