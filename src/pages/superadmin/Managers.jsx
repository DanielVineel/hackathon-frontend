// src/pages/superadmin/Managers.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [newManager, setNewManager] = useState({ name:"", email:"", password:"" });

  useEffect(() => {
    API.get("/superadmin/managers")
      .then(res=>setManagers(res.data))
      .catch(err=>console.log(err));
  }, []);

  const handleAdd = () => {
    API.post("/superadmin/managers", newManager)
      .then(res=>setManagers([...managers,res.data]))
      .catch(err=>console.log(err));
  };

  const handleDelete = (id) => {
    API.delete(`/superadmin/managers/${id}`)
      .then(()=>setManagers(managers.filter(m=>m._id!==id)))
      .catch(err=>console.log(err));
  };

  return (
    <div>
      <h2>Managers</h2>
      <div className="mb-2">
        <input className="form-control mb-1" placeholder="Name" value={newManager.name} onChange={e=>setNewManager({...newManager,name:e.target.value})}/>
        <input className="form-control mb-1" placeholder="Email" value={newManager.email} onChange={e=>setNewManager({...newManager,email:e.target.value})}/>
        <input className="form-control mb-1" type="password" placeholder="Password" value={newManager.password} onChange={e=>setNewManager({...newManager,password:e.target.value})}/>
        <button className="btn btn-success mt-1" onClick={handleAdd}>Add Manager</button>
      </div>
      {managers.map(m=>(
        <div key={m._id} className="border p-2 mb-2 d-flex justify-content-between">
          {m.name} ({m.email}) <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(m._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Managers;