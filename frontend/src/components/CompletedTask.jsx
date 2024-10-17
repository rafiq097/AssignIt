import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom";
import { useNavigate } from "react-router-dom";

const CompletedTask = ({
  task,
  updateTaskStatus,
  updateTaskAssignedTo,
  users,
  handleEditTask,
  handleDeleteTask,
  handleAddSubTask,
  handleSubEditTask,
  deleteSubTask,
}) => {
  const [selectedUser, setSelectedUser] = useState(task.assignedToEmail || "");
  const [userData, setUserData] = useRecoilState(userAtom);
  const navigate = useNavigate();

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
    verify();
  }, []);

  const handleChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleAssign = () => {
    updateTaskAssignedTo(task._id, selectedUser);
  };

  const notifyEmail = async () => {
    try {
      await axios.post("/tasks/notify", {
        taskId: task._id,
        assignedToEmail: selectedUser,
      });
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Failed to send notification", error);
      toast.error("Failed to send notification. Please try again.");
    }
  };

  return (
    <div
      onDoubleClick={() => navigate(`/viewtask/${task._id}`)}
      className="relative mb-4 p-4 border border-gray-200 rounded"
    >
      {console.log(userData)}
      {userData?.role == "admin" && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleEditTask(task._id)}
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
      )}

      <h3 className="font-bold">{task.title}</h3>
      {/* <p className="text-gray-600">{task.description}</p> */}
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{
          __html: task.description.replace(
            /a /g,
            'a style="color: blue; text-decoration: underline;" '
          ),
        }}
      />

      <p className="text-sm text-gray-500">
        Assigned to: {task.assignedToEmail || "None"}
      </p>
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

      {/* Assign to user */}
      <div className="mt-4">
        <select
          value={selectedUser}
          onChange={handleChange}
          className="border rounded p-1 w-full"
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.email} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white text-sm px-2 py-1 mt-2 rounded"
          onClick={handleAssign}
        >
          Reassign Task
        </button>
        <button
          className="bg-blue-500 text-white text-sm px-2 py-1 mt-2 ml-2 rounded"
          onClick={notifyEmail}
        >
          Notify
        </button>
      </div>

      <div className="mt-4 flex ">
        <div className="flex flex-col items-center w-1/5">
          <IoAddCircleOutline
            size={30}
            onClick={() => handleAddSubTask(task)}
          />
          <span className="text-sm font-medium">Sub</span>
        </div>

        <div className="w-4/5 ml-4">
          {task.subTasks.map((subTask, index) => (
            <div
              key={index}
              className="mb-2 p-2 border border-gray-300 rounded bg-gray-50 relative"
            >
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleSubEditTask(task._id, subTask._id)}
                >
                  <FaEdit size={15} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteSubTask(task._id, subTask._id)}
                >
                  <FaTrash size={15} />
                </button>
              </div>
              <h4 className="text-sm font-bold">{subTask.title}</h4>
              {/* <p className="text-xs text-gray-600">
                            {subTask.description}
                          </p> */}
              <div
                className="text-xs text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: subTask.description.replace(
                    /a /g,
                    'a style="color: blue; text-decoration: underline;" '
                  ),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedTask;
