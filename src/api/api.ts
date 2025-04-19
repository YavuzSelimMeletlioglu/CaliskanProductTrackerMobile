import axios from 'axios';

const base_url = "http://localhost:3000/";

const axios_instance = axios.create({
    baseURL: base_url,
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const get = async (url: string, params?: any) => {
    try {
        const response = await axios_instance.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('GET request error:', error);
    }
}

export const post = async (url: string, data: any) => {
    try {
        const response = await axios_instance.post(url, data);
        return response.data;
    } catch (error) {
        console.error('POST request error:', error);
    }
}