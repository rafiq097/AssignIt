import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { userAtom } from "../state/userAtom.js";
import NavBar from "../components/NavBar.jsx";
import toast from "react-hot-toast";
import AddTodo from "../components/AddTodo.jsx";
import AssignedTask from "../components/AssignedTask.jsx";
import OngoingTask from "../components/OngoingTask.jsx";
import CompletedTask from "../components/CompletedTask.jsx";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user] = useRecoilState(userAtom);

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

    fetchTasksData();
    fetchUsersData();
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

  return (
    <>
      <NavBar />

      <AddTodo />

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
    </>
  );
}

export default DashboardPage;
