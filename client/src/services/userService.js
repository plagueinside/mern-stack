//import authHeader from '../helpers/authHeader';
import axios from 'axios';

const login = (username, password) => {
	return axios
		.post(`/api/users/authenticate`, JSON.stringify({ username, password }))
		.then(handleResponse)
		.then(user => {
			// login successful if there's a jwt token in the response
			if (user.token) {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('user', JSON.stringify(user));
			}

			return user;
		});
}

const logout = () => {
	// remove user from local storage to log user out
	localStorage.removeItem('user');
}

const getAll = () => {
	return axios.get(`/api/users`).then(handleResponse);
}

const getById = id => {
	return axios.get(`/api/users/${id}`).then(handleResponse);
}

const register = user => {
	return axios.post(`/api/users/register`, JSON.stringify(user)).then(handleResponse);
}

const update = user => {
	return axios.put(`/api/users/${user.id}`, JSON.stringify(user)).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
const _delete = id => {
	return axios.delete(`/api/users/${id}`).then(handleResponse);
}

const handleResponse = response => {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if (response.status === 401) {
				// auto logout if 401 response returned from api
				logout();
				//location.reload(true);
			}

			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}

export const userService = {
	login,
	logout,
	register,
	getAll,
	getById,
	update,
	delete: _delete
};