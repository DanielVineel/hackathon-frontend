// src/pages/manager/CreateEvent.jsx
import React, { useState, useEffect } from "react";
import API from "../../api/api";

const CreateEvent = () => {
  const [event, setEvent] = useState({ name: "", description: "", fee: 0, prizeMoney: 0, startDate: "", endDate: "" });
  const [problems, setProblems] = useState([]);
  const [assignedProblems, setAssignedProblems] = useState([]);

  useEffect(() => {
    API.get("/manager/problems")
      .then(res => setProblems(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleCreate = () => {
    API.post("/manager/events", {...event, problems: assignedProblems})
      .then(res => alert("Event created"))
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>Create Event</h2>
      <div className="mb-2">
        <input type="text" className="form-control mb-1" placeholder="Event Name" value={event.name} onChange={e => setEvent({...event, name:e.target.value})}/>
        <textarea className="form-control" placeholder="Description" value={event.description} onChange={e => setEvent({...event, description:e.target.value})}></textarea>
      </div>
      <div className="mb-2">
        <input type="number" className="form-control mb-1" placeholder="Fee" value={event.fee} onChange={e => setEvent({...event, fee:e.target.value})}/>
        <input type="number" className="form-control mb-1" placeholder="Prize Money" value={event.prizeMoney} onChange={e => setEvent({...event, prizeMoney:e.target.value})}/>
      </div>
      <div className="mb-2">
        <label>Start Date:</label>
        <input type="datetime-local" className="form-control mb-1" value={event.startDate} onChange={e => setEvent({...event, startDate:e.target.value})}/>
        <label>End Date:</label>
        <input type="datetime-local" className="form-control" value={event.endDate} onChange={e => setEvent({...event, endDate:e.target.value})}/>
      </div>
      <div className="mb-2">
        <h5>Assign Problems</h5>
        {problems.map(p => (
          <div key={p._id}>
            <input type="checkbox" value={p._id} onChange={e => {
              if(e.target.checked) setAssignedProblems([...assignedProblems, p._id]);
              else setAssignedProblems(assignedProblems.filter(id=>id!==p._id));
            }} />
            {p.name}
          </div>
        ))}
      </div>
      <button className="btn btn-success mt-2" onClick={handleCreate}>Create Event</button>
    </div>
  );
};

export default CreateEvent;