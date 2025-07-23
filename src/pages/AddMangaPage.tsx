import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import Navbar from '../components/Navbar';
import { useManga } from '../context/MangaContext';

const AddMangaPage: React.FC = () => {
  const navigate = useNavigate();
  const { addManga } = useManga();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [genres, setGenres] = useState('');
  const [publicationYear, setPublicationYear] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const genreList = genres
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g.length);

    addManga({
      title,
      author,
      description,
      coverImage,
      genres: genreList,
      publicationYear: publicationYear ? parseInt(publicationYear, 10) : undefined,
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen ">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-semibold mb-6 text-center text-manga-red">
            <Plus className="inline-block mr-2 h-6 w-6 align-middle" />
            Add New Manga
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-manga-red focus:border-manga-red"
                  placeholder="Enter manga title"
                />
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-manga-red focus:border-manga-red"
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-manga-red focus:border-manga-red"
                placeholder="Enter manga description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
                  Cover Image URL
                </label>
                <input
                  id="coverImage"
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-manga-red focus:border-manga-red"
                  placeholder="Optional image URL"
                />
              </div>

              {/* Publication Year */}
              <div>
                <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700">
                  Publication Year
                </label>
                <input
                  id="publicationYear"
                  type="number"
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-manga-red focus:border-manga-red"
                  placeholder="e.g. 2021"
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            {/* Genres */}
            <div>
              <label htmlFor="genres" className="block text-sm font-medium text-gray-700">
                Genres (comma separated)
              </label>
              <input
                id="genres"
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-manga-red focus:border-manga-red"
                placeholder="Shounen, Action, Adventure"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-manga-red text-white rounded-md hover:bg-red-700 transition"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Manga
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddMangaPage;
