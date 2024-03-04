import React, { useState } from "react";

export const DUMMY = () => {
  const [circleName, setCircleName] = useState("");
  const [circles, setCircles] = useState([]);

  const addCircle = () => {
    setCircles([...circles, circleName]);
    setCircleName(""); // Reset the input field after adding a circle
  };

  return (
    <>
      <input
        type="text"
        value={circleName}
        onChange={(event) => setCircleName(event.target.value)}
      />
      <button onClick={addCircle}>Add Circle</button>

      {circles.map((value, index) => (
        <div
          key={index}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#3498db",
            borderRadius: "50%",
            margin: "10px",
          }}
        >
          {value}
        </div>
      ))}
    </>
  );
};

