import { useState, useEffect } from 'react';
import * as storage from '../services/communityStorage';

export function useCommunityPosts(filterTab, searchQuery) {
  const [posts, setPosts] = useState([]);
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(storage.getCurrentUser());
  const [sessionCreatedPostIds] = useState(() => new Set());

  // Load posts and configuration
  useEffect(() => {
    setPosts(storage.getPosts());
    setSavedPostIds(storage.getSavedPosts());
    setCurrentUser(storage.getCurrentUser());

    // Sync state if localStorage changes in other windows/tabs
    const handleStorageChange = () => {
      setPosts(storage.getPosts());
      setSavedPostIds(storage.getSavedPosts());
      setCurrentUser(storage.getCurrentUser());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filterText = filterTab.toLowerCase();
  const searchQueryLower = searchQuery.toLowerCase().trim();

  // Search & Filter Matching logic
  const filteredPosts = posts.filter(p => {
    // 1. Category Filter Check
    let matchesCategory = false;
    if (filterText === "for you") {
      matchesCategory = true;
    } else {
      const postCategory = (p.category || "").toLowerCase();
      if (filterText === "stories" || filterText === "story") {
        matchesCategory = (postCategory === "stories" || postCategory === "story");
      } else if (filterText === "alerts" || filterText === "alert") {
        matchesCategory = (postCategory === "alerts" || postCategory === "alert");
      } else {
        matchesCategory = (postCategory === filterText);
      }
    }

    // 2. Search Query Check
    let matchesSearch = true;
    if (searchQueryLower.length > 0) {
      const description = (p.description || "").toLowerCase();
      const author = (p.authorName || "").toLowerCase();
      const location = (p.location || "").toLowerCase();
      const category = (p.category || "").toLowerCase();

      matchesSearch = description.includes(searchQueryLower) ||
                      author.includes(searchQueryLower) ||
                      location.includes(searchQueryLower) ||
                      category.includes(searchQueryLower);
    }

    return matchesCategory && matchesSearch;
  });

  // Action mutations
  const toggleLike = (postId) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const likedBy = p.likedBy || [];
        const idx = likedBy.indexOf(currentUser.name);
        let likes = p.likes || 0;
        let newLikedBy = [...likedBy];

        if (idx === -1) {
          newLikedBy.push(currentUser.name);
          likes += 1;
        } else {
          newLikedBy.splice(idx, 1);
          likes = Math.max(0, likes - 1);
        }
        return { ...p, likes, likedBy: newLikedBy };
      }
      return p;
    });

    setPosts(updated);
    storage.savePosts(updated);
  };

  const toggleSave = (postId) => {
    const updatedSaved = [...savedPostIds];
    const idx = updatedSaved.indexOf(postId);
    if (idx === -1) {
      updatedSaved.push(postId);
    } else {
      updatedSaved.splice(idx, 1);
    }
    setSavedPostIds(updatedSaved);
    storage.saveSavedPosts(updatedSaved);
  };

  const createPost = ({ description, category, images, video, location }) => {
    const newPost = {
      id: "POST-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000),
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      description: description || "",
      category: category || "Rescue",
      images: images || [],
      video: video || "",
      location: location || "",
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      comments: [],
      savedBy: [],
      createdBy: currentUser.name
    };

    sessionCreatedPostIds.add(newPost.id);

    const updated = [newPost, ...posts];
    setPosts(updated);
    storage.savePosts(updated);
    return newPost.id;
  };

  const deletePost = (postId) => {
    const updated = posts.filter(p => p.id !== postId);
    setPosts(updated);
    storage.savePosts(updated);
  };

  const addComment = (postId, text) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        const newComment = {
          commentId: "COM-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000),
          author: currentUser.name,
          avatar: currentUser.avatar,
          role: currentUser.role,
          text: text,
          timestamp: Date.now()
        };
        return { ...p, comments: [newComment, ...comments] };
      }
      return p;
    });

    setPosts(updated);
    storage.savePosts(updated);
  };

  const deleteComment = (postId, commentId) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const comments = p.comments || [];
        const filtered = comments.filter(c => c.commentId !== commentId);
        return { ...p, comments: filtered };
      }
      return p;
    });

    setPosts(updated);
    storage.savePosts(updated);
  };

  return {
    posts: filteredPosts,
    currentUser,
    savedPostIds,
    sessionCreatedPostIds,
    toggleLike,
    toggleSave,
    createPost,
    deletePost,
    addComment,
    deleteComment
  };
}
