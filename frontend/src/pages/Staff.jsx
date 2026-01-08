import React, { useEffect, useState } from "react";
import useAuthStore from "../features/auth/authStore";
import useStaffStore from "../features/staff/staffStore";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Plus, Trash2, Edit, UserCog } from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { StaffSchema } from "../lib/validation";
import { Navigate } from "react-router-dom";
import Table from "../components/Table";
import PageHeader from "../components/PageHeader";
import DynamicFormModal from "../components/DynamicFormModal";
import SearchBar from "../components/SearchBar";

const Staff = () => {
  const { user } = useAuthStore();
  const {
    staff,
    fetchStaff,
    isLoading,
    deleteStaff,
    createStaff,
    updateStaff,
    page,
    totalPages,
  } = useStaffStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [modalInitialValues, setModalInitialValues] = useState(null);

  // Protect route - Admin only
  if (user && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchStaff({ search });
  }, [fetchStaff, search]);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      if (editingId) {
        await updateStaff(editingId, values);
        toast.success("Staff updated");
      } else {
        await createStaff(values);
        toast.success("Staff created");
      }
      setIsModalOpen(false);
      resetForm();
      setEditingId(null);
    } catch (error) {
      toast.error(editingId ? "Failed to update" : "Failed to create");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      try {
        await deleteStaff(id);
        toast.success("Staff member deleted");
      } catch (error) {
        toast.error("Failed to delete staff");
      }
    }
  };

  const openEdit = (staffMember) => {
    setModalInitialValues({
      name: staffMember.name,
      email: staffMember.email,
      password: staffMember.password,
      isEditing: true,
    });
    setEditingId(staffMember._id);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchStaff({ search, page: newPage });
    }
  };

  const openNew = () => {
    setModalInitialValues({
      name: "",
      email: "",
      password: "",
      isEditing: false,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: "Name",
      render: (staffMember) => (
        <div className="text-sm font-medium text-gray-900">
          {staffMember.name}
        </div>
      ),
    },
    {
      header: "Email",
      render: (staffMember) => (
        <div className="text-sm text-gray-500">{staffMember.email}</div>
      ),
    },
    {
      header: "Role",
      render: (staffMember) => (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
          {staffMember.role}
        </span>
      ),
    },
    {
      header: "Joined",
      render: (staffMember) => (
        <div className="text-sm text-gray-500">
          {new Date(staffMember.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (staffMember) => (
        <div className="flex justify-end">
          <button
            onClick={() => openEdit(staffMember)}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(staffMember._id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];
  const formFields = [
    {
      name: "name",
      placeholder: "Name",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      editPlaceholder: "New Password (optional)",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        icon={UserCog}
        buttonText="Add Staff"
        buttonIcon={Plus}
        onButtonClick={openNew}
      />
      <SearchBar search={search} setSearch={setSearch} />
      <Table
        columns={columns}
        data={staff}
        isLoading={isLoading}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: handlePageChange,
        }}
        emptyMessage="No staff members found"
      />

      {/* Modal */}
      {isModalOpen && (
        <DynamicFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? "Edit Staff" : "New Staff"}
          initialValues={modalInitialValues}
          validationSchema={StaffSchema}
          onSubmit={handleFormSubmit}
          fields={formFields}
          isEdit={!!editingId}
        />
      )}
    </div>
  );
};

export default Staff;
