import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const AddSubTask = ({
  index,
  subTask,
  users,
  parentPriority,
  parentDate,
  onSubTaskChange,
  onDelete,
}) => {
  const handleSubTaskChange = (e) => {
    const { name, value } = e.target;
    onSubTaskChange({ ...subTask, [name]: value });
  };

  const getAvailablePriorities = () => {
    const priorities = ["low", "medium", "high", "urgent"];
    const parentIndex = priorities.indexOf(parentPriority);
    return priorities.slice(parentIndex);
  };

  return (
    <div className="relative border p-4 mb-4 rounded-lg bg-gray-50">
      <button
        type="button"
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={onDelete}
      >
        <FaTrashAlt size={18} />
      </button>

      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Subtask {index + 1}
      </h3>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Subtask Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="Enter subtask title"
          value={subTask.title}
          onChange={handleSubTaskChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Description
        </label>
        <textarea
          name="description"
          placeholder="Enter subtask description"
          value={subTask.description}
          onChange={handleSubTaskChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Status
        </label>
        <select
          name="status"
          value={subTask.status}
          onChange={handleSubTaskChange}
          className="border rounded-lg p-2 w-full"
        >
          <option value="assigned">Assigned</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Priority
        </label>
        <select
          name="priority"
          value={subTask.priority}
          onChange={handleSubTaskChange}
          className="border rounded-lg p-2 w-full"
        >
          {getAvailablePriorities().map((priority) => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          min={new Date().toISOString().split("T")[0]}
          max={parentDate}
          value={subTask.dueDate}
          onChange={handleSubTaskChange}
          className="border rounded-lg p-2 w-full "
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold mb-1">
          Assign To
        </label>
        <select
          name="assignedToEmail"
          value={subTask.assignedToEmail}
          onChange={handleSubTaskChange}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">Assign to user</option>
          {users.map((user) => (
            <option key={user._id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddSubTask;
