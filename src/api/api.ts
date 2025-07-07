import axios from 'axios';

const base_url = "http://localhost:3000/";

const axios_instance = axios.create({
    baseURL: base_url,
    headers: {
        'Content-Type': 'application/json',
    },
});

const convertDates = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(item => convertDates(item));
    } else if (data !== null && typeof data === 'object') {
        const newObj: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                if (typeof value === 'string' && key.includes('created_at')) {
                    newObj[key] = new Date(value);
                } else if (typeof value === 'string' && key.includes('updated_at')) {
                    newObj[key] = new Date(value);
                } else {
                    newObj[key] = convertDates(value);
                }
            }
        }
        return newObj;
    }
    return data;
};

export const get = async (url: string, params?: any) => {
    try {
        const response = await axios_instance.get(url, { params });
        return convertDates(response.data);
    } catch (error) {
        console.error('GET request error:', error);
        throw error;
    }
}

export const post = async (url: string, data: any) => {
    try {
        const response = await axios_instance.post(url, data);
        return convertDates(response.data);
    } catch (error) {
        console.error('POST request error:', error);
        throw error;
    }
}

export const deleteRequest = async (url: string, data?: any) => {
    try {
        const response = await axios_instance.delete(url, {
            data: data,
        });
        return convertDates(response.data);
    } catch (error) {
        console.error('DELETE request error:', error);
        throw error;
    }
};