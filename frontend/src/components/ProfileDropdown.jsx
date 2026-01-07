import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

const ProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Role-based menu items
  const menuItems = [
    {
      label: "My Profile",
      icon: User,
      show: true,
      onClick: () => console.log("Profile"),
    },
    {
      label: "Settings",
      icon: Settings,
      show: user?.role === "admin",
      onClick: () => console.log("Settings"),
    },
  ];

  return (
    <div className="relative w-[200px]" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {user?.name?.charAt(0)}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-4 mt-2 w-[200px] bg-white border rounded-md shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          {/* Menu */}
          {/* <div className="py-1">
            {menuItems
              .filter((item) => item.show)
              .map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    item.onClick();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
          </div> */}

          {/* Logout */}
          <div className="border-t">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
