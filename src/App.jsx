import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { api } from './utils/api';
import { useSocket } from './hooks/useSocket';
import UserView from './components/UserView';
import Dashboard from './components/Dashboard';
import SuperAdminPanel from './components/SuperAdminPanel';

function AuthCallback() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/dashboard', { replace: true });
	}, [navigate]);

	return <div className="login-container"><div className="spinner"></div></div>;
}

function ProtectedRoute({ children, user, requiredRole }) {
	if (!user) {
		return <Navigate to="/" replace />;
	}

	if (requiredRole === 'admin' && !user.roles.admin && !user.roles.superAdmin) {
		return <Navigate to="/" replace />;
	}

	if (requiredRole === 'superAdmin' && !user.roles.superAdmin) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}

function App() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [queue, setQueue] = useState([]);
	const [currentlyPhotographing, setCurrentlyPhotographing] = useState(null);
	const [pricePerPhoto, setPricePerPhoto] = useState(0);
	const [location, setLocation] = useState('');
	const [presetLocations, setPresetLocations] = useState([]);
	const [status, setStatus] = useState('open');

	const handleQueueUpdate = useCallback((data) => {
		setQueue(data.queue);
		setCurrentlyPhotographing(data.currentlyPhotographing);
	}, []);

	const handleConfigUpdate = useCallback((data) => {
		if (data.pricePerPhoto !== undefined) {
			setPricePerPhoto(data.pricePerPhoto);
		}
	}, []);

	const handleLocationUpdate = useCallback((data) => {
		if (data.location) {
			setLocation(data.location);
		}
	}, []);

	const handleStatusUpdate = useCallback((data) => {
		if (data.status) {
			setStatus(data.status);
		}
	}, []);

	const { connect, disconnect } = useSocket(handleQueueUpdate, handleConfigUpdate, handleLocationUpdate, handleStatusUpdate);

	useEffect(() => {
		async function init() {
			try {
				// Always fetch location and status first (public endpoints)
				const [locationData, statusData] = await Promise.all([
					api.getLocation(),
					api.getStatus()
				]);
				setLocation(locationData.location);
				setPresetLocations(locationData.presetLocations || []);
				setStatus(statusData.status || 'open');

				// Try to get user session
				try {
					const { user } = await api.getMe();
					setUser(user);

					// Admins get queue data too
					if (user.roles.admin || user.roles.superAdmin) {
						const data = await api.getQueue();
						setQueue(data.queue);
						setCurrentlyPhotographing(data.currentlyPhotographing);
						setPricePerPhoto(data.pricePerPhoto);
					}
				} catch (error) {
					// Not logged in - that's fine, location still works
					console.log('Not authenticated - showing public view');
				}

				connect();
			} catch (error) {
				console.error('Failed to initialize:', error);
			} finally {
				setLoading(false);
			}
		}

		init();

		return () => disconnect();
	}, [connect, disconnect]);

	const handleLogin = () => {
		window.location.href = api.getLoginUrl();
	};

	const handleLogout = async () => {
		try {
			await api.logout();
			disconnect();
			setUser(null);
			setQueue([]);
			setCurrentlyPhotographing(null);
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	const refreshQueue = async () => {
		try {
			const data = await api.getQueue();
			setQueue(data.queue);
			setCurrentlyPhotographing(data.currentlyPhotographing);
			setPricePerPhoto(data.pricePerPhoto);

			const locationData = await api.getLocation();
			setLocation(locationData.location);
		} catch (error) {
			console.error('Failed to refresh queue:', error);
		}
	};

	if (loading) {
		return (
			<div className="login-container">
				<div className="spinner"></div>
			</div>
		);
	}

	const isAdmin = user?.roles?.admin || user?.roles?.superAdmin;

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						isAdmin
							? <Navigate to="/dashboard" replace />
							: <UserView user={user} location={location} status={status} onLogout={handleLogout} onLogin={handleLogin} />
					}
				/>
				<Route path="/auth/callback" element={<AuthCallback />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute user={user} requiredRole="admin">
							<Dashboard
								user={user}
								queue={queue}
								currentlyPhotographing={currentlyPhotographing}
								pricePerPhoto={pricePerPhoto}
								location={location}
								setLocation={setLocation}
								presetLocations={presetLocations}
								status={status}
								setStatus={setStatus}
								onLogout={handleLogout}
								refreshQueue={refreshQueue}
							/>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin"
					element={
						<ProtectedRoute user={user} requiredRole="superAdmin">
							<SuperAdminPanel
								user={user}
								onLogout={handleLogout}
								pricePerPhoto={pricePerPhoto}
								setPricePerPhoto={setPricePerPhoto}
							/>
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
