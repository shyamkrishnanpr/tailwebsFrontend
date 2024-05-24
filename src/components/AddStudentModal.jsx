import React, { useState } from "react";
import axios from "../api/axios";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddStudentModal = ({ open, handleClose, addStudent }) => {
  const [student, setStudent] = useState({ name: "", subject: "", mark: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/addStudent", student);

      addStudent(response.data);
      handleClose();
    } catch (err) {
      setError("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          Add Student Details
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Name"
          name="name"
          value={student.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Subject"
          name="subject"
          value={student.subject}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Mark"
          name="mark"
          value={student.mark}
          onChange={handleChange}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Add Student"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddStudentModal;
