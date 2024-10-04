// src/api/BaseUrl.js
import axios from 'axios';

const BaseUrl = axios.create({
  baseURL: 'https://digiquestpython.pythonanywhere.com/',
});

export default BaseUrl;
