import { useState } from 'react';

export default function LocationModal({
	currentLocation,
	presetLocations = [],
	currentStatus,
	onClose,
	onSaveLocation,
	onSaveStatus,
	loading
}) {
	const [location, setLocation] = useState(currentLocation || '');
	const [status, setStatus] = useState(currentStatus || 'open');
	const [customMode, setCustomMode] = useState(!presetLocations.includes(currentLocation));

	const handleLocationSubmit = (e) => {
		e.preventDefault();
		if (!location.trim()) return;
		onSaveLocation(location.trim());
	};

	const handlePresetClick = (preset) => {
		setLocation(preset);
		setCustomMode(false);
	};

	const handleStatusChange = async (newStatus) => {
		setStatus(newStatus);
		onSaveStatus(newStatus);
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={e => e.stopPropagation()}>
				<div className="modal-header">
					<h3 className="modal-title">⚙️ Pengaturan Puyer</h3>
					<button onClick={onClose} className="btn btn-ghost btn-icon">✕</button>
				</div>

				<div className="modal-body">
					{/* Status Section */}
					<div className="mb-lg">
						<label className="input-label mb-sm" style={{ display: 'block' }}>Status Operasional</label>
						<div className="status-toggle-group">
							<button
								type="button"
								className={`status-toggle ${status === 'open' ? 'active open' : ''}`}
								onClick={() => handleStatusChange('open')}
								disabled={loading}
							>
								🟢 Buka
							</button>
							<button
								type="button"
								className={`status-toggle ${status === 'break' ? 'active break' : ''}`}
								onClick={() => handleStatusChange('break')}
								disabled={loading}
							>
								🟡 Istirahat
							</button>
							<button
								type="button"
								className={`status-toggle ${status === 'closed' ? 'active closed' : ''}`}
								onClick={() => handleStatusChange('closed')}
								disabled={loading}
							>
								🔴 Tutup
							</button>
						</div>
					</div>

					{/* Location Section */}
					<form onSubmit={handleLocationSubmit}>
						<label className="input-label mb-sm" style={{ display: 'block' }}>📍 Lokasi Fotografer</label>

						{/* Preset Locations */}
						{presetLocations.length > 0 && (
							<div className="preset-locations mb-md">
								{presetLocations.map((preset) => (
									<button
										key={preset}
										type="button"
										className={`preset-chip ${location === preset && !customMode ? 'active' : ''}`}
										onClick={() => handlePresetClick(preset)}
									>
										{preset}
									</button>
								))}
								<button
									type="button"
									className={`preset-chip ${customMode ? 'active' : ''}`}
									onClick={() => setCustomMode(true)}
								>
									✏️ Custom
								</button>
							</div>
						)}

						{/* Custom Input */}
						{(customMode || presetLocations.length === 0) && (
							<div className="input-group mb-md">
								<input
									type="text"
									className="input"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
									placeholder="Ketik lokasi custom..."
									autoFocus
								/>
							</div>
						)}

						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={loading || !location.trim()}
						>
							{loading ? <span className="spinner"></span> : '💾 Simpan Lokasi'}
						</button>
					</form>
				</div>

				<div className="modal-footer">
					<button type="button" onClick={onClose} className="btn btn-secondary">
						Tutup
					</button>
				</div>
			</div>
		</div>
	);
}
