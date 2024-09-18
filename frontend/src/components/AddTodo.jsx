import React, { useState } from 'react'
import toast from "react-hot-toast";
import axios from "axios";

const AddTodo = ({ assignedToEmail }) => {
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
        const newTask = { title, description, assignedToEmail };
        await axios.post('/tasks/create', newTask);
        toast.success("Task created successfully!");
        setTitle('');
        setDescription('');
        setIsFormVisible(false);
        window.location.reload();
      }
      catch (error) {
        console.error("Failed to add task", error);
        toast.error("Failed to add task. Please try again.");
      }
    };

    return (
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
    )
}

export default AddTodo