import React, { useEffect, useState } from "react";
import api from "../Api";
import axios from "axios";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    empID: "",
    department: "",
    phone: "",
    address: "",
    idCard: "",
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get(
        "http://localhost:4000/api/admin/employees"
      );
      setEmployees(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const handleEdit = (employee) => {
    setIsEditing(true);
    setSelectedEmployeeId(employee._id);
    setFormState(employee);

    if (Array.isArray(employee.idCard) && employee.idCard.length > 0) {
      const imageUrl = `http://localhost:4000/upload/${employee.idCard[0]}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
    openModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new FormData object
      const formData = new FormData();
      // Append all form fields to FormData object
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("empID", formState.empID);
      formData.append("department", formState.department);
      formData.append("phone", formState.phone);
      formData.append("address", formState.address);

      // Check if there's a new file and append it
      if (formState.idCard && formState.idCard !== imagePreview) {
        formData.append("idCard", formState.idCard);
      } else if (!formState.idCard && imagePreview) {
        // If the image wasn't changed but we have a default, keep it (no need to send new file)
        formData.append("idCard", imagePreview);
      }

      // Make the API request to add/update employee
      if (isEditing) {
        await api.put(
          `http://localhost:4000/api/admin/employee/${selectedEmployeeId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:4000/api/admin/employee", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Fetch the updated employees list and close the modal
      fetchEmployees();
      closeModal(); // Close modal after form submission
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`http://localhost:4000/api/admin/employee/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error(error.message);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedEmployeeId(null);
    setFormState({
      name: "",
      email: "",
      empID: "",
      department: "",
      phone: "",
      address: "",
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const employeeData = employees.map((employee) => ({
      Name: employee.name,
      Email: employee.email,
      EmployeeID: employee.empID,
      Department: employee.department || "N/A",
      Phone: employee.phone,
      Address: employee.address,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,EmployeeID,Department,Phone,Address\n" +
      employeeData.map((emp) => Object.values(emp).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees.csv");
    link.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormState({ ...formState, idCard: file });
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Top Bar */}
      <div className="flex justify-end items-center mb-4 gap-5">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Employee
        </button>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export
        </button>
      </div>

      {/* Employee Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] flex">
            {/* Left side: Image Upload */}
            <div className="w-1/3 pr-4">
              <h3 className="text-xl mb-4 text-center">Upload ID Card</h3>
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  name="idCard"
                  onChange={handleFileChange}
                  className="p-2 border rounded w-full"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="ID Card Preview"
                    className="mt-4 w-32 h-32 object-cover"
                  />
                )}
              </div>
            </div>

            {/* Right side: Form Fields */}
            <div className="w-2/3 pl-4">
              <h2 className="text-xl mb-4 text-center font-semibold">
                {isEditing ? "Edit Employee" : "Add Employee"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="flex flex-row gap-5">
                    <div className="space-y-4 w-full">
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          placeholder="Name"
                          onChange={handleInputChange}
                          required
                          className="p-2 border rounded w-full"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          placeholder="Email"
                          onChange={handleInputChange}
                          required
                          className="p-2 border rounded w-full"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Employee ID
                        </label>
                        <input
                          type="text"
                          name="empID"
                          value={formState.empID}
                          placeholder="Employee ID"
                          onChange={handleInputChange}
                          required
                          className="p-2 border rounded w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-4 w-full">
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          value={formState.department}
                          placeholder="Department"
                          onChange={handleInputChange}
                          className="p-2 border rounded w-full"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formState.phone}
                          placeholder="Phone"
                          onChange={handleInputChange}
                          className="p-2 border rounded w-full"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formState.address}
                          placeholder="Address"
                          onChange={handleInputChange}
                          className="p-2 border rounded w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {isEditing ? "Update Employee" : "Add Employee"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl mb-4">Employee List</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Employee ID</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Address</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-2 text-center text-gray-500">
                  No employees available
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee._id} className="border-b">
                  <td className="p-2">{employee.name}</td>
                  <td className="p-2">{employee.email}</td>
                  <td className="p-2">{employee.empID}</td>
                  <td className="p-2">{employee.department || "N/A"}</td>
                  <td className="p-2">{employee.phone}</td>
                  <td className="p-2">{employee.address}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
