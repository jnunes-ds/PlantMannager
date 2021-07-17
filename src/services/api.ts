import axios from 'axios';
import config from '../global/config';


const api = axios.create({
    baseURL: `http://${config.API_URL}:3333/`
})


export default api;