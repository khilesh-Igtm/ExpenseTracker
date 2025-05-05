import React, { useState, useEffect } from "react";
import AddCategory from "./AddCategory";
import AddEntry from "./AddEntry";
import BudgetVsExpenseChart from "./BudgetVsExpenseChart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(0);
  const [expense, setExpense] = useState(0);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get Income from DB
        const incomeRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/income/`,
          {
            credentials: "include", // Ensures cookies are sent with the request
            headers: {
              "Content-Type": "application/json", // Important for sending JSON data
            },
          }
        );

        const incomeData = await incomeRes.json();
        if (incomeData.length > 0 && incomeData[0].amount) {
          setIncome(incomeData[0].amount);
        }
        
        // Get Budget
        const budgetRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/budget/`,
          {
            credentials: "include", // Ensures cookies are sent with the request
            headers: {
              "Content-Type": "application/json", // Important for sending JSON data
            },
          }
        );
        const budgetData = await budgetRes.json();
        if (budgetData.amount) setBudget(budgetData.amount);

        // Get Expenses
        const expenseRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/expenses/`,
          {
            credentials: "include", // Ensures cookies are sent with the request
            headers: {
              "Content-Type": "application/json", // Important for sending JSON data
            },
          }
        );
        const expenseData = await expenseRes.json();
        const totalExpenses = expenseData.reduce(
          (acc, item) => acc + parseFloat(item.amount),
          0
        );
        setExpense(totalExpenses);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`, {
      credentials: "include", // Ensures cookies are sent with the request
      headers: {
        "Content-Type": "application/json", // Important for sending JSON data
      },
    });
    const data = await res.json();
    setCategories(data);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout/`, {
        method: "POST",
        credentials: "include", // equivalent to withCredentials: true
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed");
    }
  };

  const handleIncomeChange = (newIncome) => {
    setIncome(newIncome);
  };

  const handleExpenseChange = (newExpense) => {
    setExpense(newExpense);
  };

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
  };

  return (
    <div className="container mt-4">
      <button onClick={handleLogout}>Logout</button>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Income</h5>
              <p className="card-text">${income}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Budget</h5>
              <p className="card-text">${budget}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Expenses</h5>
              <p className="card-text">${expense}</p>
            </div>
          </div>
        </div>
      </div>

      <AddCategory
        onIncomeChange={handleIncomeChange}
        onBudgetChange={handleBudgetChange}
        onCategoryAdded={fetchCategories}
      />
      <AddEntry onExpenseChange={handleExpenseChange} categories={categories} />
      <BudgetVsExpenseChart budget={budget} expense={expense} />
    </div>
  );
};

export default Dashboard;
