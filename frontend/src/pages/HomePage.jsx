import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { userAtom } from "../state/userAtom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner.jsx";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTask from "../components/EditTask.jsx";
import AddTodo from "../components/AddTodo.jsx";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortOption, setSortOption] = useState("none");
  const navigate = useNavigate();

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
      console.error("Failed to fetch user tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data.user);
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setUserData(null);
        });
    } else {
      toast.error("Please login to continue");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchTasksData();
    verify();
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      {console.log(userData)}
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
              {/* <option value="statusAsc">Status: Low to High</option>
              <option value="statusDesc">Status: High to Low</option> */}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Assigned Tasks
            </h2>
            {filteredTasks
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

                  <div className="flex justify-between text-sm mt-2">
                    <span
                      className={`font-medium ${
                        task.priority === "urgent"
                          ? "text-red-600"
                          : task.priority === "high"
                          ? "text-orange-600"
                          : task.priority === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {task.priority}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`font-medium ${
                          new Date(task.dueDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
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
            {filteredTasks
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

                  <div className="flex justify-between text-sm mt-2">
                    <span
                      className={`font-medium ${
                        task.priority === "urgent"
                          ? "text-red-600"
                          : task.priority === "high"
                          ? "text-orange-600"
                          : task.priority === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {task.priority}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`font-medium ${
                          new Date(task.dueDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
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
            {filteredTasks
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

                  <div className="flex justify-between text-sm mt-2">
                    <span
                      className={`font-medium ${
                        task.priority === "urgent"
                          ? "text-red-600"
                          : task.priority === "high"
                          ? "text-orange-600"
                          : task.priority === "medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Priority: {task.priority}
                    </span>
                    {task.dueDate && (
                      <span
                        className={`font-medium ${
                          new Date(task.dueDate) < new Date()
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {showEdit && (
                    <EditTask task={task} onClose={handleCloseModal} />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      <AddTodo fetchTasksData={fetchTasksData} />
    </>
  );
}

export default HomePage;
