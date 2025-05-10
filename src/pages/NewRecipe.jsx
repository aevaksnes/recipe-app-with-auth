import { useState } from "react"
import { useAuth } from "../components/useAuth"
import { db } from "../firebase"
import { collection, addDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

function NewRecipe() {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [fiber, setFiber] = useState("")
  const [hashtags, setHashtags] = useState([])
  const navigate = useNavigate()

  const predefinedHashtags = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"]

  const handleHashtagChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setHashtags([...hashtags, value])
    } else {
      setHashtags(hashtags.filter((hashtag) => hashtag !== value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    await addDoc(collection(db, "recipes"), {
      uid: user.uid,
      title,
      ingredients,
      instructions,
      calories,
      protein,
      fiber,
      hashtags,
      created: new Date(),
      createdBy: user.displayName || "Unknown",
    })
    navigate("/") // Redirect to the homepage after submission
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Fiber (g)"
          value={fiber}
          onChange={(e) => setFiber(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <div>
          <p className="font-semibold">Select hashtags:</p>
          {predefinedHashtags.map((hashtag) => (
            <label key={hashtag} className="block">
              <input
                type="checkbox"
                value={hashtag}
                checked={hashtags.includes(hashtag)}
                onChange={handleHashtagChange}
                className="mr-2"
              />
              {hashtag}
            </label>
          ))}
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save Recipe</button>
      </form>
    </div>
  )
}

export default NewRecipe