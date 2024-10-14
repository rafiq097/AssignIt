import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { userAtom } from "../state/userAtom";
import axios from "axios";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const ViewTask = () => {
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

  useEffect(() => {
    fetchTasksData();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center text-indigo-600 font-bold hover:underline hover:text-indigo-800 cursor-pointer transition duration-200">
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

      <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full p-8">
        {loading ? (
          <Spinner />
        ) : (
          <form className="w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Task Details
            </h2>

            {/* Form fields */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <p className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500">
                {task.title}
              </p>
            </div>

            {/* <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={task.description}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500"
                  rows="2"
                />
              </div> */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <div
                className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500"
                dangerouslySetInnerHTML={{ __html: task.description }}
              ></div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Priority
              </label>
              <p className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500">
                {task.priority}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Due Date
              </label>
              <p className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:border-indigo-500">
                {task.dueDate}
              </p>
            </div>

            <div className="mb-4 flex space-x-2">
              {task.status === "assigned" && (
                <button
                  type="button"
                  className="px-2 py-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                >
                  Assigned
                </button>
              )}
              {task.status === "ongoing" && (
                <button
                  type="button"
                  className="px-2 py-1 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600"
                >
                  Ongoing
                </button>
              )}
              {task.status === "completed" && (
                <button
                  type="button"
                  className="px-2 py-1 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                >
                  Completed
                </button>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/task/${task._id}`)}
                className="px-4 py-1 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default ViewTask;
