import React, { useEffect, useState } from "react";
// import {
//   managerProblemHistory,
//   managerUpdateProblem,
//   managerDeleteProblem,
// } from "../../services/api";

const MyProblems = () => {
  const [problems, setProblems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    difficulty: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await managerProblemHistory();
      setProblems(res.data || []);
    } catch (err) {
      console.error("Error fetching problems", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // Edit click
  const handleEdit = (problem) => {
    setEditId(problem._id);
    setEditData({
      title: problem.title,
      difficulty: problem.difficulty,
    });
  };

  // Handle change
  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update
  const handleUpdate = async (id) => {
    try {
      await managerUpdateProblem(id, editData);
      setEditId(null);
      fetchProblems();
    } catch (err) {
      console.error("Error updating problem", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;

    try {
      await managerDeleteProblem(id);
      fetchProblems();
    } catch (err) {
      console.error("Error deleting problem", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Problems</h2>

      <div className="card p-3 mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {problems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No problems found
                  </td>
                </tr>
              ) : (
                problems.map((p, index) => (
                  <tr key={p._id}>
                    <td>{index + 1}</td>

                    {/* Title */}
                    <td>
                      {editId === p._id ? (
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          value={editData.title}
                          onChange={handleChange}
                        />
                      ) : (
                        p.title
                      )}
                    </td>

                    {/* Difficulty */}
                    <td>
                      {editId === p._id ? (
                        <select
                          name="difficulty"
                          className="form-control"
                          value={editData.difficulty}
                          onChange={handleChange}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      ) : (
                        p.difficulty
                      )}
                    </td>

                    <td>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td>
                      {editId === p._id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdate(p._id)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(p._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyProblems;