import "./style.css";
import "./posts.css";

import { PostManager } from "./post-model";
import { Publisher,Subscriber } from "./pub-sub";

export class PostsView implements Subscriber {
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  statusElement: HTMLDivElement | null = null;
  commentsElement: HTMLParagraphElement | null = null;
  commentsButton: HTMLButtonElement | null = null;
  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
  <section>
  <nav>
    <button data-testId="prevButton">Previous</button>
    <h2 data-testId="postTitle">Post title</h2>
    <button data-testId="nextButton">Next</button>
  </nav>
  <article data-testId="postDesc" class="post-desc">Post Description</article>
  <div data-testId="status" class="status">Loading...</div>
  <p data-testId="comments" class="comments">Comments of current post go here</p>
  </section>
  <section class="comment-section">
  <button data-testId="comments-button">View Comments </button>
 <div class="comment-container"></div> <!-- Container for comments -->
  </section>
  </div>
`;

    this.postDescription = document.querySelector('[data-testId="postDesc"]');
    this.postTitleElement = document.querySelector('[data-testId="postTitle"]');
    this.prevButton = document.querySelector('[data-testId="prevButton"]');
    this.nextButton = document.querySelector('[data-testId="nextButton"]');
    this.statusElement = document.querySelector('[data-testId="status"]');
    this.commentsElement = document.querySelector('[data-testId="comments"]');
    this.commentsButton = document.querySelector(
      '[data-testId="comments-button"]'
    );
    console.assert(!!this.postDescription);
    console.assert(!!this.postTitleElement);
    console.assert(!!this.prevButton);
    console.assert(!!this.nextButton);
    console.assert(!!this.statusElement);
    console.assert(!!this.commentsElement);
    console.assert(!!this.commentsButton);
  }

  update(manager: Publisher): void {
    if (manager instanceof PostManager) {
      const post = manager.currentPost();
      if (this.postTitleElement) {
        this.postTitleElement.textContent = post?.title ?? "title is missing";
      }

      if (this.postDescription) {
        this.postDescription.textContent = post?.body ?? "body is missing";
      }
      if (this.prevButton) {
        this.prevButton.disabled = manager.currentPostIndex === 0;
      }
      if (this.nextButton) {
        this.nextButton.disabled =
          manager.currentPostIndex === manager.posts.length - 1;
      }
      if (this.statusElement) {
        switch (manager.status) {
          case "pending":
            this.statusElement.textContent = "Loading...";
            break;
          case "success":
            this.statusElement.textContent = "Posts loaded successfully.";
            break;
          case "error":
            this.statusElement.textContent =
              "Failed to load posts. Please try again later.";
            break;
        }
      }
        if (this.commentsElement) {
          const comments = manager.getCommentsForCurrentPost();
          if (comments && comments.length > 0) {
            const commentsHTML = comments
              .map((comment) => `<div>${comment.body}</div>`)
              .join("");
            this.commentsElement.innerHTML = commentsHTML;
            if (this.commentsButton) {
              this.commentsButton.style.display = "none";
            }
          } else {
            this.commentsElement.innerHTML = "No comments available.";
            if (this.commentsButton) {
              this.commentsButton.style.display = "block";
            }
          }
        }
     
    }
  }
}
