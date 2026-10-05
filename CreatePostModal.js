/**
 * CreatePostModal Component
 * A reusable modal component for creating new community posts.
 * Includes smooth transitions, keyboard trapping, escape key listener,
 * media file selection/preview/removal, and location tagging.
 */
class CreatePostModal {
    constructor({ currentUserName, currentUserAvatar, currentUserRole, onShare }) {
        this.currentUserName = currentUserName || "Arjun";
        this.currentUserAvatar = currentUserAvatar || "https://ui-avatars.com/api/?name=Arjun&background=f97316&color=fff";
        this.currentUserRole = currentUserRole || "Volunteer";
        this.onShare = onShare;

        this.selectedMedia = []; // Array of { type: 'image'|'video', dataUrl: string }
        this.previousActiveElement = null;

        this.initCSS();
        this.initDOM();
        this.initEvents();
    }

    initCSS() {
        if (document.getElementById('create-post-modal-styles')) return;

        const styles = `
            /* Backdrop styling */
            .modal-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(15, 23, 42, 0.6);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .modal-backdrop.open {
                opacity: 1;
                pointer-events: auto;
            }

            /* Dialog styling */
            .modal-dialog {
                background-color: var(--bg-card);
                width: 90%;
                max-width: 550px;
                border-radius: var(--radius-lg);
                border: 1px solid var(--border);
                box-shadow: var(--shadow-lg);
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                transform: scale(0.9) translateY(20px);
                opacity: 0;
                transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
            }
            .modal-backdrop.open .modal-dialog {
                transform: scale(1) translateY(0);
                opacity: 1;
            }

            /* Header styling */
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                border-bottom: 1px solid var(--border);
            }
            .modal-header h3 {
                font-size: 1.2rem;
                font-weight: 700;
                color: var(--text-main);
                margin: 0;
            }
            .modal-close-btn {
                color: var(--text-muted);
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border-radius: var(--radius-full);
                background: none;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s, color 0.2s;
            }
            .modal-close-btn:hover {
                background-color: var(--bg-main);
                color: var(--text-main);
            }
            .modal-share-btn {
                padding: 8px 20px;
                font-size: 0.95rem;
                font-weight: 600;
                border-radius: var(--radius-full);
                cursor: pointer;
                transition: all 0.2s;
            }
            .modal-share-btn:disabled {
                background-color: var(--border);
                color: var(--text-muted);
                cursor: not-allowed;
                transform: none !important;
                box-shadow: none !important;
            }

            /* Body styling */
            .modal-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                overflow-y: auto;
                flex-grow: 1;
            }
            .modal-user-profile {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .modal-user-info {
                display: flex;
                flex-direction: column;
            }
            .modal-username {
                font-weight: 700;
                color: var(--text-main);
                font-size: 0.95rem;
            }
            .modal-userrole {
                font-size: 0.8rem;
                color: var(--text-muted);
            }
            .modal-category-select {
                margin-left: auto;
            }
            .modal-select {
                padding: 6px 12px;
                border-radius: var(--radius-sm);
                border: 1px solid var(--border);
                background-color: var(--bg-main);
                color: var(--text-main);
                font-family: inherit;
                font-weight: 600;
                font-size: 0.85rem;
                outline: none;
                cursor: pointer;
            }

            /* Content input styling */
            .modal-textarea-container {
                flex-grow: 1;
                min-height: 120px;
            }
            .modal-textarea-container textarea {
                width: 100%;
                height: 100%;
                min-height: 120px;
                border: none;
                resize: none;
                font-family: inherit;
                font-size: 1.05rem;
                color: var(--text-main);
                outline: none;
                background: transparent;
            }
            .modal-textarea-container textarea::placeholder {
                color: var(--text-muted);
            }

            /* Location input styling */
            .modal-location-container {
                border-top: 1px solid var(--border);
                padding-top: 12px;
            }
            .modal-location-input-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                background-color: var(--bg-main);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: 8px 12px;
            }
            .modal-location-input-wrapper i {
                color: var(--primary);
                font-size: 1.1rem;
            }
            .modal-location-input-wrapper input {
                flex: 1;
                border: none;
                background: transparent;
                outline: none;
                font-family: inherit;
                font-size: 0.9rem;
                color: var(--text-main);
            }

            /* Previews container styling */
            .modal-media-previews {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 12px;
                margin-top: 8px;
                max-height: 200px;
                overflow-y: auto;
                padding: 4px;
            }
            .modal-preview-item {
                position: relative;
                aspect-ratio: 1;
                border-radius: var(--radius-sm);
                overflow: hidden;
                border: 1px solid var(--border);
                background-color: var(--bg-main);
            }
            .modal-preview-item img,
            .modal-preview-item video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .modal-remove-preview-btn {
                position: absolute;
                top: 4px;
                right: 4px;
                background-color: rgba(15, 23, 42, 0.7);
                color: white;
                border: none;
                border-radius: var(--radius-full);
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 0.75rem;
                transition: background-color 0.2s;
                z-index: 10;
            }
            .modal-remove-preview-btn:hover {
                background-color: var(--alert);
            }

            /* Footer/Toolbar styling */
            .modal-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 20px;
                border-top: 1px solid var(--border);
                background-color: var(--bg-main);
            }
            .add-to-post-label {
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-muted);
            }
            .modal-action-buttons {
                display: flex;
                gap: 12px;
            }
            .modal-action-icon-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                border-radius: var(--radius-sm);
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--text-muted);
                transition: all 0.2s;
                background: none;
                border: none;
                cursor: pointer;
            }
            .modal-action-icon-btn:hover {
                background-color: var(--border);
                color: var(--primary);
            }
            .modal-action-icon-btn i {
                font-size: 1.2rem;
            }

            @media (max-width: 576px) {
                .modal-dialog {
                    width: 95%;
                    max-height: 95vh;
                }
                .modal-footer {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 10px;
                }
                .modal-action-buttons {
                    justify-content: space-around;
                }
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.id = 'create-post-modal-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    initDOM() {
        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'create-post-modal-backdrop';
        backdrop.className = 'modal-backdrop';

        // Dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'modal-dialog-title');

        // Header
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `
            <button id="modal-close-button" class="modal-close-btn" aria-label="Close modal">
                <i class="ph ph-x"></i>
            </button>
            <h3 id="modal-dialog-title">Share Your Impact</h3>
            <button id="modal-share-button" class="btn-primary modal-share-btn" disabled>Share</button>
        `;

        // Body
        const body = document.createElement('div');
        body.className = 'modal-body';
        body.innerHTML = `
            <div class="modal-user-profile">
                <img src="${this.currentUserAvatar}" alt="${this.currentUserName}" class="avatar-sm">
                <div class="modal-user-info">
                    <span class="modal-username">${this.currentUserName}</span>
                    <span class="modal-userrole">${this.currentUserRole}</span>
                </div>
                <div class="modal-category-select">
                    <select id="modal-post-category-select" class="modal-select">
                        <option value="Rescue">Rescue</option>
                        <option value="Feeding">Feeding</option>
                        <option value="Adoption">Adoption</option>
                        <option value="Story">Story</option>
                        <option value="Alert">Alert</option>
                    </select>
                </div>
            </div>
            
            <div class="modal-textarea-container">
                <textarea id="modal-post-desc-textarea" placeholder="What's on your mind?"></textarea>
            </div>

            <div class="modal-location-container">
                <div class="modal-location-input-wrapper">
                    <i class="ph ph-map-pin"></i>
                    <input type="text" id="modal-post-loc-input" placeholder="Add location (e.g. Downtown Park)">
                </div>
            </div>

            <div id="modal-media-previews-div" class="modal-media-previews" style="display: none;"></div>
        `;

        // Footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        footer.innerHTML = `
            <span class="add-to-post-label">Add to your post</span>
            <div class="modal-action-buttons">
                <button type="button" id="modal-action-photo-btn" class="modal-action-icon-btn">
                    <i class="ph ph-image"></i>
                    <span>Photo</span>
                </button>
                <button type="button" id="modal-action-video-btn" class="modal-action-icon-btn">
                    <i class="ph ph-video"></i>
                    <span>Video</span>
                </button>
            </div>
            <input type="file" id="modal-hidden-photo-input" accept="image/*" multiple style="display: none;">
            <input type="file" id="modal-hidden-video-input" accept="video/*" style="display: none;">
        `;

        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);

        // Cache elements
        this.backdrop = backdrop;
        this.dialog = dialog;
        this.closeBtn = header.querySelector('#modal-close-button');
        this.shareBtn = header.querySelector('#modal-share-button');
        this.textarea = body.querySelector('#modal-post-desc-textarea');
        this.categorySelect = body.querySelector('#modal-post-category-select');
        this.locationInput = body.querySelector('#modal-post-loc-input');
        this.previewsContainer = body.querySelector('#modal-media-previews-div');
        
        this.photoBtn = footer.querySelector('#modal-action-photo-btn');
        this.videoBtn = footer.querySelector('#modal-action-video-btn');
        this.photoInput = footer.querySelector('#modal-hidden-photo-input');
        this.videoInput = footer.querySelector('#modal-hidden-video-input');
    }

    initEvents() {
        // Close on clicking cross
        this.closeBtn.addEventListener('click', () => this.close());

        // Close on clicking backdrop
        this.backdrop.addEventListener('click', (e) => {
            if (e.target === this.backdrop) {
                this.close();
            }
        });

        // Keyboard triggers
        this.backdrop.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
            if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });

        // Trigger file uploads
        this.photoBtn.addEventListener('click', () => this.photoInput.click());
        this.videoBtn.addEventListener('click', () => this.videoInput.click());

        // Handle file selections
        this.photoInput.addEventListener('change', (e) => this.handleFiles(e.target.files, 'image'));
        this.videoInput.addEventListener('change', (e) => this.handleFiles(e.target.files, 'video'));

        // Handle text area changes for validation
        this.textarea.addEventListener('input', () => this.validate());

        // Handle share click
        this.shareBtn.addEventListener('click', () => this.submitShare());
    }

    open() {
        this.previousActiveElement = document.activeElement;
        this.backdrop.style.display = 'flex';
        // Force reflow
        this.backdrop.offsetHeight;
        this.backdrop.classList.add('open');
        this.textarea.focus();
        this.validate();
    }

    close() {
        this.backdrop.classList.remove('open');
        setTimeout(() => {
            this.backdrop.style.display = 'none';
            this.reset();
            if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
                this.previousActiveElement.focus();
            }
        }, 250);
    }

    reset() {
        this.textarea.value = '';
        this.locationInput.value = '';
        this.categorySelect.selectedIndex = 0;
        this.selectedMedia = [];
        this.photoInput.value = '';
        this.videoInput.value = '';
        this.previewsContainer.innerHTML = '';
        this.previewsContainer.style.display = 'none';
        this.validate();
    }

    validate() {
        const text = this.textarea.value.trim();
        const hasText = text.length > 0;
        const hasMedia = this.selectedMedia.length > 0;

        // Enabled if there is either text, at least one image, or at least one video
        if (hasText || hasMedia) {
            this.shareBtn.removeAttribute('disabled');
        } else {
            this.shareBtn.setAttribute('disabled', 'true');
        }
    }

    async handleFiles(files, type) {
        for (const file of files) {
            try {
                const dataUrl = await this.fileToBase64(file);
                this.selectedMedia.push({ type, dataUrl });
            } catch (err) {
                console.error("Error reading file:", err);
            }
        }
        this.renderPreviews();
        this.validate();
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    }

    renderPreviews() {
        if (this.selectedMedia.length === 0) {
            this.previewsContainer.innerHTML = '';
            this.previewsContainer.style.display = 'none';
            return;
        }

        this.previewsContainer.innerHTML = '';
        this.previewsContainer.style.display = 'grid';

        this.selectedMedia.forEach((media, index) => {
            const item = document.createElement('div');
            item.className = 'modal-preview-item';

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'modal-remove-preview-btn';
            removeBtn.innerHTML = '&times;';
            removeBtn.ariaLabel = 'Remove media';
            removeBtn.addEventListener('click', () => {
                this.selectedMedia.splice(index, 1);
                this.renderPreviews();
                this.validate();
            });

            item.appendChild(removeBtn);

            if (media.type === 'image') {
                const img = document.createElement('img');
                img.src = media.dataUrl;
                item.appendChild(img);
            } else if (media.type === 'video') {
                const vid = document.createElement('video');
                vid.src = media.dataUrl;
                vid.muted = true;
                vid.autoplay = false;
                vid.controls = false;
                item.appendChild(vid);
            }

            this.previewsContainer.appendChild(item);
        });
    }

    trapFocus(e) {
        const focusables = this.dialog.querySelectorAll('button, input, select, textarea');
        const firstFocusable = focusables[0];
        const lastFocusable = focusables[focusables.length - 1];

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    submitShare() {
        const text = this.textarea.value.trim();
        const category = this.categorySelect.value;
        const location = this.locationInput.value.trim();

        // Extract images and video
        const images = this.selectedMedia.filter(m => m.type === 'image').map(m => m.dataUrl);
        const video = this.selectedMedia.filter(m => m.type === 'video').map(m => m.dataUrl)[0] || "";

        // Double check validation
        if (!text && images.length === 0 && !video) {
            return;
        }

        if (typeof this.onShare === 'function') {
            this.onShare({
                description: text,
                category,
                images,
                video,
                location
            });
        }

        this.close();
    }
}

// Attach class to window
window.CreatePostModal = CreatePostModal;
