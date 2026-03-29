import React, { useState, useEffect } from "react";

const defaultForm = {
  name: "",
  statement: "",
  level: "easy",
  score: 100,
  sampleTestCases: [{ input: "", output: "", explanation: "" }],
  hiddenTestCases: [{ input: "", output: "" }],
};

const ProblemFormModal = ({ problem, onClose, refresh }) => {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (problem) {
      setFormData(problem);
    } else {
      setFormData(defaultForm);
    }
  }, [problem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: name === "score" ? Number(value) : value,
    }));
  };

  const updateArray = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index] = { ...updated[index], [field]: value };

    setFormData((p) => ({
      ...p,
      [type]: updated,
    }));
  };

  const addItem = (type, template) => {
    setFormData((p) => ({
      ...p,
      [type]: [...p[type], template],
    }));
  };

  const removeItem = (type, index) => {
    setFormData((p) => ({
      ...p,
      [type]: p[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = problem
      ? `/api/problems/${problem._id}`
      : `/api/problems`;

    const method = problem ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    refresh();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{problem ? "Edit Problem" : "Create Problem"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Problem Name"
            required
          />

          <textarea
            name="statement"
            value={formData.statement}
            onChange={handleChange}
            placeholder="Statement"
            required
          />

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
          />

          {/* SAMPLE TEST CASES */}
          <h4>Sample Test Cases</h4>
          {formData.sampleTestCases.map((tc, i) => (
            <div key={i}>
              <textarea
                placeholder="Input"
                value={tc.input}
                onChange={(e) =>
                  updateArray("sampleTestCases", i, "input", e.target.value)
                }
              />
              <textarea
                placeholder="Output"
                value={tc.output}
                onChange={(e) =>
                  updateArray("sampleTestCases", i, "output", e.target.value)
                }
              />

              <button
                type="button"
                onClick={() => removeItem("sampleTestCases", i)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              addItem("sampleTestCases", {
                input: "",
                output: "",
                explanation: "",
              })
            }
          >
            + Add Sample
          </button>

          {/* HIDDEN TEST CASES */}
          <h4>Hidden Test Cases</h4>
          {formData.hiddenTestCases.map((tc, i) => (
            <div key={i}>
              <textarea
                placeholder="Input"
                value={tc.input}
                onChange={(e) =>
                  updateArray("hiddenTestCases", i, "input", e.target.value)
                }
              />
              <textarea
                placeholder="Output"
                value={tc.output}
                onChange={(e) =>
                  updateArray("hiddenTestCases", i, "output", e.target.value)
                }
              />

              <button
                type="button"
                onClick={() => removeItem("hiddenTestCases", i)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              addItem("hiddenTestCases", {
                input: "",
                output: "",
              })
            }
          >
            + Add Hidden
          </button>

          <div className="modal-actions">
            <button type="submit">
              {problem ? "Update" : "Create"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemFormModal;