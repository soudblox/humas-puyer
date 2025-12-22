const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchWithCredentials(url, options = {}) {
	const response = await fetch(`${API_URL}${url}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Request failed' }));
		throw new Error(error.error || 'Request failed');
	}

	return response.json();
}

export const api = {
	// Auth
	getMe: () => fetchWithCredentials('/auth/me'),
	logout: () => fetchWithCredentials('/auth/logout', { method: 'POST' }),
	getLoginUrl: () => `${API_URL}/auth/google?origin=${encodeURIComponent(window.location.origin)}`,

	// Location (public for users)
	getLocation: () => fetchWithCredentials('/api/puyer/location'),
	updateLocation: (location) => fetchWithCredentials('/api/puyer/location', {
		method: 'PUT',
		body: JSON.stringify({ location }),
	}),

	// Queue (admin only)
	getQueue: () => fetchWithCredentials('/api/puyer/queue'),
	createQueue: (data) => fetchWithCredentials('/api/puyer/queue', {
		method: 'POST',
		body: JSON.stringify(data),
	}),
	setPhotographing: (id) => fetchWithCredentials(`/api/puyer/queue/${id}/photograph`, {
		method: 'POST',
	}),
	markDone: (id, paymentMethod) => fetchWithCredentials(`/api/puyer/queue/${id}/done`, {
		method: 'POST',
		body: JSON.stringify({ paymentMethod }),
	}),
	cancelQueue: (id) => fetchWithCredentials(`/api/puyer/queue/${id}/cancel`, {
		method: 'POST',
	}),
	forceAction: (id, action, paymentMethod) => fetchWithCredentials(`/api/puyer/queue/${id}/force`, {
		method: 'POST',
		body: JSON.stringify({ action, paymentMethod }),
	}),
	resetQueue: () => fetchWithCredentials('/api/puyer/reset', { method: 'POST' }),

	// Pricing
	getPricing: () => fetchWithCredentials('/api/puyer/pricing'),
	updatePricing: (pricePerPhoto) => fetchWithCredentials('/api/puyer/pricing', {
		method: 'PUT',
		body: JSON.stringify({ pricePerPhoto }),
	}),

	// Admins
	getAdmins: () => fetchWithCredentials('/api/puyer/admins'),
	updateAdmins: (admins) => fetchWithCredentials('/api/puyer/admins', {
		method: 'PUT',
		body: JSON.stringify({ admins }),
	}),

	// Spreadsheet config
	getSpreadsheetConfig: () => fetchWithCredentials('/api/puyer/spreadsheet-config'),
	updateSpreadsheetConfig: (config) => fetchWithCredentials('/api/puyer/spreadsheet-config', {
		method: 'PUT',
		body: JSON.stringify(config),
	}),
	testConnection: () => fetchWithCredentials('/api/puyer/test-connection'),

	// Super admin
	getSuperAdmins: () => fetchWithCredentials('/api/admin/super-admins'),
	updateSuperAdmins: (superAdmins) => fetchWithCredentials('/api/admin/super-admins', {
		method: 'PUT',
		body: JSON.stringify({ superAdmins }),
	}),
};

export { API_URL };
