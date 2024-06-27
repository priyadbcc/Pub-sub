import { PostManager } from "./post-model";
import { PostsView } from "./posts-view";

export class PostController {
  constructor(postView: PostsView, postManager: PostManager) {
    postManager.subscribe(postView);
    postManager.fetchPostsFromApi();
    postView.update(postManager);

    // Handle previous button click
    postView.prevButton?.addEventListener("click", () => {
      postManager.currentPostIndex--;
      postView.update(postManager);
      if (postView.commentsElement)
        postView.commentsElement.innerHTML = "Comments go here";
    });

    // Handle next button click
    postView.nextButton?.addEventListener("click", () => {
      postManager.currentPostIndex++;
      postView.update(postManager);
      if(postView.commentsElement)
      postView.commentsElement.innerHTML = "Comments go here";
    });
    
    postView.commentsButton?.addEventListener("click", () => {
      postManager
        .fetchCommentsForCurrentPost()
        .then(() => postView.update(postManager))
        .catch((error) => console.error("Error fetching comments:", error));
      const comments = postManager.getCommentsForCurrentPost();
      if (comments && postView.commentsElement) {
        const commentsHTML = comments
          .map((comment) => `<div>${comment.body}</div>`)
          .join("");
        postView.commentsElement.innerHTML = commentsHTML;
      } 
    });
    
  }
}
