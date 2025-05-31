// src/api.js
import axios from 'axios';

// Set a base URL for your API
export const API_BASE_URL = 'https://financeapp-98oq.onrender.com/';

// Fetch all invoices
export const fetchInvoices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getInvoicesCompany`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Fetch single invoice by ID
export const fetchInvoiceById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getInvoicesCompany/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    throw error;
  }
};

//Fetch All Gefahrdungsbeurtilung
export const Gefahrdungsbeurtilung = async (id) =>{
  try {
    const response = await axios.get(`${API_BASE_URL}/Gefahrdungsbeurteilung/${id}`)
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Lieferant not found for Id:${id}`);
      throw new Error('Failed to fetch Lieferant. Try again later')
    }
  }
}
//Fetch single Gefahrdungsbeurtilung by ID
export const fetchGefahrdungsbeurteilungById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Gefahrdungsbeurteilung/${id}`);
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching guschrift:", error);
    throw error; // Ensure the error is thrown to be handled in the calling code
  }
};

//update the Guschrift
export const updateGefahrdungsbeurteilungtById = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/Gefahrdungsbeurteilung/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating guschrift:", error);
    throw error; // Ensure the error is thrown to be handled in the calling code
  }
};

// Save invoice
export const saveInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/invoicesCompany`, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }
};


// Save Gutschrift
export const savedGutschrift = async (gutschriftData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/savedGutschrift`, gutschriftData);
    return response.data;
  } catch (error) {
    console.error("Error saving Gutschrift:", error);
    throw error;
  }
};

// Get gutschrift

export const fetchGutschrift = async (id) =>{
  try {
    const response = await axios.get(`${API_BASE_URL}/savedGutschrift/${id}`)
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Lieferant not found for Id:${id}`);
      throw new Error('Failed to fetch Lieferant. Try again later')
    }
  }
}



export async function fetchGuschriftById(id) {
  try {
      const response = await axios.get(`${API_BASE_URL}/savedGutschrift/${id}`);
      return response.data;
  } catch (error) {
      if (error.response && error.response.status === 404) {
          console.error(`Gutschrift not found for ID: ${id}`);
          throw new Error('Gutschrift not found. Please check the ID.');
      } else {
          console.error('Error fetching Gutschrift:', error.message);
          throw new Error('Failed to fetch Gutschrift. Try again later.');
      }
  }
}



// Save Lieferant 

export const savedLieferant = async (lieferantData) => {
  try {
      const response = await axios.post(`${API_BASE_URL}/savedLieferant`, lieferantData);
      console.log('Lieferant saved:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
    }
};
// Fetch all Lieferant
export const fetchLieferants = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/savedLieferant`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

// Get single Lieferant

export const fetchLieferantById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/savedLieferant/${id}`)
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Lieferant not found for Id:${id}`);
      throw new Error('Failed to fetch Lieferant. Try again later')
    }
  }
}


//Update the Lieferant

export const updateTheLieferantById = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/savedLieferant/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating guschrift:", error);
    throw error; // Ensure the error is thrown to be handled in the calling code
  }
};



