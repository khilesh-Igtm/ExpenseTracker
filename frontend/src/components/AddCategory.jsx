import React, { useState } from "react";

const AddCategory = ({ onIncomeChange, onBudgetChange, onCategoryAdded }) => {
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(0);
  const [newCategory, setNewCategory] = useState("");

  const handleIncomeChange = async () => {
    onIncomeChange(income);
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/income/`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json", // Important for sending JSON data
        },
        body: JSON.stringify({ amount: parseFloat(income) }),
      });
    } catch (err) {
      console.error("Error saving income:", err);
    }
  };

  const handleAddBudget = async () => {
    onBudgetChange(budget);
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/budget/`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json", // Important for sending JSON data
        },
        body: JSON.stringify({ amount: parseFloat(budget) }),
      });
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json", // Important for sending JSON data
        },
        body: JSON.stringify({ name: newCategory }),
      });

      setNewCategory("");
      onCategoryAdded();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  return (
    <div className="mb-4 p-3 border rounded shadow-sm">
      <h5 className="mb-3">Finance Controls</h5>

      <div className="mb-3 row">
        <div className="col-md-8">
          <input
            type="number"
            className="form-control"
            placeholder="Add your Income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button
            className="btn btn-success w-100"
            onClick={handleIncomeChange}
          >
            Add Income
          </button>
        </div>
      </div>

      <div className="mb-3 row">
        <div className="col-md-8">
          <input
            type="number"
            className="form-control"
            placeholder="Add your Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-warning w-100" onClick={handleAddBudget}>
            Add Budget
          </button>
        </div>
      </div>

      <div className="mb-3 row">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="New Category (e.g. Shoes)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={handleAddCategory}>
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
