import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditTask from "../components/EditTask.jsx";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom";

const CompletedTask = ({
  task,
  updateTaskStatus,
  updateTaskAssignedTo,
  users,
  handleOpenModal,
  handleCloseModal,
  handleDeleteTask,
  showEdit,
  setShowEdit,
}) => {
  const [selectedUser, setSelectedUser] = useState(task.assignedToEmail || "");
  const [user] = useRecoilState(userAtom);

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
      {console.log(user)}
      {user.role == "admin" && (
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
      <p className="text-gray-600">{task.description}</p>
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

export default CompletedTask;
