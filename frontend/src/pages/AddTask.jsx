import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "assigned",
    priority: "low",
    dueDate: "",
    assignedToEmail: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users/getusers");
        setUsers(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (formData?.title.trim() === "") {
      return;
    }
    try {
      const data = await axios.post("/tasks/create", formData);
      setFormData({});
      toast.success("Task created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">Add New Task</h1>
      <div className="flex justify-center">
        <form
          onSubmit={handleAddTodo}
          className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg"
        >
          <div className="flex flex-col gap-6">
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="assigned">Assigned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              id="assignedToEmail"
              name="assignedToEmail"
              value={formData.assignedToEmail}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
