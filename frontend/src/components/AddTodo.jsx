import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const AddTodo = ({ fetchTasksData, isFormVisible, setIsFormVisible, priority }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "assigned",
    priority: priority ?? "low",
    dueDate: "",
    assignedToEmail: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users/getusers");
        setUsers(res.data.users);
        console.log(users);
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
      console.log(data);
      setFormData({});
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task. Please try again.");
    }
    finally{
      fetchTasksData();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 click-sub-task"
          onClick={() => setIsFormVisible((prev) => !prev)}
        >
          {isFormVisible ? "Cancel" : "Add New Task"}
        </button>
      </div>

      {isFormVisible && (
        <div className="flex justify-center mb-4">
          <form
            onSubmit={handleAddTodo}
            className="bg-white shadow-md rounded p-6 w-full md:w-1/2"
          >
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <textarea
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="assigned">Assigned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
              <select
                id="assignedToEmail"
                name="assignedToEmail"
                value={formData.assignedToEmail}
                onChange={(handleChange)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTodo;
