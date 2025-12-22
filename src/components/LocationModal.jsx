import { useState } from 'react';

export default function LocationModal({ currentLocation, onClose, onSave, loading }) {
	const [location, setLocation] = useState(currentLocation || '');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!location.trim()) return;
		onSave(location.trim());
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={e => e.stopPropagation()}>
				<div className="modal-header">
					<h3 className="modal-title">📍 Ubah Lokasi Fotografer</h3>
					<button onClick={onClose} className="btn btn-ghost btn-icon">✕</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="modal-body">
						<div className="input-group">
							<label className="input-label">Lokasi Fotografer Sekarang</label>
							<input
								type="text"
								className="input"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								placeholder="Contoh: Depan Aula, Samping Kantin, dll"
								autoFocus
							/>
						</div>
						<p className="text-sm text-muted mt-md">
							Lokasi ini akan terlihat oleh semua user yang login
						</p>
					</div>

					<div className="modal-footer">
						<button type="button" onClick={onClose} className="btn btn-secondary">
							Batal
						</button>
						<button type="submit" className="btn btn-primary" disabled={loading || !location.trim()}>
							{loading ? <span className="spinner"></span> : 'Simpan Lokasi'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
