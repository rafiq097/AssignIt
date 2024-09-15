import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { userAtom } from "../state/userAtom.js";
import NavBar from "../components/NavBar.jsx";
import toast from "react-hot-toast";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [user] = useRecoilState(userAtom);
  const [selectedTaskEmail, setSelectedTaskEmail] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (title.trim() === '') {
      return;
    }
    try
    {
      const newTask = { title, description };
      await axios.post('http://localhost:5000/tasks/create', newTask);
      toast.success("Task created successfully!");
      setTitle('');
      setDescription('');
      setIsFormVisible(false);
    }
    catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  useEffect(() => {
    const fetchTasksData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks/gettasks");
        setTasks(res.data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    fetchTasksData();
  }, []);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/tasks/update/${taskId}`, {
        status,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status } : task
        )
      );
      toast.success("Task status updated successfully!");
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const updateTaskAssignedTo = async (taskId) => {
    const email = selectedTaskEmail;
    setSelectedTaskEmail("");

    if (!email) {
      return toast.error("No email entered!");
    }

    try {
      await axios.put(`http://localhost:5000/tasks/update/${taskId}`, {
        assignedToEmail: email,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, assignedToEmail: email } : task
        )
      );
      toast.success("Task reassigned successfully!");
    } catch (error) {
      if (error.status === 404) {
        return toast.error("User not found");
      }

      console.error("Failed to update task assignment", error);
      toast.error("Failed to update assignment. Please try again.");
    }
  };

  const handleEmailChange = (taskId, value) => {
    setSelectedTaskEmail(value);
  };

  return (
    <>
      <NavBar />

      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setIsFormVisible((prev) => !prev)}
          >
            {isFormVisible ? "Cancel" : "Add New Task"}
          </button>
        </div>

        {isFormVisible && (
          <div className="flex justify-center mb-4">
            <form onSubmit={handleAddTodo} className="bg-white shadow-md rounded p-6 w-full md:w-1/2">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border rounded p-2 w-full"
                />
                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border rounded p-2 w-full"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assigned Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Assigned Tasks
            </h2>
            {tasks
              .filter((task) => task.status === "assigned")
              .map((task) => (
                <div
                  key={task._id}
                  className="mb-4 p-4 border border-gray-200 rounded"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Assigned to: {task.assignedToEmail || "None"}
                  </p>
                  <div className="mt-2">
                    <button
                      className="bg-yellow-500 text-white text-sm px-2 py-1 rounded mr-2"
                      onClick={() => updateTaskStatus(task._id, "ongoing")}
                    >
                      Mark as Ongoing
                    </button>
                    <button
                      className="bg-green-500 text-white text-sm px-2 py-1 rounded"
                      onClick={() => updateTaskStatus(task._id, "completed")}
                    >
                      Mark as Completed
                    </button>
                  </div>

                  {/* Assign to user */}
                  <div className="mt-4">
                    <input
                      type="email"
                      placeholder="Assign to (email)"
                      value={selectedTaskEmail}
                      onChange={(e) =>
                        handleEmailChange(task._id, e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                    <button
                      className="bg-blue-500 text-white text-sm px-2 py-1 mt-2 rounded"
                      onClick={() => updateTaskAssignedTo(task._id)}
                    >
                      Reassign Task
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Ongoing Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600">
              Ongoing Tasks
            </h2>
            {tasks
              .filter((task) => task.status === "ongoing")
              .map((task) => (
                <div
                  key={task._id}
                  className="mb-4 p-4 border border-gray-200 rounded"
                >
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
                      className="bg-green-500 text-white text-sm px-2 py-1 rounded"
                      onClick={() => updateTaskStatus(task._id, "completed")}
                    >
                      Mark as Completed
                    </button>
                  </div>

                  {/* Assign to user */}
                  <div className="mt-4">
                    <input
                      type="email"
                      placeholder="Assign to (email)"
                      value={selectedTaskEmail}
                      onChange={(e) =>
                        handleEmailChange(task._id, e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                    <button
                      className="bg-blue-500 text-white text-sm px-2 py-1 mt-2 rounded"
                      onClick={() => updateTaskAssignedTo(task._id)}
                    >
                      Reassign Task
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Completed Tasks */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Completed Tasks
            </h2>
            {tasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <div
                  key={task._id}
                  className="mb-4 p-4 border border-gray-200 rounded"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Assigned to: {task.assignedToEmail || "None"}
                  </p>
                  <p className="text-sm text-green-600 mt-2">Task Completed</p>
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
                    <input
                      type="email"
                      placeholder="Assign to (email)"
                      value={selectedTaskEmail}
                      onChange={(e) =>
                        handleEmailChange(task._id, e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                    <button
                      className="bg-blue-500 text-white text-sm px-2 py-1 mt-2 rounded"
                      onClick={() => updateTaskAssignedTo(task._id)}
                    >
                      Reassign Task
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
