// src/pages/student/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import CodeEditor from "../../components/code-editor/CodeEditor";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");

  useEffect(() => {
    API.get(`/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.log(err));

    API.get(`/problems`) // fetch problems assigned to this event
      .then(res => setProblems(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleRun = () => {
    API.post("/submissions/run", { problemId: selectedProblem._id, code, language })
      .then(res => setOutput(res.data.output))
      .catch(err => console.log(err));
  };

  const handleSubmit = () => {
    API.post("/submissions/submit", { eventId: id, problemId: selectedProblem._id, code, language })
      .then(res => alert("Submission successful"))
      .catch(err => console.log(err));
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <hr />
      <h4>Problems</h4>
      <div className="d-flex gap-3">
        <div style={{ flex: 1 }}>
          {problems.map(p => (
            <div key={p._id} className={`p-2 mb-2 border ${selectedProblem?._id === p._id ? "bg-light" : ""}`} onClick={() => setSelectedProblem(p)}>
              {p.name}
            </div>
          ))}
        </div>
        <div style={{ flex: 2 }}>
          {selectedProblem && (
            <>
              <h5>{selectedProblem.name}</h5>
              <p>{selectedProblem.description}</p>
              <h6>Sample Test Cases:</h6>
              <pre>{JSON.stringify(selectedProblem.sampleTestCases, null, 2)}</pre>
              <CodeEditor code={code} setCode={setCode} language={language} />
              <div className="mt-2">
                <button className="btn btn-primary me-2" onClick={handleRun}>Run</button>
                <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
              </div>
              {output && (
                <div className="mt-2 p-2 border bg-light">
                  <h6>Output:</h6>
                  <pre>{output}</pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;