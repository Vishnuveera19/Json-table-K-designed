import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  TableCell,
  Paper,
  Typography,
  IconButton,
  Tooltip
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const JsonTable = ({ jsonData }) => {
  const [editable, setEditable] = useState(-1);

  if (!jsonData) {
    return <Typography>No JSON data provided.</Typography>;
  }

  const isObject = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

  const renderCell = (value) => {
    if (isObject(value)) {
      return <JsonTable jsonData={[value]} />;
    } else {
      return value;
    }
  };

  const handleEdit = (rowIndex) => {
    setEditable(rowIndex);
  };

  const handleSave = (rowIndex, row) => {
    console.log(row);
    row.paymBranch = {
      pnCompany: {
        pnCompanyId: row.pnCompanyId,
      },
      pnBranchId: row.pnBranchId,
    };
    axios
      .put(
        "https://localhost:7266/api/PaymEmployees/" + row.pnCompanyId,
        row
      )
      .then((response) => {
        if (response.status === 204) {
          alert("Data Saved Successfully!");
          setEditable(-1);
        }
      })
      .catch((error) => {
        alert("Cannot perform this operation!");
      });
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmed) {
      axios
        .delete(
          "https://localhost:7266/api/PaymEmployees/" +
          row.pnCompanyId +
          "," +
          row.pnBranchId +
          "," +
          row.pnEmployeeId
        )
        .then(() => {
          alert("Deleted successfully");
          window.location.reload();
        })
        .catch((error) => console.log(error));
    } else {
      alert("Delete operation cancelled");
    }
  };

  return (
    <TableContainer component={Paper} style={{ maxWidth: "100%" }}>

      <Table size="xxlarge">
        <TableHead>
          <TableRow style={{ height: '1px', width: '5px' }}>

            {Object.keys(jsonData[0]).map((header) => (
              <TableCell key={header} style={{ border: "2px solid white",fontSize: "1rem", textTransform: "uppercase", padding: "8px",
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
              transition: "background-color 0.3s ease"}}>{header.split("_").join(" ")}</TableCell>

            ))}
            <TableCell style={{ border: "2px solid white",fontSize: "1rem", textTransform: "uppercase", padding: "8px",
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
              transition: "background-color 0.3s ease" }}>Edit</TableCell>
            <TableCell style={{ border: "2px solid white",fontSize: "1rem", textTransform: "uppercase", padding: "8px",
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
              transition: "background-color 0.3s ease" }}>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jsonData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.values(row).map((cell, cellIndex) => (
                <TableCell key={`${rowIndex}-${cellIndex}`} style={{ border: "1px solid black", fontSize: "1rem", Align: "left" }}>
                  {editable === rowIndex ? (
                    <TextField
                      defaultValue={cell}
                      onChange={(e) => {
                        row[Object.keys(row)[cellIndex]] = e.target.value;
                      }}
                    />
                  ) : (
                    renderCell(cell)
                  )}
                </TableCell>
              ))}
              <TableCell style={{ border: "1px solid black" }}>
                {editable === rowIndex ? (
                  <Tooltip title="Save">
                    <IconButton onClick={() => handleSave(rowIndex, row)}>
                      <Button variant="contained" color="primary" style={{ backgroundColor: 'purple' }} size="small">Save</Button>
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(rowIndex)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Edit fontSize="medium" style={{ color: 'green' }} />
                    </IconButton>
                  </Tooltip>

                )}
              </TableCell>
              <TableCell style={{ border: "1px solid black" }}>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(rowIndex)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Delete fontSize="medium" style={{ color: 'red' }} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default JsonTable;
