import './App.css';
import ExpedienteTecnico from './components/ExpedienteTecnico';
import ExpedienteCoordinador from './components/ExpedienteCoordinador';
import NavBar from './components/NavBar';
import { useUser } from '@clerk/clerk-react';
import Home from './components/Home';


function App() {
  const {isSignedIn} = useUser();
  const usuario = useUser();
  const role = usuario.user?.publicMetadata.role;

  return (
  <div className="App">
    <NavBar />

    {isSignedIn ? (
      <>
        {role === "tecnico" && <ExpedienteTecnico />}
        {role === "coordinador" && <ExpedienteCoordinador />}
      </>
    ) : (
      <>
        {!isSignedIn ? (
          <Home />
        ) : (
          <div>
            <h2>Inicio de Sesión Correctamente</h2>
            <h3>En espera de autorización del administrador</h3>
          </div>
        )}
      </>
    )}
  </div>
);

}

export default App;
