export default function UserView({ user, location, onLogout, onLogin }) {
	return (
		<div className="dashboard">
			{/* Navbar */}
			<nav className="navbar">
				<div className="navbar-brand">
					<span className="navbar-logo">🎞️ Puyer</span>
					<span className="navbar-subtitle">HUMED SINLUI 1</span>
				</div>
				<div className="navbar-user">
					{user ? (
						<>
							<img src={user.picture} alt={user.name} className="user-avatar" />
							<div className="user-info">
								<div className="user-name">{user.name}</div>
								<div className="user-role">User</div>
							</div>
							<button onClick={onLogout} className="btn btn-ghost btn-sm">
								Keluar
							</button>
						</>
					) : (
						<button onClick={onLogin} className="btn btn-primary btn-sm">
							Login Admin
						</button>
					)}
				</div>
			</nav>

			<div className="dashboard-content">
				<div className="location-banner">
					<div className="location-icon">📍</div>
					<div className="location-label">Lokasi Fotografer Puyer Saat Ini</div>
					<div className="location-value">{location || 'Belum diatur'}</div>
				</div>
			</div>
		</div>
	);
}
