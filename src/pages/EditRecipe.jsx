import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [title, setTitle] = useState("")
  const [ingredients, setIngredients] = useState("")
  const [instructions, setInstructions] = useState("")
  const [calories, setCalories] = useState("")
  const [protein, setProtein] = useState("")
  const [fiber, setFiber] = useState("")
  const [hashtags, setHashtags] = useState([])

  const predefinedHashtags = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"]

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, "recipes", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setRecipe(data)
        setTitle(data.title)
        setIngredients(data.ingredients)
        setInstructions(data.instructions)
        setCalories(data.calories)
        setProtein(data.protein)
        setFiber(data.fiber)
        setHashtags(data.hashtags || [])
      }
    }
    fetchRecipe()
  }, [id])

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
    const docRef = doc(db, "recipes", id)
    await updateDoc(docRef, {
      title,
      ingredients,
      instructions,
      calories: calories || 0, // Default to 0 if empty
      protein: protein || 0,  // Default to 0 if empty
      fiber: fiber || 0,      // Default to 0 if empty
      hashtags,
    })
    navigate("/")
  }

  if (!recipe) return <p>Loading recipe...</p>

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
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
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update Recipe</button>
      </form>
    </div>
  )
}

export default EditRecipe