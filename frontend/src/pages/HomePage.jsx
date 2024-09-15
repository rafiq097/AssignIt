import React, { useEffect } from "react";
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { tasksAtom } from '../state/tasksAtom.js';
import { teamsAtom } from '../state/teamsAtom.js';
import { userAtom } from '../state/userAtom';
import NavBar from "../components/NavBar";

function HomePage() {
  const [teams, setTeams] = useRecoilState(teamsAtom);
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  const [user] = useRecoilState(userAtom);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Fetch the user's teams
          const teamsRes = await axios.get(`http://localhost:5000/teams/${user.id}`);
          setTeams(teamsRes.data.teams); // Set teams in Recoil atom

          // Fetch the user's tasks
          const tasksRes = await axios.get(`http://localhost:5000/tasks/${user.id}`);
          setTasks(tasksRes.data.tasks); // Set tasks in Recoil atom
        } catch (error) {
          console.error("Failed to fetch user teams and tasks", error);
        }
      }
    };

    fetchUserData();
  }, [user, setTeams, setTasks]);

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">

        <div className="grid grid-cols-3 gap-4">
          {/* Assigned Tasks */}
          <div className="bg-white shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Assigned Tasks</h2>
            {tasks.filter(task => task.status === 'Assigned').map(task => (
              <div key={task._id}>
                <p>{task.title}</p>
              </div>
            ))}
          </div>

          {/* Ongoing Tasks */}
          <div className="bg-white shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Ongoing Tasks</h2>
            {tasks.filter(task => task.status === 'Ongoing').map(task => (
              <div key={task._id}>
                <p>{task.title}</p>
              </div>
            ))}
          </div>

          {/* Completed Tasks */}
          <div className="bg-white shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Completed Tasks</h2>
            {tasks.filter(task => task.status === 'Completed').map(task => (
              <div key={task._id}>
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
