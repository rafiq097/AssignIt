import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { userAtom } from "../state/userAtom";
import axios from "axios";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const fetchTasksData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`/tasks/gettasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.tasks);
      const foundTask = res.data.tasks.find((task) => task._id === id);
      console.log(foundTask);
      if (foundTask) {
        const formattedDueDate = foundTask.dueDate?.split("T")[0];

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

  useEffect(() => {
    console.log(task);
    setTask((prevTask) => ({
      ...prevTask,
      description: content,
    }));
    console.log(task);
  }, [content]);
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/tasks/update/${task._id}`, task);
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
    <>
      <div className="flex items-center justify-center text-indigo-600 font-bold hover:underline hover:text-indigo-800 cursor-pointer transition duration-200 mb-4">
        <a
          className="w-1/2 flex items-center justify-center"
          onClick={() => navigate("/")}
        >
          Back to Home
        </a>
        <a
          className="w-1/2 flex items-center justify-center"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </a>
      </div>

      <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
        <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Edit Task Description
          </h2>
          <JoditEditor
            ref={editor}
            value={content}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
            className="border rounded-lg p-2"
          />
        </div>

        <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
          {loading ? (
            <Spinner />
          ) : (
            <form>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Edit Task Details
              </h2>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <div
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  dangerouslySetInnerHTML={{ 
                    __html: task.description.replace(
                      /a /g,
                      'a style="color: blue; text-decoration: underline;" '
                    )
                  }}
                ></div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mb-4 flex space-x-2">
                {task.status !== "assigned" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("assigned")}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                  >
                    Mark as Assigned
                  </button>
                )}
                {task.status !== "ongoing" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("ongoing")}
                    className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
                  >
                    Mark as Ongoing
                  </button>
                )}
                {task.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange("completed")}
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                >
                  Update Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default EditTask;
