import { api } from '../utils/api';

export default function UserView({ user, location, onLogout, onLogin }) {
	return (
		<div className="public-view">
			{/* Minimal Header */}
			<header className="public-header">
				<div className="public-brand">
					<span className="brand-icon">🎞️</span>
					<div className="brand-text">
						<span className="brand-name">Puyer</span>
						<span className="brand-sub">HUMED SINLUI 1</span>
					</div>
				</div>
				<div className="public-auth">
					{user ? (
						<div className="user-pill">
							<img src={user.picture} alt={user.name} className="user-pill-avatar" />
							<span className="user-pill-name">{user.name}</span>
							<button onClick={onLogout} className="user-pill-logout">×</button>
						</div>
					) : (
						<button onClick={onLogin} className="login-link">
							Admin →
						</button>
					)}
				</div>
			</header>

			{/* Main Content - Centered Location Display */}
			<main className="public-main">
				<div className="location-display">
					<div className="location-pin">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
							<circle cx="12" cy="10" r="3"></circle>
						</svg>
					</div>
					<p className="location-label-text">Lokasi Fotografer</p>
					<h1 className="location-name">{location || 'Belum diatur'}</h1>
					<p className="location-hint">Refresh halaman untuk update lokasi terbaru</p>
				</div>
			</main>

			{/* Footer */}
			<footer className="public-footer">
				<p>© 2026 HUMED SINLUI 1</p>
			</footer>
		</div>
	);
}
