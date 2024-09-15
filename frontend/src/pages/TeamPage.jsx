import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

function TeamsPage() {
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Fetch team details, tasks, and members
    const fetchTeamData = async () => {
      try {
        const teamRes = await axios.get('http://localhost:5000/teams/'); // Replace with your team endpoint
        const tasksRes = await axios.get('http://localhost:5000/tasks'); // Replace with your tasks endpoint
        const membersRes = await axios.get('http://localhost:5000/members'); // Replace with your members endpoint

        setTeam(teamRes.data);
        setTasks(tasksRes.data);
        setMembers(membersRes.data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchTeamData();
  }, []);

  // Helper functions to filter tasks
  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6">
        {/* Team Details */}
        <section className="mb-8 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Team Details</h2>
          {team ? (
            <div className="space-y-4">
              <p><strong>Name:</strong> {team.name}</p>
              <p><strong>No. of Members:</strong> {team.members.length}</p>
              <p><strong>No. of Tasks:</strong> {tasks.length}</p>
              <p><strong>No. of Assigned Tasks:</strong> {getTasksByStatus('assigned').length}</p>
              <p><strong>No. of Ongoing Tasks:</strong> {getTasksByStatus('ongoing').length}</p>
              <p><strong>No. of Completed Tasks:</strong> {getTasksByStatus('completed').length}</p>
            </div>
          ) : (
            <p>Loading team details...</p>
          )}
        </section>

        {/* Tasks Overview */}
        <section className="mb-8 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Tasks Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assigned Tasks */}
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Assigned Tasks</h3>
              {getTasksByStatus('assigned').length > 0 ? (
                <ul>
                  {getTasksByStatus('assigned').map(task => (
                    <li key={task.id} className="mb-2 p-2 bg-white rounded-md shadow-sm">
                      <p><strong>Task:</strong> {task.name}</p>
                      <p><strong>Assigned To:</strong> {task.assignedToEmail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No assigned tasks.</p>
              )}
            </div>

            {/* Ongoing Tasks */}
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Ongoing Tasks</h3>
              {getTasksByStatus('ongoing').length > 0 ? (
                <ul>
                  {getTasksByStatus('ongoing').map(task => (
                    <li key={task.id} className="mb-2 p-2 bg-white rounded-md shadow-sm">
                      <p><strong>Task:</strong> {task.name}</p>
                      <p><strong>Assigned To:</strong> {task.assignedToEmail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No ongoing tasks.</p>
              )}
            </div>

            {/* Completed Tasks */}
            <div className="bg-gray-100 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Completed Tasks</h3>
              {getTasksByStatus('completed').length > 0 ? (
                <ul>
                  {getTasksByStatus('completed').map(task => (
                    <li key={task.id} className="mb-2 p-2 bg-white rounded-md shadow-sm">
                      <p><strong>Task:</strong> {task.name}</p>
                      <p><strong>Assigned To:</strong> {task.assignedToEmail}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No completed tasks.</p>
              )}
            </div>
          </div>
        </section>

        {/* List of Members */}
        <section className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Members</h2>
          {members.length > 0 ? (
            <ul>
              {members.map(member => (
                <li key={member.id} className="mb-2 p-2 bg-gray-100 rounded-md shadow-sm">
                  <p><strong>Name:</strong> {member.name}</p>
                  <p><strong>Email:</strong> {member.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No members found.</p>
          )}
        </section>
      </div>
    </>
  );
}

export default TeamsPage;
