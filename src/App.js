import { useState, useEffect } from 'react';
import Login from './vistas/Login';
import Caja from './vistas/Caja';
import Cocina from './vistas/Cocina';
import Admin from './vistas/Admin';
import './App.css';

function App() {
    const [usuario, setUsuario] = useState(null);
    const [vista, setVista] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsuario(user);
            setVista(determinarVista(user.rol));
        }
    }, []);

    const determinarVista = (rol) => {
        const r = rol ? rol.toString().toLowerCase().trim() : '';
        if (r === 'admin') return 'admin';
        if (r === 'cocina') return 'cocina';
        return 'caja';
    };

    const handleLogin = (user) => {
        console.log('Login con usuario:', user);
        setUsuario(user);
        setVista(determinarVista(user.rol));
    };

    const handleLogout = () => {
        localStorage.clear();
        setUsuario(null);
        setVista(null);
    };

    const renderizarVista = () => {
        if (!vista) return <Login onLogin={handleLogin} />;
        
        switch (vista) {
            case 'admin':
                return <Admin />;
            case 'cocina':
                return <Cocina usuario={usuario} />;
            default:
                return <Caja usuario={usuario} onLogout={handleLogout} />;
        }
    };

    const mostrarNav = usuario && vista;

    return (
        <div className="App">
            {mostrarNav ? (
                <>
                    <header className="app-header">
                        <h1>Doña Choca</h1>
                        <nav className="nav-menu">
                            {usuario.rol === 'cajero' && (
                                <button 
                                    className={vista === 'caja' ? 'active' : ''} 
                                    onClick={() => setVista('caja')}
                                >Caja</button>
                            )}
                            {usuario.rol === 'cocina' && (
                                <button 
                                    className={vista === 'cocina' ? 'active' : ''} 
                                    onClick={() => setVista('cocina')}
                                >Cocina</button>
                            )}
                            {usuario.rol === 'admin' && (
                                <button 
                                    className={vista === 'admin' ? 'active' : ''} 
                                    onClick={() => setVista('admin')}
                                >Admin</button>
                            )}
                        </nav>
                        <div className="user-info">
                            <span>{usuario.nombre}</span>
                            <button onClick={handleLogout}>Salir</button>
                        </div>
                    </header>
                    {renderizarVista()}
                </>
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;