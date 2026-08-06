import React, { useState } from 'react';
import { Card, Badge, Avatar } from '../../../components/ui';
import CommentSection from './CommentSection.jsx';

function PostCard({
  post,
  currentUser,
  isSaved,
  isNewPost,
  onLike,
  onSave,
  onDelete,
  onAddComment,
  onDeleteComment
}) {
  const [showComments, setShowComments] = useState(false);
  const relativeTime = getPostRelativeTime(post.timestamp);
  const isCreator = post.createdBy === currentUser.name;

  const categoryLower = (post.category || "rescue").toLowerCase();
  let badgeVariant = categoryLower;
  if (categoryLower === "alert" || categoryLower === "alerts") badgeVariant = "alert";
  if (categoryLower === "story" || categoryLower === "stories") badgeVariant = "adoption";

  const locationInfo = post.location ? ` • ` : "";
  const isVerified = (post.authorRole === "NGO" || post.authorRole === "Volunteer");

  const isLiked = post.likedBy && post.likedBy.includes(currentUser.name);
  const likesButtonClass = isLiked ? "action-btn liked" : "action-btn";
  const likesIconClass = isLiked ? "ph-fill ph-heart" : "ph ph-heart";

  const saveIconClass = isSaved ? "ph-fill ph-bookmark-simple" : "ph ph-bookmark-simple";
  const saveStyle = isSaved ? { color: 'var(--primary)' } : {};

  const handleShare = () => {
    const shareUrl = window.location.href.split("#")[0] + "#" + post.id;
    if (navigator.share) {
      navigator.share({
        title: "Voice of Stray Community Post",
        text: "Check out this community post on Voice of Stray!",
        url: shareUrl
      }).catch(err => console.log("Error sharing", err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Post link copied successfully.");
      });
    }
  };

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id);
    }
  };

  return (
    <Card className={`post-card ${isNewPost ? 'new-post-animation' : ''}`}>
      <Card.Header>
        <div className="post-author">
          <Avatar src={post.authorAvatar} alt={post.authorName} size="sm" className="avatar" />
          <div className="author-info">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
              {post.authorName} 
              {isVerified && <i className="ph-fill ph-seal-check verified-badge"></i>} 
              <Badge variant={badgeVariant}>{post.category}</Badge>
            </h4>
            <span className="post-meta">
              {relativeTime}
              {post.location && (
                <>
                  {locationInfo}
                  <i className="ph ph-map-pin"></i> {post.location}
                </>
              )}
            </span>
          </div>
        </div>
        {isCreator ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button"
              className="delete-post-btn" 
              onClick={handleDeletePost}
              style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--alert)', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <i className="ph ph-trash"></i> Delete
            </button>
            <button type="button" className="icon-btn"><i className="ph ph-dots-three"></i></button>
          </div>
        ) : (
          <button type="button" className="icon-btn"><i className="ph ph-dots-three"></i></button>
        )}
      </Card.Header>

      <Card.Body className="post-content">
        <p style={{ marginTop: '4px', marginBottom: '16px' }}>{post.description}</p>
        
        {post.video && (
          <div className="post-media">
            <video src={post.video} controls style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: '450px', objectFit: 'cover' }}></video>
          </div>
        )}
        
        {!post.video && post.images && post.images.length === 1 && (
          <div className="post-media">
            <img src={post.images[0]} alt="Post media" />
          </div>
        )}
        
        {!post.video && post.images && post.images.length > 1 && (
          <div className="post-media split">
            <img src={post.images[0]} alt="Post media 1" />
            <img src={post.images[1]} alt="Post media 2" />
          </div>
        )}
      </Card.Body>

      <div className="post-actions">
        <div className="left-actions">
          <button type="button" className={likesButtonClass} onClick={() => onLike(post.id)}>
            <i className={likesIconClass}></i> {post.likes || 0}
          </button>
          <button type="button" className="action-btn" onClick={() => setShowComments(!showComments)}>
            <i className="ph ph-chat-circle"></i> {post.comments ? post.comments.length : 0}
          </button>
        </div>
        <div className="right-actions">
          <button type="button" className="action-btn" onClick={() => onSave(post.id)} style={saveStyle}>
            <i className={saveIconClass}></i>
          </button>
          <button type="button" className="action-btn" onClick={handleShare}>
            <i className="ph ph-share-network"></i>
          </button>
        </div>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments}
          currentUser={currentUser}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
        />
      )}
    </Card>
  );
}

function getPostRelativeTime(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

// Memoize PostCard using React.memo to optimize rendering and prevent redundant child updates
export default React.memo(PostCard);
