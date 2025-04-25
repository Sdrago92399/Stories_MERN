// File: components/StorySubmissionForm.jsx
import React, { useState } from "react";
import useAuth from "@/redux/dispatch/useAuth";
import { submitStoryApi } from "@/api/storiesApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const StorySubmissionForm = () => {
  const { auth } = useAuth();
  const [user] = useState(auth.user);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleTagKeyDown = (e) => {
    if (e.key === "," && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setTags([]);
    setTagInput("");
    setIsAnonymous(false);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitStoryApi({ title, body, tags, isAnonymous });
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-full bg-gradient-to-br from-gray-100 to-gray-300 text-black py-8">
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Share Your Story</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter your story title"
              className="w-full p-2 text-black border rounded bg-indigo-100 focus:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* WYSIWYG Editor */}
          <div>
            <label className="block text-sm font-medium mb-1">Story Body</label>
            <ReactQuill
              value={body}
              onChange={setBody}
              className="bg-indigo-100 text-black rounded focus:outline-none focus:bg-indigo-200 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags (press comma to add)</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-black px-2 py-1 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(idx)}
                    className="ml-1 px-1 py-0 bg-indigo-400 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="e.g. adventure, life"
                className="flex-1 p-1 border-b bg-indigo-100 text-black focus:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center">
            <input
              id="anonymous"
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2 text-black focus:ring-indigo-500"
            />
            <label htmlFor="anonymous" className="text-sm">Submit anonymously</label>
          </div>

          {/* Consent Form */}
          <p className="text-xs italic opacity-75">
            * By submitting, you confirm you own the content and we are not responsible for its contents.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Submit Story
          </button>
        </form>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-sm mx-auto text-center">
              <h3 className="text-xl font-semibold mb-4">Story Submitted!</h3>
              <p className="mb-6">
                You have successfully submitted the story. You will be notified when our editorial
                team decides to publish it.
              </p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Share Another Story
                </button>
                <button
                  onClick={() => navigate('/stories')}
                  className="flex-1 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Exit to Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorySubmissionForm;
