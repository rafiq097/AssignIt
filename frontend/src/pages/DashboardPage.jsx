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

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const res = await axios.get("/tasks/gettasks");
        setTasks(res.data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    const fetchUsersData = async () => {
      try {
        const res = await axios.get("/users/getusers");
        setUsers(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    const updateAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data.user);
      } catch {}
    };

    fetchTasksData();
    fetchUsersData();
    updateAdminStatus();
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

  const handleUpdateAdmin = async () => {
    console.log(selectedUser);
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      await axios.put(`/users/updateAdmin/${selectedUser}`);
      toast.success("User updated to admin");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };
  
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  if (!userData?.admin) {
    return (
      <>
        {console.log(userData)}
        <NavBar />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black-600">
              {/* Only admins can view this page */}
            </h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />

      <AddTodo />

      {console.log(userData)}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Assigned Tasks
            </h2>
            {tasks
              .filter((task) => task.status === "assigned")
              .map((task) => (
                <AssignedTask
                  key={task._id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  updateTaskAssignedTo={updateTaskAssignedTo}
                  users={users} // Pass the list of users
                />
              ))}
          </div>

          {/* Ongoing Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">
              Ongoing Tasks
            </h2>
            {tasks
              .filter((task) => task.status === "ongoing")
              .map((task) => (
                <OngoingTask
                  key={task._id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  updateTaskAssignedTo={updateTaskAssignedTo}
                  users={users} // Pass the list of users
                />
              ))}
          </div>

          {/* Completed Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Completed Tasks
            </h2>
            {tasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <CompletedTask
                  key={task._id}
                  task={task}
                  updateTaskStatus={updateTaskStatus}
                  updateTaskAssignedTo={updateTaskAssignedTo}
                  users={users} // Pass the list of users
                />
              ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Admins</h2>
        <div className="mb-4">
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
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleUpdateAdmin}
        >
          Make Admin
        </button>
      </div>
    </>
  );
}

export default DashboardPage;
