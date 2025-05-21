// src/components/Transactions/AddTransaction.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  FormControlLabel,
  Switch,
  Divider,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatCurrency';
import { addTransaction } from '../../services/transactionService';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [isIncome, setIsIncome] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: isIncome ? 'income' : 'food'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Categories based on transaction type
  const expenseCategories = ['food', 'shopping', 'housing', 'transport', 'entertainment', 'utilities', 'other'];
  const incomeCategories = ['income', 'salary', 'freelance', 'investment', 'gift', 'other'];
  
  const categories = isIncome ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleIncomeToggle = () => {
    setIsIncome(!isIncome);
    // Update category when switching between income and expense
    setFormData({
      ...formData,
      category: !isIncome ? 'income' : 'food'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Prepare transaction data
    const transactionData = {
      description: formData.description,
      // For expenses, store as negative value
      amount: isIncome ? Math.abs(parseFloat(formData.amount)) : -Math.abs(parseFloat(formData.amount)),
      date: formData.date,
      category: formData.category
    };

    try {
      // Call the API to add transaction
      const response = await addTransaction(transactionData);
      
      if (response.success) {
        setSuccess('Transaction added successfully!');
        
        // Reset form or navigate away
        setTimeout(() => {
          navigate('/dashboard/transactions');
        }, 1500);
      } else {
        setError('Failed to add transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" component="h1">
            Add {isIncome ? "Income" : "Expense"}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/dashboard/transactions')}
          >
            Back to Transactions
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={isIncome}
                    onChange={handleIncomeToggle}
                    color="success"
                  />
                }
                label={`Add as ${isIncome ? "Income" : "Expense"}`}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder={isIncome ? "e.g., Salary, Freelance Work" : "e.g., Groceries, Rent"}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                placeholder="0.00"
                helperText={formData.amount ? `${formatCurrency(isIncome ? parseFloat(formData.amount) : -parseFloat(formData.amount))}` : ''}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard/transactions')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color={isIncome ? "success" : "primary"}
                >
                  Add {isIncome ? "Income" : "Expense"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddTransaction;
