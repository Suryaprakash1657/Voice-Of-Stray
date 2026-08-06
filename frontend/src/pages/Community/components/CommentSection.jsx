import React, { useState } from 'react';
import Avatar from '../../../components/ui/Avatar.jsx';

export default function CommentSection({
  postId,
  comments = [],
  currentUser,
  onAddComment,
  onDeleteComment
}) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentText('');
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Are you sure you want to delete your comment?")) {
      onDeleteComment(postId, commentId);
    }
  };

  return (
    <div className="post-comments" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
      {comments.map((c) => {
        const isCommentCreator = c.author === currentUser.name;
        return (
          <div key={c.commentId} className="comment">
            <Avatar src={c.avatar} alt={c.author} size="sm" className="avatar-sm" />
            <div className="comment-content">
              <strong>{c.author}</strong> <span>{c.text}</span>
              <div className="comment-actions">
                <button type="button">Like</button>
                <button type="button">Reply</button>
                {isCommentCreator && (
                  <button 
                    type="button" 
                    onClick={() => handleDelete(c.commentId)}
                    style={{ color: 'var(--alert)', marginLeft: '8px', fontWeight: 600 }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <form onSubmit={handleSubmit} className="comment-input-area" style={{ marginTop: '4px' }}>
        <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" className="avatar-sm" />
        <input 
          type="text" 
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="btn-text">Post</button>
      </form>
    </div>
  );
}
