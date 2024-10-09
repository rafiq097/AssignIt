import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { userAtom } from "../state/userAtom";
import axios from "axios";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

const TaskPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  const fetchTasksData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`/tasks/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const foundTask = res.data.tasks.find((task) => task._id === id);
      if (foundTask) {
        const formattedDueDate = foundTask.dueDate.split("T")[0];
        setTask({
          ...foundTask,
          dueDate: formattedDueDate,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleStatusChange = (status) => {
    setTask((prevTask) => ({ ...prevTask, status }));
  };

  const handleUpdate = async () => {
    const updatedTask = task;
    try {
      const response = await axios.put(
        `/tasks/update/${task._id}`,
        updatedTask
      );
      console.log(response.data);
      toast.success("Task Edited successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task.");
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg flex space-x-4">
        {/* Left part */}
        <div className="w-1/2">
          {loading ? (
            <Spinner />
          ) : (
            <form>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Edit Task Details
              </h2>

              {/* Form fields */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={task.description}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500"
                  rows="2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mb-4 flex space-x-2">
                {task.status !== "assigned" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("assigned")}
                    className="px-2 py-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                  >
                    Mark as Assigned
                  </button>
                )}
                {task.status !== "ongoing" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("ongoing")}
                    className="px-2 py-1 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
                  >
                    Mark as Ongoing
                  </button>
                )}
                {task.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("completed")}
                    className="px-2 py-1 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-4 py-1 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                >
                  Update Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right part */}
        <div className="w-1/2 bg-gray-200 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Additional Information
          </h3>
          {/* Add any content you want to display on the right side here */}
          <p className="text-gray-700">
            Use this section to display any additional information about the task,
            such as comments, task history, or user information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
