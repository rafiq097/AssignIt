import React from "react";
import { FaTrashAlt } from "react-icons/fa"; // Import trash icon

const AddSubTask = ({
  index,
  subTask,
  users,
  parentPriority,
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
    <div className="relative border p-4 mb-2 rounded-lg">
      <button
        type="button"
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={onDelete}
      >
        <FaTrashAlt size={18} />
      </button>

      <h3 className="text-lg font-semibold text-gray-700 mb-3">
        Subtask {index + 1}
      </h3>
      <input
        type="text"
        name="title"
        placeholder="Enter subtask title"
        value={subTask.title}
        onChange={handleSubTaskChange}
        className="border rounded-lg p-2 w-full mb-2"
      />
      <textarea
        name="description"
        placeholder="Enter subtask description"
        value={subTask.description}
        onChange={handleSubTaskChange}
        className="border rounded-lg p-2 w-full mb-2"
      />
      <select
        name="status"
        value={subTask.status}
        onChange={handleSubTaskChange}
        className="border rounded-lg p-2 w-full mb-2"
      >
        <option value="assigned">Assigned</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
      <select
        name="priority"
        value={subTask.priority}
        onChange={handleSubTaskChange}
        className="border rounded-lg p-2 w-full mb-2"
      >
        {getAvailablePriorities().map((priority) => (
          <option key={priority} value={priority}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="dueDate"
        value={subTask.dueDate}
        onChange={handleSubTaskChange}
        className="border rounded-lg p-2 w-full mb-2"
      />
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
  );
};

export default AddSubTask;
