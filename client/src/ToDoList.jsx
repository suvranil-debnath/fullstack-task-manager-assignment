import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { server } from "./main";
import axios from "axios";
import { LuDelete } from "react-icons/lu";
import Collapsible from "react-collapsible";

const ToDoList = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", progress: 0 });
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    const fetchToDoList = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${server}/api/todolist/${userId}`);
        const { tasks } = response.data;

        const updatedTasks = tasks.map((task) => {
          const total = task.subtasks.length;
          const completed = task.subtasks.filter((s) => s.completionStatus).length;
          const progress = total > 0 ? (completed / total) * 100 : 0;
          return { ...task, progress };
        });

        setTasks(updatedTasks);
        calculateTaskStatus(updatedTasks);
      } catch (err) {
        setError("Failed to fetch ToDo list. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchToDoList();
  }, [userId]);

  const calculateTaskStatus = (tasks) => {
    const status = { ongoing: 0, inProcess: 0, completed: 0 };
    tasks.forEach((task) => {
      const total = task.subtasks.length;
      const completed = task.subtasks.filter((s) => s.completionStatus).length;
      if (completed === 0) status.ongoing++;
      else if (completed < total) status.inProcess++;
      else status.completed++;
    });
    setTaskStatus(status);
  };

  const addTask = async () => {
  if (!newTask.title) return alert("Please enter a valid task title.");
  try {
    const response = await axios.post(`${server}/api/todolist/${userId}`, {
      tasks: [...tasks, { title: newTask.title, subtasks: [] }],
    });

    const updatedTasksRaw = response.data.toDoList.tasks;

    const updatedTasks = updatedTasksRaw.map((task) => {
      const total = task.subtasks.length;
      const completed = task.subtasks.filter((s) => s.completionStatus).length;
      return { ...task, progress: total ? (completed / total) * 100 : 0 };
    });

    setTasks(updatedTasks);
    calculateTaskStatus(updatedTasks);
    setNewTask({ title: "", progress: 0 });
  } catch {
    alert("Failed to add task. Please try again.");
  }
};


  const addSubtask = async (taskId) => {
    if (!newSubtask) return alert("Please enter a valid subtask title.");
    try {
      await axios.post(`${server}/api/todolist/${userId}/${taskId}/subtask`, {
        title: newSubtask,
      });
      const res = await axios.get(`${server}/api/todolist/${userId}`);
      const tasks = res.data.tasks.map((task) => {
        const total = task.subtasks.length;
        const completed = task.subtasks.filter((s) => s.completionStatus).length;
        return { ...task, progress: total ? (completed / total) * 100 : 0 };
      });
      setTasks(tasks);
      calculateTaskStatus(tasks);
      setNewSubtask("");
    } catch {
      alert("Failed to add subtask. Please try again.");
    }
  };

  const toggleSubtaskCompletion = async (taskId, subtaskId) => {
    try {
      await axios.put(`${server}/api/todolist/${userId}/${taskId}/${subtaskId}`);
      const updated = tasks.map((task) => {
        if (task._id === taskId) {
          task.subtasks = task.subtasks.map((s) =>
            s._id === subtaskId ? { ...s, completionStatus: !s.completionStatus } : s
          );
          const total = task.subtasks.length;
          const completed = task.subtasks.filter((s) => s.completionStatus).length;
          task.progress = total ? (completed / total) * 100 : 0;
        }
        return task;
      });
      setTasks(updated);
      calculateTaskStatus(updated);
    } catch {
      alert("Failed to update subtask.");
    }
  };

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      await axios.delete(`${server}/api/todolist/${userId}/${taskId}/${subtaskId}`);
      const updated = tasks.map((task) => {
        if (task._id === taskId) {
          task.subtasks = task.subtasks.filter((s) => s._id !== subtaskId);
          const total = task.subtasks.length;
          const completed = task.subtasks.filter((s) => s.completionStatus).length;
          task.progress = total ? (completed / total) * 100 : 0;
        }
        return task;
      });
      setTasks(updated);
      calculateTaskStatus(updated);
    } catch {
      alert("Failed to delete subtask.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${server}/api/todolist/${userId}/${taskId}`);
      const updated = tasks.filter((t) => t._id !== taskId);
      setTasks(updated);
      calculateTaskStatus(updated);
    } catch {
      alert("Failed to delete task.");
    }
  };

  if (loading) return <div className="text-center py-8 dark:text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8 dark:text-red-400">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md dark:shadow-lg rounded-xl max-w-md mx-auto p-6 mt-10">
      {/* Task Status Section */}
      <div className="flex justify-between mb-6 gap-2">
        {[
          { color: "bg-red-500", label: "Not Started", count: taskStatus.ongoing || 0 },
          { color: "bg-yellow-400", label: "In Process", count: taskStatus.inProcess || 0 },
          { color: "bg-green-600", label: "Completed", count: taskStatus.completed || 0 },
        ].map(({ color, label, count }, i) => (
          <div key={i} className={`text-white p-4 rounded-xl text-center flex-1 ${color}`}>
            <p className="font-semibold text-lg">{label}</p>
            <p className="text-sm">{count} Tasks</p>
          </div>
        ))}
      </div>

      {/* Add Task Section */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md focus:outline-none focus:ring focus:border-green-500"
        />
        <button
          onClick={addTask}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Task
        </button>
      </div>

      {/* Recent Tasks Section */}
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <p className="dark:text-white">No tasks available. Add your first task!</p>
      ) : (
        tasks.map((task) => (
          <Collapsible
            key={task._id}
            trigger={
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-3 hover:shadow-md transition-all">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">{task.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{task.subtasks.length} Subtasks</p>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="stroke-gray-300 dark:stroke-gray-600"
                      d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                      fill="none"
                      strokeWidth="3"
                    />
                    <path
                      className="stroke-green-600"
                      d="M18 2.5 a 15.5 15.5 0 1 1 0 31 a 15.5 15.5 0 1 1 0 -31"
                      fill="none"
                      strokeWidth="3"
                      strokeDasharray={`${task.progress}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-xs mt-1 dark:text-white">{task.progress.toFixed(0)}%</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id);
                  }}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  <LuDelete />
                </button>
              </div>
            }
            className="mb-2"
          >
            <div className="space-y-2 mb-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask._id} className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completionStatus}
                      onChange={() => toggleSubtaskCompletion(task._id, subtask._id)}
                      className="accent-green-600"
                    />
                    <span className={subtask.completionStatus ? "line-through text-gray-500 dark:text-gray-400" : "dark:text-white"}>
                      {subtask.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSubtask(task._id, subtask._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <LuDelete />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 px-4 py-2">
              <input
                type="text"
                placeholder="New Subtask Title"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md"
              />
              <button
                onClick={() => addSubtask(task._id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Subtask
              </button>
            </div>
          </Collapsible>
        ))
      )}
    </div>
  );
};

export default ToDoList;
