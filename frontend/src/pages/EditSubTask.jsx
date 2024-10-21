import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { userAtom } from "../state/userAtom";
import axios from "axios";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import JoditEditor from "jodit-react";

const EditSubTask = () => {
  const navigate = useNavigate();
  const { parentId, subTaskId } = useParams();
  console.log(parentId, subTaskId);
  const [userData, setUserData] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
  });
  const priorityLevels = ["low", "medium", "high", "urgent"];
  const parentPriorityIndex = priorityLevels.indexOf(task.priority);
  const availablePriorities = priorityLevels.slice(parentPriorityIndex);
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
      const foundTask = res.data.tasks.find((task) => task._id === parentId);
      console.log(foundTask);
      if (foundTask) {
        if (subTaskId) {
          let sub = foundTask.subTasks.find((task) => task._id === subTaskId);
          console.log(sub);
          if (sub) {
            const formattedDueDate = sub.dueDate?.split("T")[0];

            setTask({
              ...sub,
              dueDate: formattedDueDate,
            });
            setContent(sub.description);
          }
        } else {
          const formattedDueDate = foundTask.dueDate?.split("T")[0];

          setTask({
            ...foundTask,
            dueDate: formattedDueDate,
          });
          setContent(foundTask.description);
        }
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
      const response = await axios.put(
        `/tasks/update-subtask/${parentId}/${task._id}`,
        task
      );
      console.log(response.data);
      toast.success("Sub Task Edited successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to update Sub task:", error);
      toast.error("Failed to update Sub task.");
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  return (
    <>
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
                    ),
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
                  {availablePriorities.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={task?.dueDate}
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
                </div>
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

export default EditSubTask;
