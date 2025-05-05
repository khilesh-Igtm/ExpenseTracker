import React, { useEffect, useState } from "react";


const AddEntry = ({ onExpenseChange, categories }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [entries, setEntries] = useState([]);

  // new state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 3;
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/expenses/`, {
          credentials: 'include', // Ensures cookies are sent with the request
          headers: {
            "Content-Type": "application/json", // Important for sending JSON data
          },
        });

        const expData = await expRes.json();

        setEntries(expData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleAddEntry = async () => {
    if (!amount || !category) {
      alert("Please enter amount and category.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/expenses/`, {
        method: "POST",
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json", // Important for sending JSON data
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category: category,
          type: "expense",
        }),
      });

      const data = await res.json();
      onExpenseChange((prev) => prev + parseFloat(amount));
      setEntries((prev) => [...prev, data]);
      setAmount("");
      setCategory("");
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleDelete = async (id, amount) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/expenses/${id}/`, {
        method: "DELETE",
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json", // Important for sending JSON data
        },
      });

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      onExpenseChange((prev) => prev - parseFloat(amount));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };


  // new functions
  const handleEdit = (entry) => {
    setEditId(entry.id);
    setEditAmount(entry.amount);
    setEditCategory(entry.category);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditAmount("");
    setEditCategory("");
  };

  const handleSaveEdit = async (entry) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/expenses/${entry.id}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(editAmount),
          category: editCategory,
          type: "expense",
        }),
      });

      const updated = await res.json();
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? updated : e))
      );

      // Update the total expense only if amount has changed
      if (parseFloat(entry.amount) !== parseFloat(editAmount)) {
        onExpenseChange((prev) => prev - parseFloat(entry.amount) + parseFloat(editAmount));
      }

      handleCancelEdit();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.amount.toString().includes(searchQuery)
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);


  return (
    <div className="container my-4">
      <div className="card shadow p-4 mb-4">
        <h4 className="mb-3 text-center">Add Expense</h4>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={handleAddEntry}>
              Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3 text-end">
        <input
          type="text"
          className="form-control"
          placeholder="Search by amount or category"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      <div className="card shadow p-4">
        <h5 className="mb-3 text-center">Expense Entries</h5>
        {currentEntries.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry, index) => (
                  <tr key={entry.id}>
                    <td>{indexOfFirstEntry + index + 1}</td>
                    <td>
                      {editId === entry.id ? (
                        <input
                          type="number"
                          className="form-control"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                        />
                      ) : (
                        `₹ ${entry.amount}`
                      )}
                    </td>
                    <td>
                      {editId === entry.id ? (
                        <select
                          className="form-select"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        entry.category
                      )}
                    </td>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>
                      {editId === entry.id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-1"
                            onClick={() => handleSaveEdit(entry)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning btn-sm me-1"
                            onClick={() => handleEdit(entry)}
                          >
                            Edit
                          </button>


                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(entry.id, entry.amount)}
                      >
                        Delete
                      </button>
                      </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
{/* Pagination Controls */}
<div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-primary"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

          </div>
        ) : (
          <p className="text-muted text-center">No expenses yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddEntry;
