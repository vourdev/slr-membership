import { API_BASE_URL } from './api-endpoints';
import axios from 'axios';

export const apiAuth = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
