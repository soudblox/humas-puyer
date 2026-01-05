export default function UserView({ user, location, status, onLogout, onLogin }) {
	const statusConfig = {
		open: {
			label: 'Buka',
			icon: '🟢',
			className: 'status-open',
			message: 'Fotografer sedang beroperasi'
		},
		break: {
			label: 'Istirahat',
			icon: '🟡',
			className: 'status-break',
			message: 'Fotografer sedang istirahat sebentar'
		},
		closed: {
			label: 'Tutup',
			icon: '🔴',
			className: 'status-closed',
			message: 'Fotografer tidak beroperasi'
		}
	};

	const currentStatus = statusConfig[status] || statusConfig.open;

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

			{/* Main Content */}
			<main className="public-main">
				<div className="location-display">
					{/* Status Indicator */}
					<div className={`status-badge ${currentStatus.className}`}>
						<span className="status-dot"></span>
						<span className="status-text">{currentStatus.label}</span>
					</div>

					{status === 'closed' ? (
						<>
							<div className="location-pin closed">
								<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
								</svg>
							</div>
							<p className="location-label-text">Puyer Tutup</p>
							<h1 className="location-name dimmed">Tidak Beroperasi</h1>
							<p className="location-hint">{currentStatus.message}</p>
						</>
					) : status === 'break' ? (
						<>
							<div className="location-pin break">
								<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<polyline points="12 6 12 12 16 14"></polyline>
								</svg>
							</div>
							<p className="location-label-text">Sedang Istirahat</p>
							<h1 className="location-name">{location || 'Lokasi belum diatur'}</h1>
							<p className="location-hint">{currentStatus.message}</p>
						</>
					) : (
						<>
							<div className="location-pin">
								<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
							</div>
							<p className="location-label-text">Lokasi Fotografer</p>
							<h1 className="location-name">{location || 'Belum diatur'}</h1>
							<p className="location-hint">Temui fotografer di lokasi ini</p>
						</>
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
