import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 p-4 bg-bar border-r border-border">
      <div className="flex flex-col space-y-4">
        {/* Logo or Home Button */}
        <Link
          to="/admin/dashboard"
          className="text-xl font-bold text-primary hover:text-secondary"
        >
          Admin Home
        </Link>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-2">
          <Link
            to="/admin/dashboard"
            className="p-2 rounded-md hover:bg-primary hover:text-white text-text"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/approval"
            className="p-2 rounded-md hover:bg-primary hover:text-white text-text"
          >
            Approval
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;