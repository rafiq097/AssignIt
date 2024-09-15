import React, { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsPlusCircle } from "react-icons/bs";
import NavBar from "../components/NavBar";
import { useRecoilState } from "recoil";
import { tasksAtom } from "../state/tasksAtom";
import axios from "axios";
import toast from "react-hot-toast";

const TaskPage = () => {
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", status: "Assigned" });
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks/get");
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  const handleFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const createTask = async () => {
    try {
      const res = await axios.post("http://localhost:5000/tasks/create", taskForm);
      setTasks([...tasks, res.data.task]);
      toast.success("Task created successfully!");
      setTaskForm({ title: "", status: "Assigned" });
    } catch (err) {
      toast.error("Error creating task");
    }
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTaskForm(taskToEdit);
    setIsEditing(true);
    setCurrentTaskId(taskId);
  };

  const updateTask = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/tasks/${currentTaskId}`, taskForm);
      const updatedTasks = tasks.map((task) =>
        task.id === currentTaskId ? res.data.task : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully!");
      resetForm();
    } catch (err) {
      toast.error("Error updating task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Error deleting task");
    }
  };

  const resetForm = () => {
    setTaskForm({ title: "", status: "Assigned" });
    setIsEditing(false);
    setCurrentTaskId(null);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-6">
        <h1 className="text-4xl font-bold mb-8">Manage Your Tasks</h1>

        {/* Task Form */}
        <div className="bg-white shadow-md rounded-md p-4 mb-6 w-2/3">
          <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Edit Task" : "Create New Task"}</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleFormChange}
              placeholder="Task Title"
              className="border p-2 rounded-md w-full"
            />
            <select
              name="status"
              value={taskForm.status}
              onChange={handleFormChange}
              className="border p-2 rounded-md w-full"
            >
              <option value="Assigned">Assigned</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            onClick={isEditing ? updateTask : createTask}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            {isEditing ? "Update Task" : "Create Task"}
          </button>
          {isEditing && (
            <button onClick={resetForm} className="ml-4 px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600">
              Cancel
            </button>
          )}
        </div>

        {/* Task Columns */}
        <div className="flex justify-center w-full gap-4 px-4">
          {/* Assigned Tasks */}
          <TaskColumn
            title="Assigned Tasks"
            tasks={tasks.filter((task) => task.status === "Assigned")}
            editTask={editTask}
            deleteTask={deleteTask}
          />

          {/* Ongoing Tasks */}
          <TaskColumn
            title="Ongoing Tasks"
            tasks={tasks.filter((task) => task.status === "Ongoing")}
            editTask={editTask}
            deleteTask={deleteTask}
          />

          {/* Completed Tasks */}
          <TaskColumn
            title="Completed Tasks"
            tasks={tasks.filter((task) => task.status === "Completed")}
            editTask={editTask}
            deleteTask={deleteTask}
          />
        </div>
      </div>
    </>
  );
};

const TaskColumn = ({ title, tasks, editTask, deleteTask }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4 w-1/3">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-50 p-4 rounded-md flex justify-between items-center shadow-sm"
          >
            <p className="text-lg">{task.title}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => editTask(task.id)}
                className="text-yellow-500 hover:text-yellow-600"
              >
                <AiOutlineEdit size={24} />
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-600"
              >
                <AiOutlineDelete size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPage;
