import React, { useState, useEffect } from "react";
import "./App.css";
import sume from "./sumedha.png";
const App = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [emailToDelete, setEmailToDelete] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);
  const [searchEmail, setSearchEmail] = useState("");  

  useEffect(() => {
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
  }, []);


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


  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
    setCurrentPage(1); 
  };


  const filteredUsers = userDetails.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="sam">
      <div>
        <h2>Dashboard For Sumedha International School<span><img className="sume" src={sume}></img></span></h2>
        <div>
        <h3>Search by Email</h3>
        <input
         className="search"
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={handleSearchChange}
        />
      </div>
        {deleteMessage && <p>{deleteMessage}</p>}
        <ul id="userList">
          {currentUsers.map((user, index) => (
            <li key={index}>
              <strong className="name">Name:</strong> <span style={{ color: 'black' }}>{user.name}</span> <br />
              <strong className="name">Email:</strong> <span style={{ color: 'black' }}>{user.email}</span> <br />
              <strong className="name">Subject:</strong> <span style={{ color: 'black' }}>{user.subject}</span> <br />
              <strong className="name">Message:</strong> <span style={{ color: 'black' }}>{user.message}</span>
            </li>
          ))}
        </ul>

        <div>
          <button className="button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button className="button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      <div className="sa">
       <div className="h3delete"><h3 >Delete Details</h3></div>
        <form id="deleteForm" onSubmit={handleDelete}>
          <label >
           <span className="de"> Email to delete:</span>
            <input className="delete"
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
