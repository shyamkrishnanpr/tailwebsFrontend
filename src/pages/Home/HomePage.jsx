import React, { useEffect, useState } from "react";

import axios from "../../api/axios";
import { Button, Container, List, ListItem, ListItemText } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  CircularProgress,
  Pagination,
  Typography,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";

import Navbar from "../../components/Navbar";

import AddStudentModal from "../../components/AddStudentModal";

const HomePage = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/studentData");
      setStudents(response.data);

      console.log(response.data, "sadfcwads");
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addStudent = (student) => {
    fetchStudents();
  };

  const handleEditClick = (student) => {
    setEditingRowId(student._id);
    setEditedStudent(student);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditedStudent({});
    setErrors({});
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`/editStudent/${editedStudent._id}`, editedStudent);
      fetchStudents();
      setEditingRowId(null);
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        setErrors((prev) => ({
          ...prev,
          [editedStudent._id]: error.response.data.msg,
        }));
      } else {
        console.error("Error saving student:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deleteStudent/${id}`);
      fetchStudents();

      console.log(id,"id at delete")
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <>
      <Navbar />

      <AddStudentModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        addStudent={addStudent}
      />

      <TableContainer
        style={{ marginTop: "20px", marginBottom: "20px" }}
        component={Paper}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }} align="left">
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Subject
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Mark
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((row) => (
              <>
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    {editingRowId === row._id ? (
                      <TextField
                        name="name"
                        value={editedStudent.name}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      row.name
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {" "}
                    {editingRowId === row._id ? (
                      <TextField
                        name="subject"
                        value={editedStudent.subject}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      row.subject
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editingRowId === row._id ? (
                      <TextField
                        name="mark"
                        value={editedStudent.mark}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      row.mark
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editingRowId === row._id ? (
                      <>
                        <Button onClick={handleSaveClick}>save</Button>
                        <Button onClick={handleCancelClick}>cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button
                          style={{ width: "100px", marginRight: "10px" }}
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditClick(row)}
                        >
                          edit
                        </Button>

                        <Button
                          style={{ width: "100px" }}
                          variant="outlined"
                          size="small"
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>

                {errors[row._id] && (
                  <TableCell colSpan={4}>
                    <Typography color="error">{errors[row._id]}</Typography>
                  </TableCell>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ width: "150px" }}>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={handleOpenModal}
        >
          Add Student
        </Button>
      </div>
    </>
  );
};

export default HomePage;
