import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { userAtom } from "../state/userAtom.js";
import NavBar from "../components/NavBar.jsx";
import toast from "react-hot-toast";
import AddTodo from "../components/AddTodo.jsx";
import AssignedTask from "../components/AssignedTask.jsx";
import OngoingTask from "../components/OngoingTask.jsx";
import CompletedTask from "../components/CompletedTask.jsx";
import Spinner from "../components/Spinner.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTask from "../components/EditTask.jsx";
import { EditorState, convertFromRaw } from "draft-js";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortOption, setSortOption] = useState("none");
  const navigate = useNavigate();

  const handleEditTask = (id) => {
    console.log(id);
    navigate(`/task/${id}`);
    fetchTasksData();
  };

  const handleDeleteTask = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(`/tasks/delete/${id}`);
      console.log(response.data);
      toast.success("Task deleted successfully!");
      fetchTasksData();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const fetchTasksData = async () => {
    try {
      const res = await axios.get("/tasks/gettasks");
      setTasks(res.data.tasks);
      console.log(res.data);
      console.log(tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
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

    const updateUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        setUserData(user);
      } catch {}
    };

    fetchTasksData();
    fetchUsers();
    updateUserStatus();
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/tasks/update/${taskId}`, {
        status,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
      toast.success("Task status updated successfully!");
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const updateTaskAssignedTo = async (taskId, email) => {
    if (!email) {
      return toast.error("No email entered!");
    }

    try {
      await axios.put(`/tasks/update/${taskId}`, {
        assignedToEmail: email,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, assignedToEmail: email } : task
        )
      );
      toast.success("Task reassigned successfully!");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return toast.error("User not found");
      }

      console.error("Failed to update task assignment", error);
      toast.error("Failed to update assignment. Please try again.");
    }
  };

  const handleUpdateRole = async () => {
    console.log(selectedUser, selectedRole);
    if (!selectedUser || !selectedRole) {
      toast.error("Please select a user and a role");
      return;
    }

    try {
      console.log(selectedUser, selectedRole);
      const res = await axios.put(`/users/updateRole/${selectedUser}`, {
        role: selectedRole,
      });

      console.log(res.data);
      toast.success("User Role updated");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    let results = [...tasks];
    if (search) {
      results = results.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    const priorityValues = {
      low: 1,
      medium: 2,
      high: 3,
      urgent: 4,
    };

    if (sortOption === "priorityAsc")
      results.sort(
        (a, b) => priorityValues[a.priority] - priorityValues[b.priority]
      );
    else if (sortOption === "priorityDesc")
      results.sort(
        (a, b) => priorityValues[b.priority] - priorityValues[a.priority]
      );
    else if (sortOption === "dateAsc")
      results.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    else if (sortOption === "dateDesc")
      results.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setFilteredTasks(results);
  }, [search, sortOption, tasks]);

  const renderDescription = (description) => {
    try {
      const contentState = convertFromRaw(JSON.parse(description));
      const editorState = EditorState.createWithContent(contentState);
      return { __html: stateToHTML(editorState.getCurrentContent()) };
    } catch (error) {
      console.error("Failed to render description:", error);
      return { __html: description };
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  if (user?.role == "user") {
    return (
      <>
        {console.log(user)}
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black-600">
              {/* Users can't view this page */}
            </h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {console.log(user)}
      <div className="container mx-auto p-4">
        <div className="mb-4 flex justify-center items-center">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg p-2 pl-10 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-2 top-2 text-gray-500">🔍</span>
          </div>

          <div className="relative ml-2">
            <select
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-lg p-2 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-33"
              value={sortOption}
            >
              <option value="none">Sort by</option>
              <option value="priorityAsc">Priority: Low to High</option>
              <option value="priorityDesc">Priority: High to Low</option>
              <option value="dateDesc">Date: Newest to Oldest</option>
              <option value="dateAsc">Date: Oldest to Newest</option>
            </select>
          </div>
        </div>

        <AddTodo fetchTasksData={fetchTasksData} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Assigned Tasks
            </h2>
            {filteredTasks
              .filter((task) => task.status === "assigned")
              .map((task) => (
                <AssignedTask
                  key={task._id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  updateTaskAssignedTo={updateTaskAssignedTo}
                  users={users}
                  handleEditTask={handleEditTask}
                  handleDeleteTask={handleDeleteTask}
                  showEdit={showEdit}
                  setShowEdit={setShowEdit}
                  renderDescription={renderDescription}
                />
              ))}
          </div>

          {/* Ongoing Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">
              Ongoing Tasks
            </h2>
            {filteredTasks
              .filter((task) => task.status === "ongoing")
              .map((task) => (
                <OngoingTask
                  key={task._id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  updateTaskAssignedTo={updateTaskAssignedTo}
                  users={users}
                  handleEditTask={handleEditTask}
                  handleDeleteTask={handleDeleteTask}
                  showEdit={showEdit}
                  setShowEdit={setShowEdit}
                  renderDescription={renderDescription}
                />
              ))}
          </div>

          {/* Completed Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Completed Tasks
            </h2>
            {filteredTasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <CompletedTask
                  key={task._id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  updateTaskAssignedTo={updateTaskAssignedTo}
                  users={users}
                  handleEditTask={handleEditTask}
                  handleDeleteTask={handleDeleteTask}
                  showEdit={showEdit}
                  setShowEdit={setShowEdit}
                  renderDescription={renderDescription}
                />
              ))}
          </div>
        </div>
      </div>
      {user?.role == "admin" && (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Manage Roles
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Users */}
            <div className="flex-1">
              <label
                htmlFor="user-select"
                className="block text-gray-700 font-medium mb-2"
              >
                Select User:
              </label>
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Roles */}
            <div className="flex-1">
              <label
                htmlFor="role-select"
                className="block text-gray-700 font-medium mb-2"
              >
                Select Role:
              </label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a role</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
            onClick={handleUpdateRole}
          >
            Update Role
          </button>
        </div>
      )}{" "}
    </>
  );
}

export default DashboardPage;
