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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Task Details
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                {task.title}
              </div>
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
                  ),
                }}
              ></div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Priority
              </label>
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                {task.priority}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Due Date
              </label>
              <div className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                {task.dueDate}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Sub Tasks
              </h3>
              <div className="space-y-4">
                {task.subTasks && task.subTasks.length > 0 ? (
                  task.subTasks.map((subTask, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-300 rounded-lg bg-gray-50 flex flex-col"
                    >
                      <h4 className="text-sm font-bold text-indigo-700 mb-1">
                        {subTask.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {subTask.description}
                      </p>
                      <span
                        className={`text-xs font-medium ${
                          subTask.priority === "urgent"
                            ? "text-red-600"
                            : subTask.priority === "high"
                            ? "text-orange-600"
                            : subTask.priority === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        Priority: {subTask.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">
                    No sub-tasks available.
                  </p>
                )}

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/task/${task._id}`)}
                    className="px-4 py-1 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                  >
                    Edit Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTask;
