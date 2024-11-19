// src/api/BaseUrl.js
import axios from 'axios';

const BaseUrl = axios.create({
  // baseURL: 'https://digiquestclone.pythonanywhere.com/',
  baseURL: 'http://192.168.29.222:8001',
});

export default BaseUrl;
