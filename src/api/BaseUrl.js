
import axios from 'axios';

const BaseUrl = axios.create({
  // baseURL: 'https://digiquestpython.pythonanywhere.com/',
  baseURL: 'https://digiquestclone.pythonanywhere.com/',
  // baseURL: 'http://192.168.0.150:8000',
});

export default BaseUrl;
