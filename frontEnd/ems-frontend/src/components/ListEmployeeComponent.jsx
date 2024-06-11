// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/56.jpg";
import { ListEmployees, deleteEmployee } from "../services/EployeeService";
import { Link, useNavigate } from "react-router-dom";

const ListEmployeeComponent = () => {
  const [employees, setEmployees] = useState([]);
  const [approvedLeave, setApprovedLeave] = useState([]);

  const navigator = useNavigate();

  useEffect(() => {
    getAllEmployees();
  }, []);

  function getAllEmployees() {
    ListEmployees()
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function addNewEmployee() {
    navigator("/add-employees");
  }

  function updateEmployee(id) {
    // getAllEmployees();
    navigator(`/employees`);
  }

  const updateEmployeeLeave = async (employeeId, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/employees/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update employee leave");
      }
      // Handle success if needed
    } catch (error) {
      console.error("Error updating employee leave:", error.message);
      // Handle error if needed
    }
  };

  const handleApproveLeave = (employeeId) => {
    // Find the employee object by ID
    const employeeToUpdate = employees.find(
      (employee) => employee.id === employeeId
    );
    if (employeeToUpdate) {
      const updatedEmployee = { ...employeeToUpdate, leaveApproved: true };
      updateEmployeeLeave(employeeId, updatedEmployee);
      const updatedEmployees = employees.map((employee) =>
        employee.id === employeeId ? updatedEmployee : employee
      );
      getAllEmployees();
      updateEmployeeLeave(updatedEmployees);
    }
  };

  function removeEmployee(id) {
    console.log(id);

    deleteEmployee(id)
      .then((response) => {
        getAllEmployees();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  // Using React.Fragment to avoid an additional unnecessary div in the DOM
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div
        className="container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <h2 className="text-center">List of Employee Leaves</h2>
        <button className="btn btn-info mb-2" onClick={addNewEmployee}>
          Add Leaves
        </button>

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className={employee.leaveApproved ? "bg-success" : "bg-danger"}
              >
                <td className={employee.leaveApproved ? "bg-success" : ""}>
                  {employee.id}
                </td>
                <td className={employee.leaveApproved ? "bg-success" : ""}>
                  {employee.firstName}
                </td>
                <td className={employee.leaveApproved ? "bg-success" : ""}>
                  {employee.lastName}
                </td>
                <td className={employee.leaveApproved ? "bg-success" : ""}>
                  {employee.email}
                </td>
                <td className={employee.leaveApproved ? "bg-success" : ""}>
                  {employee.fromDate}
                </td>
                <td className={employee.leaveApproved ? "bg-success" : ""}>
                  {employee.toDate}
                </td>
                <td className={employee.leaveApproved ? "bg-success" : ""}>
                  {employee.leaveApproved ? (
                    ""
                  ) : (
                    <Link to={`/edit-employee/${employee.id}`}>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => updateEmployee(employee.id)}
                      >
                        Update
                      </button>
                    </Link>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeEmployee(employee.id)}
                  >
                    Delete
                  </button>
                  {employee.leaveApproved ? null : (
                    <button
                      className="btn btn-success ms-2"
                      onClick={() => handleApproveLeave(employee.id)}
                    >
                      Approve leave
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListEmployeeComponent;
