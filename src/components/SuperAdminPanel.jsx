import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function SuperAdminPanel({ user, onLogout, pricePerPhoto, setPricePerPhoto }) {
	const [admins, setAdmins] = useState([]);
	const [superAdmins, setSuperAdmins] = useState([]);
	const [spreadsheetConfig, setSpreadsheetConfig] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Form states
	const [newAdmin, setNewAdmin] = useState('');
	const [newSuperAdmin, setNewSuperAdmin] = useState('');
	const [newPrice, setNewPrice] = useState(pricePerPhoto);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const [adminsData, superAdminsData, spreadsheetData, pricingData] = await Promise.all([
				api.getAdmins(),
				api.getSuperAdmins(),
				api.getSpreadsheetConfig(),
				api.getPricing(),
			]);
			setAdmins(adminsData.admins);
			setSuperAdmins(superAdminsData.superAdmins);
			setSpreadsheetConfig(spreadsheetData.spreadsheet);
			setNewPrice(pricingData.pricePerPhoto);
		} catch (error) {
			console.error('Failed to load data:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddAdmin = async () => {
		if (!newAdmin.trim() || !newAdmin.includes('@')) return;
		setSaving(true);
		try {
			const updated = [...admins, newAdmin.trim()];
			await api.updateAdmins(updated);
			setAdmins(updated);
			setNewAdmin('');
		} catch (error) {
			alert('Gagal: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveAdmin = async (email) => {
		if (!confirm(`Hapus ${email} dari admin?`)) return;
		setSaving(true);
		try {
			const updated = admins.filter(e => e !== email);
			await api.updateAdmins(updated);
			setAdmins(updated);
		} catch (error) {
			alert('Gagal: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleAddSuperAdmin = async () => {
		if (!newSuperAdmin.trim() || !newSuperAdmin.includes('@')) return;
		setSaving(true);
		try {
			const updated = [...superAdmins, newSuperAdmin.trim()];
			await api.updateSuperAdmins(updated);
			setSuperAdmins(updated);
			setNewSuperAdmin('');
		} catch (error) {
			alert('Gagal: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveSuperAdmin = async (email) => {
		if (email === user.email) {
			alert('Tidak bisa menghapus diri sendiri dari super admin');
			return;
		}
		if (!confirm(`Hapus ${email} dari super admin?`)) return;
		setSaving(true);
		try {
			const updated = superAdmins.filter(e => e !== email);
			await api.updateSuperAdmins(updated);
			setSuperAdmins(updated);
		} catch (error) {
			alert('Gagal: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleUpdatePricing = async () => {
		setSaving(true);
		try {
			await api.updatePricing(newPrice);
			setPricePerPhoto(newPrice);
			alert('Harga berhasil diupdate!');
		} catch (error) {
			alert('Gagal: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleUpdateSpreadsheetConfig = async () => {
		if (!spreadsheetConfig) return;
		setSaving(true);
		try {
			await api.updateSpreadsheetConfig(spreadsheetConfig);
			alert('Konfigurasi spreadsheet berhasil diupdate!');
		} catch (error) {
			alert('Gagal: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const handleResetQueue = async () => {
		if (!confirm('Yakin reset semua antrian? Data akan hilang dari memori (spreadsheet tetap aman).')) return;
		setSaving(true);
		try {
			await api.resetQueue();
			alert('Antrian berhasil direset!');
		} catch (error) {
			alert('Gagal: ' + error.message);
		} finally {
			setSaving(false);
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
		}).format(price);
	};

	if (loading) {
		return (
			<div className="login-container">
				<div className="spinner"></div>
			</div>
		);
	}

	return (
		<div className="dashboard">
			<nav className="navbar">
				<div className="navbar-brand">
					<span className="navbar-logo">⚙️ Super Admin</span>
					<span className="navbar-subtitle">Puyer - HUMED SINLUI 1</span>
				</div>
				<div className="navbar-user">
					<Link to="/dashboard" className="btn btn-ghost btn-sm">
						← Dashboard
					</Link>
					<img src={user.picture} alt={user.name} className="user-avatar" />
					<div className="user-info">
						<div className="user-name">{user.name}</div>
						<div className="user-role">Super Admin</div>
					</div>
					<button onClick={onLogout} className="btn btn-ghost btn-sm">
						Keluar
					</button>
				</div>
			</nav>

			<div className="dashboard-content">
				<h2 className="dashboard-title mb-lg">Pengaturan Super Admin</h2>

				<div className="admin-grid">
					{/* Pricing Card */}
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">💰 Harga Per Foto</h3>
						</div>
						<div className="input-group mb-md">
							<label className="input-label">Harga Per Foto (Rupiah)</label>
							<input
								type="number"
								className="input"
								value={newPrice}
								onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
							/>
						</div>
						<button
							onClick={handleUpdatePricing}
							className="btn btn-primary w-full"
							disabled={saving}
						>
							Simpan Harga
						</button>
					</div>

					{/* Admins Card */}
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">👤 Admin Puyer</h3>
						</div>
						<div className="email-list mb-md">
							{admins.map(email => (
								<div key={email} className="email-item">
									<span className="email-text">{email}</span>
									<button
										onClick={() => handleRemoveAdmin(email)}
										className="btn btn-ghost btn-sm"
										disabled={saving}
									>
										✕
									</button>
								</div>
							))}
						</div>
						<div className="flex gap-sm">
							<input
								type="email"
								className="input"
								value={newAdmin}
								onChange={(e) => setNewAdmin(e.target.value)}
								placeholder="email@gmail.com"
							/>
							<button
								onClick={handleAddAdmin}
								className="btn btn-primary"
								disabled={saving}
							>
								+
							</button>
						</div>
					</div>

					{/* Super Admins Card */}
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">👑 Super Admin</h3>
						</div>
						<div className="email-list mb-md">
							{superAdmins.map(email => (
								<div key={email} className="email-item">
									<span className="email-text">
										{email} {email === user.email && '(Kamu)'}
									</span>
									<button
										onClick={() => handleRemoveSuperAdmin(email)}
										className="btn btn-ghost btn-sm"
										disabled={saving || email === user.email}
									>
										✕
									</button>
								</div>
							))}
						</div>
						<div className="flex gap-sm">
							<input
								type="email"
								className="input"
								value={newSuperAdmin}
								onChange={(e) => setNewSuperAdmin(e.target.value)}
								placeholder="email@gmail.com"
							/>
							<button
								onClick={handleAddSuperAdmin}
								className="btn btn-primary"
								disabled={saving}
							>
								+
							</button>
						</div>
					</div>

					{/* Spreadsheet Config Card */}
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">📊 Konfigurasi Spreadsheet</h3>
						</div>
						{spreadsheetConfig && (
							<>
								<div className="input-group mb-md">
									<label className="input-label">🔗 Spreadsheet ID</label>
									<input
										type="text"
										className="input"
										value={spreadsheetConfig.spreadsheetId || ''}
										onChange={(e) => setSpreadsheetConfig({
											...spreadsheetConfig,
											spreadsheetId: e.target.value
										})}
										placeholder="1GfKZVf72q3NPdwOD7K-sFvoEijzd_1tslsFPDaHD3Y0"
									/>
								</div>
								<div className="input-group mb-md">
									<label className="input-label">📄 Nama Sheet</label>
									<input
										type="text"
										className="input"
										value={spreadsheetConfig.sheetName || ''}
										onChange={(e) => setSpreadsheetConfig({
											...spreadsheetConfig,
											sheetName: e.target.value
										})}
										placeholder="Contoh: Day 1, 2/12"
									/>
								</div>
								<div className="input-group mb-md">
									<label className="input-label">Start Row</label>
									<input
										type="number"
										className="input"
										value={spreadsheetConfig.startRow}
										onChange={(e) => setSpreadsheetConfig({
											...spreadsheetConfig,
											startRow: parseInt(e.target.value) || 2
										})}
									/>
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
									<div className="input-group">
										<label className="input-label">📝 Nama</label>
										<input
											type="text"
											className="input"
											value={spreadsheetConfig.columns.nama}
											onChange={(e) => setSpreadsheetConfig({
												...spreadsheetConfig,
												columns: { ...spreadsheetConfig.columns, nama: e.target.value.toUpperCase() }
											})}
											maxLength={2}
											placeholder="B"
										/>
									</div>
									<div className="input-group">
										<label className="input-label">🏫 Kelas</label>
										<input
											type="text"
											className="input"
											value={spreadsheetConfig.columns.kelas}
											onChange={(e) => setSpreadsheetConfig({
												...spreadsheetConfig,
												columns: { ...spreadsheetConfig.columns, kelas: e.target.value.toUpperCase() }
											})}
											maxLength={2}
											placeholder="C"
										/>
									</div>
									<div className="input-group">
										<label className="input-label">📷 Jumlah Foto</label>
										<input
											type="text"
											className="input"
											value={spreadsheetConfig.columns.jumlahFoto}
											onChange={(e) => setSpreadsheetConfig({
												...spreadsheetConfig,
												columns: { ...spreadsheetConfig.columns, jumlahFoto: e.target.value.toUpperCase() }
											})}
											maxLength={2}
											placeholder="D"
										/>
									</div>
									<div className="input-group">
										<label className="input-label">✅ Done</label>
										<input
											type="text"
											className="input"
											value={spreadsheetConfig.columns.done}
											onChange={(e) => setSpreadsheetConfig({
												...spreadsheetConfig,
												columns: { ...spreadsheetConfig.columns, done: e.target.value.toUpperCase() }
											})}
											maxLength={2}
											placeholder="F"
										/>
									</div>
									<div className="input-group">
										<label className="input-label">💳 QRIS</label>
										<input
											type="text"
											className="input"
											value={spreadsheetConfig.columns.qris}
											onChange={(e) => setSpreadsheetConfig({
												...spreadsheetConfig,
												columns: { ...spreadsheetConfig.columns, qris: e.target.value.toUpperCase() }
											})}
											maxLength={2}
											placeholder="H"
										/>
									</div>
									<div className="input-group">
										<label className="input-label">💵 Cash</label>
										<input
											type="text"
											className="input"
											value={spreadsheetConfig.columns.cash}
											onChange={(e) => setSpreadsheetConfig({
												...spreadsheetConfig,
												columns: { ...spreadsheetConfig.columns, cash: e.target.value.toUpperCase() }
											})}
											maxLength={2}
											placeholder="I"
										/>
									</div>
								</div>
								<button
									onClick={handleUpdateSpreadsheetConfig}
									className="btn btn-primary w-full mt-md"
									disabled={saving}
								>
									Simpan Konfigurasi
								</button>
							</>
						)}
					</div>

					{/* Danger Zone */}
					<div className="card" style={{ borderColor: 'var(--danger-500)' }}>
						<div className="card-header">
							<h3 className="card-title" style={{ color: 'var(--danger-500)' }}>⚠️ Danger Zone</h3>
						</div>
						<p className="text-sm text-muted mb-md">
							Reset antrian akan menghapus semua data antrian dari memori server.
							Data yang sudah masuk ke spreadsheet tidak akan terhapus.
						</p>
						<button
							onClick={handleResetQueue}
							className="btn btn-danger w-full"
							disabled={saving}
						>
							Reset Semua Antrian
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
