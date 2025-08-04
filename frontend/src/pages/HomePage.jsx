import React from 'react'
import NavBar from '../components/NavBar'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useRateLimit from '../hooks/useRateLimit'
import RateLimitModal from '../components/RateLimitModal'

const HomePage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const { isRateLimited, retryAfter, handleRateLimit, closeRateLimit } = useRateLimit()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/notes')
      
      if (handleRateLimit(response)) {
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setNotes(data)
      } else {
        toast.error('Failed to fetch notes')
      }
    } catch (error) {
      toast.error('Failed to fetch notes')
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/notes/${id}`, {
        method: 'DELETE'
      })
      
      if (handleRateLimit(response)) {
        return
      }
      
      if (response.ok) {
        toast.success('Note deleted successfully')
        fetchNotes() // Refresh the list
      } else {
        toast.error('Failed to delete note')
      }
    } catch (error) {
      toast.error('Failed to delete note')
      console.error('Error deleting note:', error)
    }
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-base-content">My Notes</h1>
            <p className="text-base-content/70 mt-2">Create and manage your notes easily.</p>
          </div>
          <Link to="/create" className="btn btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Note
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">No notes yet</h3>
            <p className="text-base-content/70 mb-6">Create your first note to get started!</p>
            <Link to="/create" className="btn btn-primary">Create Your First Note</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-base-content">{note.title}</h2>
                  <p className="text-base-content/70 line-clamp-3">{note.content}</p>
                  <div className="card-actions justify-end mt-4">
                    <Link to={`/note/${note._id}`} className="btn btn-sm btn-outline">
                      View
                    </Link>
                    <button 
                      onClick={() => deleteNote(note._id)} 
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-xs text-base-content/50 mt-2">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <RateLimitModal 
        isOpen={isRateLimited}
        onClose={closeRateLimit}
        retryAfter={retryAfter}
      />
    </div>
  )
}

export default HomePage

