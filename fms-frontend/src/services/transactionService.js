// src/services/transactionService.js
import axios from 'axios';
import { transactionAPI } from './api';

const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Configure axios with auth header
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all transactions
export const getTransactions = async () => {
  try {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('fms_user'));
    const userId = user?.id || '';
    
    const response = await transactionAPI.getAll(userId);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Add new transaction
export const addTransaction = async (transactionData) => {
  try {
    const response = await transactionAPI.add(transactionData);
    return response.data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Delete transaction
export const deleteTransaction = async (id) => {
  try {
    // We need to add a delete method to the transactionAPI
    // For now, we'll continue using the axiosInstance
    const response = await axiosInstance.delete(`${API_URL}/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export default {
  getTransactions,
  addTransaction,
  deleteTransaction
};
