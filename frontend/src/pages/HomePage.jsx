import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
// import { tasksAtom } from "../state/tasksAtom.js";
import { userAtom } from "../state/userAtom";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [user] = useRecoilState(userAtom);

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/tasks/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data.tasks);
      } catch (error) {
        console.error("Failed to fetch user teams and tasks", error);
      }
    };

    fetchTasksData();
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/tasks/update/${taskId}`, {
        status,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
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
                <div
                  key={task._id}
                  className="mb-4 p-4 border border-gray-200 rounded"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="mt-2">
                    <button
                      className="bg-yellow-500 text-white text-sm px-2 py-1 rounded mr-2"
                      onClick={() => updateTaskStatus(task._id, "ongoing")}
                    >
                      Mark as Ongoing
                    </button>
                    <button
                      className="bg-green-500 text-white text-sm px-2 py-1 rounded"
                      onClick={() => updateTaskStatus(task._id, "completed")}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
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
                <div
                  key={task._id}
                  className="mb-4 p-4 border border-gray-200 rounded"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="mt-2">
                    <button
                      className="bg-red-500 text-white text-sm px-2 py-1 rounded mr-2"
                      onClick={() => updateTaskStatus(task._id, "assigned")}
                    >
                      Mark as Assigned
                    </button>
                    <button
                      className="bg-green-500 text-white text-sm px-2 py-1 rounded"
                      onClick={() => updateTaskStatus(task._id, "completed")}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
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
                <div
                  key={task._id}
                  className="mb-4 p-4 border border-gray-200 rounded"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-green-600 mt-2">Task Completed</p>
                  <div className="mt-2">
                    <button
                      className="bg-red-500 text-white text-sm px-2 py-1 rounded mr-2"
                      onClick={() => updateTaskStatus(task._id, "assigned")}
                    >
                      Mark as Assigned
                    </button>
                    <button
                      className="bg-yellow-500 text-white text-sm px-2 py-1 rounded"
                      onClick={() => updateTaskStatus(task._id, "ongoing")}
                    >
                      Mark as Ongoing
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
