import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTask from "../components/EditTask.jsx";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom";

const OngoingTask = ({
  task,
  updateTaskStatus,
  updateTaskAssignedTo,
  users,
  handleOpenModal,
  handleCloseModal,
  handleDeleteTask,
  showEdit,
  setShowEdit,
  renderDescription,
}) => {
  const [selectedUser, setSelectedUser] = useState(task.assignedToEmail || "");
  const [userData, setUserData] = useRecoilState(userAtom);

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
    <div className="relative mb-4 p-4 border border-gray-200 rounded">
      {console.log(userData)}
      {userData?.role == "admin" && (
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
      )}

      <h3 className="font-bold">{task.title}</h3>
      {/* <p className="text-gray-600">{task.description}</p> */}
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={renderDescription(task.description)}
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

      {showEdit && <EditTask task={task} onClose={handleCloseModal} />}
    </div>
  );
};

export default OngoingTask;
