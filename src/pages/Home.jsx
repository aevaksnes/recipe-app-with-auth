import { useState, useEffect } from "react"
import { useAuth } from "../components/useAuth"
import { db } from "../firebase"
import { collection, query, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore" // Import deleteDoc
import { useNavigate } from "react-router-dom"

function Home() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [searchTitle, setSearchTitle] = useState("")
  const [searchIngredients, setSearchIngredients] = useState("")
  const [searchHashtag, setSearchHashtag] = useState("")
  const navigate = useNavigate()

  const predefinedHashtags = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"]

  useEffect(() => {
    if (user) {
      const fetchRecipes = async () => {
        const q = query(collection(db, "recipes"))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setRecipes(data)
        setFilteredRecipes(data)
      }
      fetchRecipes()
    }
  }, [user])

  // Filter recipes based on search inputs
  useEffect(() => {
    if (user) {
      const filtered = recipes.filter((recipe) => {
        const matchesTitle = recipe.title.toLowerCase().includes(searchTitle.toLowerCase())
        const matchesIngredients = recipe.ingredients.toLowerCase().includes(searchIngredients.toLowerCase())
        const matchesHashtag = searchHashtag ? recipe.hashtags?.includes(searchHashtag) : true
        return matchesTitle && matchesIngredients && matchesHashtag
      })
      setFilteredRecipes(filtered)
    }
  }, [searchTitle, searchIngredients, searchHashtag, recipes, user])

  const addComment = async (recipeId, commentText) => {
    if (!user) return alert("You must be logged in to add a comment.")
    const comment = {
      text: commentText,
      addedBy: user.displayName || "Unknown",
      created: new Date()
    }
    await addDoc(collection(db, "recipes", recipeId, "comments"), comment)
    alert("Comment added!")
  }

  const deleteRecipe = async (recipeId) => {
    if (!user) return alert("You must be logged in to delete a recipe.")
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?")
    if (confirmDelete) {
      await deleteDoc(doc(db, "recipes", recipeId))
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId)) // Update state after deletion
      alert("Recipe deleted!")
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Conditionally render search fields */}
      {user ? (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Search by ingredients"
            value={searchIngredients}
            onChange={(e) => setSearchIngredients(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={searchHashtag}
            onChange={(e) => setSearchHashtag(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All hashtags</option>
            {predefinedHashtags.map((hashtag) => (
              <option key={hashtag} value={hashtag}>
                {hashtag}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-center text-gray-500">Please log in to search recipes.</p>
      )}

      {/* Recipe List */}
      {user ? (
        <div className="space-y-4">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="border p-4 rounded bg-white shadow">
              <h2 className="text-xl font-semibold">{recipe.title}</h2>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Instructions:</strong> {recipe.instructions}</p>
              <p><strong>Calories:</strong> {recipe.calories}</p>
              <p><strong>Protein:</strong> {recipe.protein} g</p>
              <p><strong>Fiber:</strong> {recipe.fiber} g</p>
              <p><strong>Hashtags:</strong> {recipe.hashtags?.join(", ")}</p>
              <p><strong>Added by:</strong> {recipe.createdBy || "Unknown"}</p>
              {user && user.uid === recipe.uid && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                    className="text-blue-600 underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="text-red-600 underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Comment Section */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                <CommentList recipeId={recipe.id} />
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const commentText = e.target.elements.comment.value
                    addComment(recipe.id, commentText)
                    e.target.reset()
                  }}
                  className="mt-2"
                >
                  <input
                    type="text"
                    name="comment"
                    placeholder="Add a comment"
                    className="w-full p-2 border rounded mb-2"
                    required
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Comment
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function CommentList({ recipeId }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(collection(db, "recipes", recipeId, "comments"))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setComments(data)
    }
    fetchComments()
  }, [recipeId])

  const deleteComment = async (commentId) => {
    if (!user) return alert("You must be logged in to delete a comment.")
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?")
    if (confirmDelete) {
      await deleteDoc(doc(db, "recipes", recipeId, "comments", commentId))
      setComments(comments.filter(comment => comment.id !== commentId)) // Update state after deletion
      alert("Comment deleted!")
    }
  }

  return (
    <div className="mt-2 space-y-2">
      {comments.map(comment => (
        <div key={comment.id} className="border p-2 rounded bg-gray-100 flex justify-between items-center">
          <p>
            <strong>{comment.addedBy}:</strong> {comment.text}
          </p>
          {user && user.displayName === comment.addedBy && (
            <button
              onClick={() => deleteComment(comment.id)}
              className="text-red-600 underline text-sm"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

export default Home