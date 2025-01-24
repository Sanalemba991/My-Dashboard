import React, { useState, useEffect } from "react";
import "./App.css";
const App = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [emailToDelete, setEmailToDelete] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  
  useEffect(() => {
    // Fetch user details when the component is mounted
    fetch("http://localhost:4000/api/details")
      .then((response) => response.json())
      .then((data) => {
        if (data.userDetails) {
          setUserDetails(data.userDetails);
        } else {
          setDeleteMessage("No user details found.");
        }
      })
      .catch((error) => {
        setDeleteMessage("Error fetching user details.");
        console.error("Error fetching user details:", error);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleDelete = (e) => {
    e.preventDefault();

    if (!emailToDelete.trim()) {
      setDeleteMessage("Please enter an email.");
      return;
    }

    fetch("http://localhost:4000/api/details", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailToDelete }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setDeleteMessage(data.message);
          setEmailToDelete("");
          // Remove user from state list
          setUserDetails((prevDetails) =>
            prevDetails.filter((user) => user.email !== emailToDelete)
          );
        } else {
          setDeleteMessage(data.error);
        }
      })
      .catch((error) => {
        setDeleteMessage("Error deleting user.");
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div>
      <div>
        <h2>Dashboard</h2>
        {deleteMessage && <p>{deleteMessage}</p>}
        <ul id="userList">
          {userDetails.map((user, index) => (
            <li key={index}>
              <strong>Name:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email} <br />
              <strong>Subject:</strong> {user.subject} <br />
              <strong>Message:</strong> {user.message}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Delete  Details</h3>
        <form id="deleteForm" onSubmit={handleDelete}>
          <label>
            Email to delete:
            <input
              type="email"
              id="emailToDelete"
              value={emailToDelete}
              onChange={(e) => setEmailToDelete(e.target.value)}
            />
          </label>
          <button type="submit">Delete</button>
        </form>
      </div>
    </div>
  );
};

export default App;
