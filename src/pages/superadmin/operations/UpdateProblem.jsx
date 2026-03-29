import React, { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
import API from "../../../api/api";

const UpdateProblem = ({ isOpen, problem, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "easy",
    score: 100,
    sampleTestCases: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }]
  });

  useEffect(() => {
    if (problem) {
      setFormData({
        title: problem.title || "",
        description: problem.description || "",
        level: problem.level || "easy",
        score: problem.score || 100,
        sampleTestCases: problem.sampleTestCases || [{ input: "", output: "", explanation: "" }],
        hiddenTestCases: problem.hiddenTestCases || [{ input: "", output: "" }]
      });
    }
  }, [problem, isOpen]);

  const handleSaveTestCase = (index, field, value, testCaseType = "sample") => {
    const key = testCaseType === "sample" ? "sampleTestCases" : "hiddenTestCases";
    const updated = [...formData[key]];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, [key]: updated });
  };

  const handleAddTestCase = (testCaseType = "sample") => {
    const key = testCaseType === "sample" ? "sampleTestCases" : "hiddenTestCases";
    const newTestCase = testCaseType === "sample"
      ? { input: "", output: "", explanation: "" }
      : { input: "", output: "" };
    setFormData({
      ...formData,
      [key]: [...formData[key], newTestCase]
    });
  };

  const handleRemoveTestCase = (index, testCaseType = "sample") => {
    const key = testCaseType === "sample" ? "sampleTestCases" : "hiddenTestCases";
    setFormData({
      ...formData,
      [key]: formData[key].filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.level) {
      alert("Please fill in required fields: title, description, and Level");
      return;
    }

    try {
      setLoading(true);
      const saveData = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        score: formData.score,
        sampleTestCases: formData.sampleTestCases.filter(tc => tc.input && tc.output),
        hiddenTestCases: formData.hiddenTestCases.filter(tc => tc.input && tc.output)
      };

      await API.put(`/superadmin/problem/update/${problem._id}`, saveData);
      alert("Problem updated successfully!");
      onClose();
      onSuccess();
    } catch (err) {
      alert("Error updating problem: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Problem"
      size="large"
    >
      <div className="modal-content problem-form-modal">
        {/* Basic Info */}
        <div className="form-section">
          <h3 className="form-section-title">Basic Information</h3>
          
          <div className="form-group">
            <label>Problem Name *</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="e.g., Two Sum Problem"
            />
          </div>

          <div className="form-group">
            <label>Problem Statement *</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows="4"
              placeholder="Detailed problem description..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Difficulty Level *</label>
              <select
                value={formData.level || "easy"}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="form-input"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Score Points</label>
              <input
                type="number"
                value={formData.score || 100}
                onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
                className="form-input"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Sample Test Cases */}
        <div className="form-section">
          <div className="form-section-header">
            <h3 className="form-section-title">Sample Test Cases</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => handleAddTestCase("sample")}
            >
              + Add Sample
            </button>
          </div>

          {formData.sampleTestCases.map((testCase, index) => (
            <div key={index} className="test-case-group">
              <div className="test-case-header">
                <span className="test-case-number">Sample #{index + 1}</span>
                {formData.sampleTestCases.length > 1 && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveTestCase(index, "sample")}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Input</label>
                  <textarea
                    value={testCase.input || ""}
                    onChange={(e) => handleSaveTestCase(index, "input", e.target.value, "sample")}
                    className="form-input"
                    rows="2"
                    placeholder="e.g., 2 7 11 15\n9"
                  />
                </div>
                <div className="form-group">
                  <label>Output</label>
                  <textarea
                    value={testCase.output || ""}
                    onChange={(e) => handleSaveTestCase(index, "output", e.target.value, "sample")}
                    className="form-input"
                    rows="2"
                    placeholder="e.g., 0 1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Explanation</label>
                <textarea
                  value={testCase.explanation || ""}
                  onChange={(e) => handleSaveTestCase(index, "explanation", e.target.value, "sample")}
                  className="form-input"
                  rows="2"
                  placeholder="Optional explanation for this test case"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Hidden Test Cases */}
        <div className="form-section">
          <div className="form-section-header">
            <h3 className="form-section-title">Hidden Test Cases</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => handleAddTestCase("hidden")}
            >
              + Add Hidden
            </button>
          </div>

          {formData.hiddenTestCases.map((testCase, index) => (
            <div key={index} className="test-case-group">
              <div className="test-case-header">
                <span className="test-case-number">Hidden #{index + 1}</span>
                {formData.hiddenTestCases.length > 1 && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveTestCase(index, "hidden")}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Input</label>
                  <textarea
                    value={testCase.input || ""}
                    onChange={(e) => handleSaveTestCase(index, "input", e.target.value, "hidden")}
                    className="form-input"
                    rows="2"
                    placeholder="e.g., 3 2 5 6\n5"
                  />
                </div>
                <div className="form-group">
                  <label>Output</label>
                  <textarea
                    value={testCase.output || ""}
                    onChange={(e) => handleSaveTestCase(index, "output", e.target.value, "hidden")}
                    className="form-input"
                    rows="2"
                    placeholder="e.g., 2 3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Problem"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateProblem;
