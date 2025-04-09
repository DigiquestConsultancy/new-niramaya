
import axios from 'axios';

const BaseUrl = axios.create({
  // baseURL: 'https://digiquestpython.pythonanywhere.com/',
  baseURL: 'https://digiquestclone.pythonanywhere.com/',
  // baseURL: 'http://192.168.29.95:8003',
});

export default BaseUrl;
