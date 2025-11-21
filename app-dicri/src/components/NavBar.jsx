import "../styles/minimal.css";
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';

const NavBar = () => {
    const {isLoaded, isSignedIn, user} = useUser();
    const usuario = useUser();
    const role = usuario.user?.publicMetadata.role;
  return (
    <nav className="navbar">
        { isSignedIn && isLoaded ? (
            <div className="navbar-user">
                <h3>App DICRI - Bienvenido, {user.firstName}, --- Rol: {role?.toUpperCase()} </h3>
            </div>
        ) : <h3>App DICRI</h3>}
      <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    </nav>
  );
};

export default NavBar;