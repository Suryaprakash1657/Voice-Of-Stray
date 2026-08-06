import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import SearchBar from './Community/components/SearchBar.jsx';
import FeedFilters from './Community/components/FeedFilters.jsx';
import PostComposer from './Community/components/PostComposer.jsx';
import PostCard from './Community/components/PostCard.jsx';
import EmptyFeed from './Community/components/EmptyFeed.jsx';
import CreatePostModal from './Community/components/CreatePostModal.jsx';

// Sidebar widgets
import AlertsWidget from './Community/components/Sidebar/AlertsWidget.jsx';
import EmergencyContacts from './Community/components/Sidebar/EmergencyContacts.jsx';
import TrendingRescues from './Community/components/Sidebar/TrendingRescues.jsx';
import SuggestedNgos from './Community/components/Sidebar/SuggestedNgos.jsx';
import TopContributors from './Community/components/Sidebar/TopContributors.jsx';

// Custom hook
import { useCommunityPosts } from './Community/hooks/useCommunityPosts.js';

export default function Community() {
  const [activeTab, setActiveTab] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const {
    posts,
    currentUser,
    savedPostIds,
    sessionCreatedPostIds,
    toggleLike,
    toggleSave,
    createPost,
    deletePost,
    addComment,
    deleteComment
  } = useCommunityPosts(activeTab, searchQuery);

  const handleCreatePost = (postData) => {
    createPost(postData);
    triggerToast("✅ Your impact has been shared.");
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const sidebarContent = (
    <>
      <AlertsWidget />
      <EmergencyContacts />
      <TrendingRescues />
      <SuggestedNgos />
      <TopContributors />
      
      <div className="footer-links">
        <a href="#">About</a> • <a href="#">Privacy</a> • <a href="#">Terms</a>
        <p style={{ margin: '8px 0 0 0' }}>&copy; 2026 Voice of Stray</p>
      </div>
    </>
  );

  return (
    <PageContainer sidebar={sidebarContent}>
      <style>{`
        .toast-notification {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: #1e293b;
          color: white;
          padding: 14px 24px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          z-index: 10005;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
          opacity: 0;
          pointer-events: none;
        }

        .toast-notification.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .badge-story {
          background-color: #10b981 !important;
          color: white !important;
        }

        .new-post-animation {
          animation: newPostFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes newPostFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <SectionHeader 
        title="Community Feed" 
        subtitle="Connect, rescue, inspire, and support stray animals together."
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FeedFilters activeTab={activeTab} onChange={setActiveTab} />

      <PostComposer currentUser={currentUser} onCreatePost={handleCreatePost} />

      <div className="feed-stream" id="feed-stream-container">
        {posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id}
              post={post}
              currentUser={currentUser}
              isSaved={savedPostIds.includes(post.id)}
              isNewPost={sessionCreatedPostIds.has(post.id)}
              onLike={toggleLike}
              onSave={toggleSave}
              onDelete={deletePost}
              onAddComment={addComment}
              onDeleteComment={deleteComment}
            />
          ))
        )}
      </div>

      <button className="floating-action-btn" onClick={() => setIsModalOpen(true)}>
        <i className="ph ph-plus"></i> Share Your Impact
      </button>

      <CreatePostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        onShare={handleCreatePost}
      />

      <div className={`toast-notification ${toastMessage ? 'show' : ''}`}>
        <span>{toastMessage}</span>
      </div>
    </PageContainer>
  );
}
