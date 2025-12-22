import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { api } from './utils/api';
import { useSocket } from './hooks/useSocket';
import LoginPage from './components/LoginPage';
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

	if (requiredRole === 'admin' && !user.roles.puyerAdmin && !user.roles.superAdmin) {
		// Regular users can still access user view
		return <Navigate to="/location" replace />;
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

	const { connect, disconnect } = useSocket(handleQueueUpdate, handleConfigUpdate, handleLocationUpdate);

	useEffect(() => {
		async function checkAuth() {
			try {
				const { user } = await api.getMe();
				setUser(user);

				// All users can see location
				const locationData = await api.getLocation();
				setLocation(locationData.location);

				// Admins get queue data too
				if (user.roles.puyerAdmin || user.roles.superAdmin) {
					const data = await api.getQueue();
					setQueue(data.queue);
					setCurrentlyPhotographing(data.currentlyPhotographing);
					setPricePerPhoto(data.pricePerPhoto);
				}

				connect();
			} catch (error) {
				console.log('Not authenticated');
			} finally {
				setLoading(false);
			}
		}

		checkAuth();

		return () => disconnect();
	}, [connect, disconnect]);

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

	const isAdmin = user?.roles?.puyerAdmin || user?.roles?.superAdmin;

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						user
							? (isAdmin ? <Navigate to="/dashboard" replace /> : <Navigate to="/location" replace />)
							: <LoginPage />
					}
				/>
				<Route path="/auth/callback" element={<AuthCallback />} />
				<Route
					path="/location"
					element={
						user
							? <UserView user={user} location={location} onLogout={handleLogout} />
							: <Navigate to="/" replace />
					}
				/>
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
