import axios from 'axios';

const api = axios.create({
	baseURL: 'https://localhost:7208',
});

api.interceptors.request.use(async config => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export const setToken = token => {
	api.defaults.headers.common.Authorization = token;
};

export const requestGetRoute = async endpoint => {
	let result;
	await api
		.get(endpoint)
		.then(response => {
			result = response.data;
		})
		.catch(error => {
			result = error.response.status;
			if (result === 401) {
				localStorage.removeItem('token');
			}
		});
	return result;
};

export const requestPutRoute = async (endpoint, body) => {
	let result;
	await api
		.put(endpoint, body)
		.then(response => {
			result = response.data;
		})
		.catch(error => {
			result = error.response.status;
			if (result === 401) {
				localStorage.removeItem('token');
			}
		});
	return result;
};

export const requestPost = async (endpoint, body) => {
	let result;
	await api
		.post(endpoint, body)
		.then(response => {
			result = response.data;
		})
		.catch(error => {
			result = error.response.data.message;
			if (error.response.status === 401) {
				localStorage.removeItem('token');
			}
		});
	return result;
};

export const requestDelete = async endpoint => {
	let result;
	await api
		.delete(endpoint)
		.then(response => {
			result = response.data;
		})
		.catch(error => {
			result = error.response.data.message;
			if (error.response.status === 401) {
				localStorage.removeItem('token');
			}
		});
	return result;
};

export default api;
