import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const api = {
    // Authentication
    getAuthUrl: async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/google`);
            return response.data.url;
        } catch (error) {
            console.error('Auth Error:', error);
            throw error;
        }
    },

    // Send a message to the agent
    sendMessage: async (message, file = null) => {
        try {
            const response = await axios.post(`${API_URL}/chat`, {
                message,
                file, // { name, type, data: base64 }
                user_id: "demo_user" // Backend will override if logged in
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Get Agent Memory
    getMemory: async (userId = 'demo_user') => {
        try {
            const response = await axios.get(`${API_URL}/memory?user_id=${userId}`);
            return response.data;
        } catch (error) {
            console.error("Memory Error:", error);
            return { memories: [] };
        }
    },

    // Check server health
    checkHealth: async () => {
        try {
            const response = await axios.get(`${API_URL}/`);
            return response.data;
        } catch (error) {
            console.error('Health Check Error:', error);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await axios.get(`${API_URL}/logout`);
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    // Get User Profile
    getUserProfile: async () => {
        try {
            const response = await axios.get(`${API_URL}/me`);
            return response.data;
        } catch (error) {
            console.error('Fetch profile error:', error);
            return null;
        }
    }
};
