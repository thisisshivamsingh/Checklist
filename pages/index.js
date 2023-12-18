import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import data from "../data/data.json";
import React, { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [tableDetails, setTableDetails] = useState([]);

  const handleDepartmentChange = (departmentId) => {
    const employeesInDepartment = data.employee.filter(
      (employee) => employee.departmentId === departmentId
    );

    const allEmployeesSelected = employeesInDepartment.every((employee) =>
      selectedEmployees.some((emp) => emp.id === employee.id)
    );

    if (selectedDepartments.includes(departmentId)) {
      setSelectedDepartments(
        selectedDepartments.filter((id) => id !== departmentId)
      );
      setSelectedEmployees(
        selectedEmployees.filter(
          (employee) =>
            !employeesInDepartment.some((emp) => emp.id === employee.id)
        )
      );
    } else {
      if (!allEmployeesSelected) {
        setSelectedEmployees([...selectedEmployees, ...employeesInDepartment]);
      }

      setSelectedDepartments([...selectedDepartments, departmentId]);
    }
  };

  const handleEmployeeChange = (employeeId) => {
    const employee = data.employee.find(
      (employee) => employee.id === employeeId
    );

    if (selectedEmployees.some((employee) => employee.id === employeeId)) {
      setSelectedEmployees(
        selectedEmployees.filter((employee) => employee.id !== employeeId)
      );
    } else {
      setSelectedEmployees([...new Set([...selectedEmployees, employee])]);
    }

    const departmentId = employee.departmentId;
    const employeesInDepartment = data.employee.filter(
      (employee) => employee.departmentId === departmentId
    );
    const allEmployeesSelected = employeesInDepartment.every((employee) =>
      selectedEmployees.every((emp) => emp.id === employee.id)
    );

    if (allEmployeesSelected) {
      if (!selectedDepartments.includes(departmentId)) {
        setSelectedDepartments([...selectedDepartments, departmentId]);
      }
    } else {
      setSelectedDepartments(
        selectedDepartments.filter((id) => id !== departmentId)
      );
    }
  };

  const handleSubmit = () => {
    setTableDetails(selectedEmployees);
  };

  return (
    <div className="container mt-4 ml-0">
      <p>
        <strong>Department</strong>
      </p>
      {data.department.map((department) => (
        <div key={department.id}>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={selectedDepartments.includes(department.id)}
              onChange={() => handleDepartmentChange(department.id)}
            />
            <label className="form-check-label">
              <strong>{department.name}</strong>
            </label>
          </div>
          <div style={{ marginLeft: "20px" }}>
            {data.employee
              .filter((employee) => employee.departmentId === department.id)
              .map((employee) => (
                <div key={employee.id}>
                  <div className="form-check pl-0">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedEmployees.some(
                        (emp) => emp.id === employee.id
                      )}
                      onChange={() => handleEmployeeChange(employee.id)}
                    />
                    <label className="form-check-label">{employee.name}</label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      <p className="mt-5">
        <strong>Table</strong>
      </p>
      {tableDetails.length > 0 ? (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Id</th>
              <th>DepartmentId</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {tableDetails.map((elem) => {
              return (
                <tr key={elem.id}>
                  <td>{elem.id}</td>
                  <td>{elem.departmentId}</td>
                  <td>{elem.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      <button className="btn btn-primary mt-4" onClick={() => handleSubmit()}>
        Submit
      </button>
    </div>
  );
}
