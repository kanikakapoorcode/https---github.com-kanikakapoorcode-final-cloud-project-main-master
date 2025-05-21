// src/components/Transactions/TransactionList.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  FilterList as FilterIcon 
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { getTransactions, deleteTransaction } from '../../services/transactionService';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Categories for filter
  const categories = ['all', 'income', 'food', 'shopping', 'housing', 'transport', 'entertainment', 'utilities', 'other'];

  const location = useLocation();
  
  // Function to fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
      
      if (response.data && Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        console.error('Invalid data format received from API');
        // Fallback to mock data if API fails
        const mockTransactions = [
          { id: 1, date: '2025-05-18', description: 'Salary', amount: 45000, category: 'income' },
          { id: 2, date: '2025-05-10', description: 'Rent Payment', amount: -15000, category: 'housing' },
          { id: 3, date: '2025-05-21', description: 'Grocery Shopping', amount: -2450, category: 'food' },
          { id: 4, date: '2025-05-16', description: 'Restaurant Bill', amount: -1200, category: 'food' },
          { id: 5, date: '2025-05-14', description: 'Petrol', amount: -1500, category: 'transport' },
        ];
        setTransactions(mockTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback to mock data if API fails
      const mockTransactions = [
        { id: 1, date: '2025-05-18', description: 'Salary', amount: 45000, category: 'income' },
        { id: 2, date: '2025-05-10', description: 'Rent Payment', amount: -15000, category: 'housing' },
        { id: 3, date: '2025-05-21', description: 'Grocery Shopping', amount: -2450, category: 'food' },
      ];
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions when component mounts or when returning from add transaction page
  useEffect(() => {
    fetchTransactions();
  }, [location.pathname]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      // Call the API to delete transaction
      const response = await deleteTransaction(id);
      
      if (response.success) {
        // Update local state
        setTransactions(transactions.filter(transaction => transaction.id !== id));
        // Show success message (would use a snackbar in a real app)
        console.log(`Transaction ${id} deleted successfully`);
      } else {
        console.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Transactions
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            component={Link} 
            to="/dashboard/transactions/add"
          >
            Add Transaction
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Search transactions"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            size="small"
            sx={{ width: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              ),
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Loading transactions...</Typography>
          </Box>
        ) : filteredTransactions.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)} 
                            size="small" 
                            color={transaction.category === 'income' ? 'success' : 'default'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          color: transaction.amount >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'medium'
                        }}>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton size="small" aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              aria-label="delete"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredTransactions.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No transactions found.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TransactionList;
