// src/api/BaseUrl.js
import axios from 'axios';

const BaseUrl = axios.create({
  // baseURL: 'https://digiquestclone.pythonanywhere.com/',
  baseURL: 'http://192.168.29.95:8001',
});

export default BaseUrl;
