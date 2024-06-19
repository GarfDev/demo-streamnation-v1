import axios from 'axios';
import SECRETS from './secrets';

const requester = axios.create({
  baseURL: SECRETS['BASE_URL'],
});

export default requester;
