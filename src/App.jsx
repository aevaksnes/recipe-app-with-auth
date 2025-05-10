import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import NewRecipe from "./pages/NewRecipe"
import EditRecipe from "./pages/EditRecipe"
import Layout from "./components/Layout"

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-recipe" element={<NewRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App