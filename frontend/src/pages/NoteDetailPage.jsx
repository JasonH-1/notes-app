import React from 'react'

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useRateLimit from '../hooks/useRateLimit'
import RateLimitModal from '../components/RateLimitModal'
import NavBar from '../components/NavBar'

const NoteDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { isRateLimited, retryAfter, handleRateLimit, closeRateLimit } = useRateLimit()

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/notes/${id}`)
      
      if (handleRateLimit(response)) {
        setLoading(false)
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setNote(data)
        setTitle(data.title)
        setContent(data.content)
      } else {
        toast.error('Note not found')
        navigate('/')
      }
    } catch (error) {
      toast.error('Failed to fetch note')
      console.error('Error fetching note:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const response = await fetch(`http://localhost:5001/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (handleRateLimit(response)) {
        return
      }

      if (response.ok) {
        toast.success('Note updated successfully!')
        setEditing(false)
        fetchNote() // Refresh the note data
      } else {
        toast.error('Failed to update note')
      }
    } catch (error) {
      toast.error('Failed to update note')
      console.error('Error updating note:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/notes/${id}`, {
          method: 'DELETE'
        })

        if (handleRateLimit(response)) {
          return
        }

        if (response.ok) {
          toast.success('Note deleted successfully')
          navigate('/')
        } else {
          toast.error('Failed to delete note')
        }
      } catch (error) {
        toast.error('Failed to delete note')
        console.error('Error deleting note:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-base-content">
              {editing ? 'Edit Note' : 'Note Details'}
            </h1>
            <div className="flex gap-2">
              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUpdate}
                    className="btn btn-primary btn-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setTitle(note.title)
                      setContent(note.content)
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {editing ? (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Content</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-64 w-full"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl text-base-content mb-4">{note.title}</h2>
              <div className="prose max-w-none">
                <p className="text-base-content whitespace-pre-wrap">{note.content}</p>
              </div>
              <div className="text-sm text-base-content/50 mt-6">
                Created: {new Date(note.createdAt).toLocaleString()}
                {note.updatedAt !== note.createdAt && (
                  <span className="ml-4">
                    Updated: {new Date(note.updatedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
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
export default NoteDetailPage