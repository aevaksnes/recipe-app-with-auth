import { Link } from "react-router-dom"
import { useAuth } from "../components/useAuth"
import backgroundImage from "../assets/background.jpg"

function Layout({ children }) {
  const { user, login, logout } = useAuth()

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "grey",
      }}
    >
      <div style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", minHeight: "100vh" }}>
        {/* Header */}
        <header className="p-8 bg-black bg-opacity-50 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Title and Login */}
            <div className="flex justify-between items-center w-full md:w-auto">
              <h1 className="text-2xl font-bold">
                <Link to="/" className="hover:underline">Recipes</Link>
              </h1>
              <div className="md:hidden">
                {user ? (
                  <button onClick={logout} className="text-blue-400 underline text-sm ml-4">Logout</button>
                ) : (
                  <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded ml-4">Login</button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-4 md:mt-0 space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              {user && <Link to="/new-recipe" className="hover:underline">Add Recipe</Link>}
            </nav>

            {/* Login/Logout for larger screens */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center space-x-2">
                  <p className="text-sm">{user.displayName}</p>
                  <button onClick={logout} className="text-blue-400 underline text-sm">Logout</button>
                </div>
              ) : (
                <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

export default Layout