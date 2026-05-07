import { useState } from 'react';
import { api } from '../services/api';
import '../estilos/Login.css';

function Login({ onLogin }) {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const usuario = await api.login(nombre, password);
            if (usuario.error) {
                setError(usuario.error);
            } else {
                onLogin(usuario);
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">🍗</div>
                    <h1>Doña Choca</h1>
                    <p className="subtitle">Sistema de Gestión</p>
                </div>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">⚠️ {error}</div>}
                    
                    <div className="input-group">
                        <span className="input-icon">👤</span>
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <span className="input-icon">🔒</span>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? (
                            <span>⏳ Iniciando...</span>
                        ) : (
                            <span>🚀 Entrar</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;