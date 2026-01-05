export default function UserView({ user, location, status, onLogout, onLogin }) {
	const statusConfig = {
		open: {
			label: 'Buka',
			className: 'status-open',
			message: 'Temui fotografer di lokasi ini'
		},
		break: {
			label: 'Istirahat',
			className: 'status-break',
			message: 'Fotografer sedang istirahat sebentar'
		},
		closed: {
			label: 'Tutup',
			className: 'status-closed',
			message: 'Tidak beroperasi saat ini'
		}
	};

	const currentStatus = statusConfig[status] || statusConfig.open;
	const isClosed = status === 'closed';
	const isBreak = status === 'break';

	return (
		<div className={`public-view ${isClosed ? 'view-closed' : ''}`}>
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

			{/* Main Content */}
			<main className="public-main">
				<div className="location-card">
					{/* Status Badge - Prominent at top */}
					<div className={`status-pill ${currentStatus.className}`}>
						<span className="status-dot"></span>
						<span>{currentStatus.label}</span>
					</div>

					{/* Location Content */}
					{isClosed ? (
						<div className="location-content closed">
							<div className="closed-icon">
								<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="15" y1="9" x2="9" y2="15"></line>
									<line x1="9" y1="9" x2="15" y2="15"></line>
								</svg>
							</div>
							<h1 className="location-title">Tutup</h1>
							<p className="location-subtitle">{currentStatus.message}</p>
						</div>
					) : (
						<div className="location-content">
							<p className="location-label">Lokasi Fotografer</p>
							<h1 className="location-title">{location || 'Belum diatur'}</h1>
							<p className="location-subtitle">{currentStatus.message}</p>

							{isBreak && (
								<div className="break-notice">
									<span>⏱️</span>
									<span>Kembali sebentar lagi</span>
								</div>
							)}
						</div>
					)}
				</div>
			</main>

			{/* Footer */}
			<footer className="public-footer">
				<p>© 2026 HUMED SINLUI 1</p>
			</footer>
		</div>
	);
}
