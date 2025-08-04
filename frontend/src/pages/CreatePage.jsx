import React from 'react'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useRateLimit from '../hooks/useRateLimit'
import RateLimitModal from '../components/RateLimitModal'
import NavBar from '../components/NavBar'

const CreatePage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { isRateLimited, retryAfter, handleRateLimit, closeRateLimit } = useRateLimit()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      })

      if (handleRateLimit(response)) {
        setLoading(false)
        return
      }

      if (response.ok) {
        toast.success('Note created successfully!')
        navigate('/')
      } else {
        toast.error('Failed to create note')
      }
    } catch (error) {
      toast.error('Failed to create note')
      console.error('Error creating note:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-base-content">Create New Note</h1>
          <p className="text-base-content/70 mt-2">Write down your thoughts and ideas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter note title..."
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Content</span>
            </label>
            <textarea
              placeholder="Write your note content..."
              className="textarea textarea-bordered h-32 w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Note'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <RateLimitModal 
        isOpen={isRateLimited}
        onClose={closeRateLimit}
        retryAfter={retryAfter}
      />
    </div>
  )
}

export default CreatePage