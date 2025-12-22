import { useState } from 'react';
import { api } from '../utils/api';

export default function QueueForm({ pricePerPhoto, onClose, onCreated, formatPrice }) {
	const [nama, setNama] = useState('');
	const [kelas, setKelas] = useState('');
	const [jumlahFoto, setJumlahFoto] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const totalPrice = jumlahFoto * pricePerPhoto;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!nama.trim()) {
			setError('Nama harus diisi');
			return;
		}

		if (jumlahFoto < 1) {
			setError('Jumlah foto minimal 1');
			return;
		}

		setLoading(true);
		try {
			await api.createQueue({
				nama: nama.trim(),
				kelas: kelas.trim(),
				jumlahFoto,
			});
			onCreated();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={e => e.stopPropagation()}>
				<div className="modal-header">
					<h3 className="modal-title">Tambah Antrian</h3>
					<button onClick={onClose} className="btn btn-ghost btn-icon">✕</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="modal-body">
						<div className="input-group mb-md">
							<label className="input-label">Nama *</label>
							<input
								type="text"
								className={`input ${error && !nama ? 'input-error' : ''}`}
								value={nama}
								onChange={(e) => setNama(e.target.value)}
								placeholder="Masukkan nama"
								autoFocus
							/>
						</div>

						<div className="input-group mb-md">
							<label className="input-label">Kelas (opsional)</label>
							<input
								type="text"
								className="input"
								value={kelas}
								onChange={(e) => setKelas(e.target.value)}
								placeholder="Contoh: XII-IPA-1"
							/>
						</div>

						<div className="input-group mb-md">
							<label className="input-label">Jumlah Foto</label>
							<div className="flex gap-sm items-center">
								<button
									type="button"
									onClick={() => setJumlahFoto(Math.max(1, jumlahFoto - 1))}
									className="btn btn-secondary btn-icon"
								>
									−
								</button>
								<input
									type="number"
									className="input"
									value={jumlahFoto}
									onChange={(e) => setJumlahFoto(Math.max(1, parseInt(e.target.value) || 1))}
									min="1"
									style={{ width: '80px', textAlign: 'center' }}
								/>
								<button
									type="button"
									onClick={() => setJumlahFoto(jumlahFoto + 1)}
									className="btn btn-secondary btn-icon"
								>
									+
								</button>
							</div>
						</div>

						<div className="card" style={{ background: 'var(--bg-tertiary)' }}>
							<div className="flex justify-between items-center">
								<span className="text-muted">Total Harga</span>
								<span className="price price-large">{formatPrice(totalPrice)}</span>
							</div>
							<div className="text-sm text-muted mt-md">
								Harga per foto: {formatPrice(pricePerPhoto)}
							</div>
						</div>

						{error && <p className="error-message mt-md">{error}</p>}
					</div>

					<div className="modal-footer">
						<button type="button" onClick={onClose} className="btn btn-secondary">
							Batal
						</button>
						<button type="submit" className="btn btn-primary" disabled={loading}>
							{loading ? <span className="spinner"></span> : 'Tambah Antrian'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
