import React, { useContext, useEffect, useState } from "react";
import "../Admin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

// Import icons from Material-UI
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LogoutIcon from "@mui/icons-material/Logout";

function UserControlPage() {
  const { authState, setAuthState } = useContext(AuthContext);
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "student", // Default role to "student"
  });

  let navigate = useNavigate();

  // const formatDate = (dateString, num) => {
  //   try {
  //     if (num === 1) return format(new Date(dateString), "dd/MM/yyyy");
  //     return format(new Date(dateString), "MM/yyyy");
  //   } catch {
  //     return "Invalid date";
  //   }
  // };
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      fullName: "",
      id: 0,
      role: "",
      status: false,
    });
    navigate("/tnhh2tv");
  };

  const fetchUsers = () => {
    const accessToken = localStorage.getItem("accessToken");

    fetch("http://localhost:3001/admin/users/details", {
      headers: { accessToken },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedUsers = data.map((account) => ({
          id: account.id,
          fullName: account.UserDetail?.fullName || "N/A",
          email: account.email,
          role: account.role,
        }));

        setUsers(formattedUsers); // Update the users state
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!confirmDelete) return; // If the user cancels, exit the function

    const accessToken = localStorage.getItem("accessToken");
    fetch(`http://localhost:3001/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        accessToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("User deleted successfully");
          fetchUsers(); // Refresh user list
        } else {
          alert("Failed to delete user");
        }
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const filteredUsers = users.filter((user) => {
    const fullName = user.fullName || ""; // Default to empty string if undefined
    const email = user.email || ""; // Default to empty string if undefined
    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleEdit = (id, updatedData) => {
    const accessToken = localStorage.getItem("accessToken");

    // Ensure birthDate is in YYYY-MM-DD format
    const formattedData = {
      ...updatedData,
      birthDate: updatedData.birthDate || null, // Send null if birthDate is empty
    };

    fetch(`http://localhost:3001/admin/update-user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accessToken,
      },
      body: JSON.stringify(formattedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(`Failed to update user: ${data.error}`);
        } else {
          alert("User updated successfully");
          fetchUsers(); // Refresh the user list after updating
        }
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  const openEditModal = (id) => {
    const accessToken = localStorage.getItem("accessToken");

    fetch(`http://localhost:3001/admin/users/details/${id}`, {
      headers: { accessToken },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching user details:", data.error);
          alert("Failed to fetch user details");
        } else {
          const birthDate = data.UserDetail?.birthDate
            ? new Date(data.UserDetail.birthDate).toISOString().split("T")[0] // Format to YYYY-MM-DD
            : "";

          const editingData = {
            id: data.id,
            fullName: data.UserDetail?.fullName || "",
            address: data.UserDetail?.address || "",
            phoneNumber: data.UserDetail?.phoneNumber || "",
            birthDate, // Use formatted date
          };
          setEditingUser(editingData); // Open modal with fetched data
        }
      })
      .catch((error) => console.error("Error fetching user details:", error));
  };

  const closeEditModal = () => {
    setEditingUser(null); // Đóng modal
  };
  const openViewModal = (id) => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`http://localhost:3001/admin/users/details/${id}`, {
      headers: { accessToken },
    })
      .then((response) => response.json())
      .then((data) => {
        setViewingUser(data); // Update the state with the fetched user data
      })
      .catch((error) => console.error("Error fetching user details:", error));
  };

  const closeViewModal = () => {
    setViewingUser(null);
  };
  const handleCreateUser = (e) => {
    e.preventDefault(); // Prevent form submission
    const accessToken = localStorage.getItem("accessToken"); // Get token

    // Step 1: Create User
    fetch("http://localhost:3001/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accessToken,
      },
      body: JSON.stringify(newUser), // Send newUser data
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(`Failed to create user: ${data.error}`);
        } else {
          alert("User created successfully");

          // Step 2: Refresh user list
          fetchUsers(); // Refresh the user list with updated data

          // Step 3: Reset the form fields and close the modal
          setNewUser({
            username: "",
            fullName: "",
            email: "",
            password: "",
            role: "student", // Default role
          });
          setShowCreateUserModal(false); // Close modal
        }
      })
      .catch((error) => console.error("Error creating user:", error));
  };

  return (
    <div className="container-fluid">
      {/* Sidebar Navigation */}
      <section className="admin__menu-navigation">
        <ul>
          <li className="no-hover">
            <div
              className="nav-header"
              onClick={() => navigate("/AdminDashboard")}
            >
              <span className="icon">
                <i className="fa-solid fa-gem"></i>
              </span>
              <span className="title">T&T Academy Admin</span>
            </div>
          </li>
          <li>
            <button
              className="nav-btn"
              onClick={() => navigate("/AdminDashboard/UsersControll")}
            >
              <span className="icon">
                <AccountCircleIcon />
              </span>
              <span className="title">Users</span>
            </button>
          </li>
          <li>
            <button
              className="nav-btn"
              onClick={() => navigate("/AdminDashboard/CoursesControll")}
            >
              <span className="icon">
                <AutoStoriesIcon />
              </span>
              <span className="title">Courses</span>
            </button>
          </li>

          <li>
            <button className="nav-btn" onClick={() => navigate("#")}>
              <span className="icon">
                <PlaylistPlayIcon />
              </span>
              <span className="title">Videos</span>
            </button>
          </li>

          <li>
            <button className="nav-btn" onClick={logout}>
              <span className="icon">
                <LogoutIcon />
              </span>
              <span className="title">Sign Out</span>
            </button>
          </li>
        </ul>
      </section>

      {/* Main Content */}
      <section className="admin__menu-main">
        <section className="topbar">
          <div className="admin__menu-topbar">
            <div className="admin__menu-toggle">
              <i className="fa-solid fa-bars"></i>
            </div>
            <div className="admin__menu-user">
              <p className="header__account-name">Admin</p>
              <i className="fa-solid fa-user-tie"></i>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mt-4 mb-4">User Management</h3>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateUserModal(true)} // Open modal
            >
              Add New User
            </button>
          </div>

          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm mr-2 action-btn"
                      onClick={() => openViewModal(user.id)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-warning btn-sm mr-2 action-btn"
                      onClick={() => openEditModal(user.id)} // Mở modal chỉnh sửa
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm action-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        {/* Modal edit user */}
        {editingUser && (
          <div className="modal-edit">
            <div className="modal-edit-content">
              <h3>Edit User</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit(editingUser.id, editingUser); // Save updated data
                  closeEditModal(); // Close the modal
                }}
              >
                <div className="row">
                  <div className="col-6">
                    <h5>Edit Details</h5>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUser.fullName}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            fullName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUser.address}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingUser.phoneNumber}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Birth Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={editingUser.birthDate || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            birthDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* modal view user */}
        {viewingUser && (
          <div className="modal-view">
            <div className="modal-view-content">
              <h3>User Details</h3>
              <ul>
                <li>
                  <strong>Username:</strong> {viewingUser.username || "N/A"}
                </li>
                <li>
                  <strong>Full Name:</strong>{" "}
                  {viewingUser.UserDetail?.fullName || "N/A"}
                </li>
                <li>
                  <strong>Email:</strong> {viewingUser.email}
                </li>
                <li>
                  <strong>Role:</strong> {viewingUser.role}
                </li>
                <li>
                  <strong>Address:</strong>{" "}
                  {viewingUser.UserDetail?.address || "N/A"}
                </li>
                <li>
                  <strong>Phone Number:</strong>{" "}
                  {viewingUser.UserDetail?.phoneNumber || "N/A"}
                </li>
                <li>
                  <strong>Birth Date:</strong>{" "}
                  {viewingUser.UserDetail?.birthDate || "N/A"}
                </li>
              </ul>
              <hr />
              <h4>Enrolled Courses:</h4>
              {viewingUser.Enrollments?.length > 0 ? (
                <ul>
                  {viewingUser.Enrollments.map((enrollment) => (
                    <li key={enrollment.Course.id}>
                      <strong>Course:</strong> {enrollment.Course.courseTitle}{" "}
                      <small>({enrollment.Course.status})</small>
                      <br />
                      <strong>Description:</strong>{" "}
                      {enrollment.Course.courseDesc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>This user is not enrolled in any courses.</p>
              )}
              <button className="btn btn-secondary" onClick={closeViewModal}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal Create User */}
        {showCreateUserModal && (
          <div className="modal-create">
            <div className="modal-create-content">
              <h3>Create New User</h3>
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newUser.fullName}
                    onChange={(e) =>
                      setNewUser({ ...newUser, fullName: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="Enter password"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
                <div className="d-flex mt-3">
                  <button type="submit" className="btn btn-success">
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateUserModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default UserControlPage;
