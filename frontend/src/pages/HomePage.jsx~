import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
// import { tasksAtom } from "../state/tasksAtom.js";
import { userAtom } from "../state/userAtom";
import NavBar from "../components/NavBar";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTask from "../components/EditTask.jsx";
import AddTodo from "../components/AddTodo.jsx";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [user] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleOpenModal = () => {
    setShowEdit(true);
  };

  const handleCloseModal = () => {
    setShowEdit(false);
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
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`/tasks/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Failed to fetch user teams and tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      setLoading(true);
      await axios.put(`/tasks/update/${taskId}`, {
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
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      {console.log(user)}
      <AddTodo assignedToEmail={user.email} fetchTasksData={fetchTasksData}/>
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
                  className="relative mb-4 p-4 border border-gray-200 rounded"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleOpenModal()}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>

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

                  {showEdit && (
                    <EditTask task={task} onClose={handleCloseModal} />
                  )}
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
                  className="relative mb-4 p-4 border border-gray-200 rounded"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleOpenModal()}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>

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

                  {showEdit && (
                    <EditTask task={task} onClose={handleCloseModal} />
                  )}
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
                  className="relative mb-4 p-4 border border-gray-200 rounded"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleOpenModal()}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-green-500 mt-2">Task Completed</p>
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

                  {showEdit && (
                    <EditTask task={task} onClose={handleCloseModal} />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
