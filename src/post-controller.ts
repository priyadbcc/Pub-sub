import { CommentsManager, PostManager } from "./post-model";
import { PostsView } from "./posts-view";

export class PostController {
  commentManager: CommentsManager;
  postManager: PostManager;
  postView:PostsView
  constructor(postView: PostsView, postManager: PostManager, commentManager: CommentsManager) {
    this.postManager = postManager;
    this.commentManager = commentManager;
    this.postView = postView;
    postManager.subscribe(postView);
     commentManager.subscribe(postView);
    this.fetchPostsFromApi();
    postView.update(postManager);
  
    postView.prevButton?.addEventListener("click", () => {
      postManager.currentPostIndex--;
      postView.update(postManager);
        postView.showViewCommentsButton();
    });

    postView.nextButton?.addEventListener("click", () => {
      postManager.currentPostIndex++;
     
      postView.update(postManager);
           postView.showViewCommentsButton();
    });
  
  
   
    postView.commentsButton?.addEventListener("click", () => {
      this.fetchCommentsForCurrentPost()
        .then(() => postView.update(commentManager))
        .catch((error) => console.error("Error fetching comments:", error));
    });
  }
  async fetchPostsFromApi(): Promise<void> {

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      this.postManager.posts = data;
      this.postManager.setStatus("success");
      
    } 
  
  async fetchCommentsForCurrentPost(): Promise<void> {
    const currentPost = this.postManager.currentPost();
    console.log(currentPost)
    if (currentPost) {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${currentPost.id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      console.log(data);
      this.commentManager.insertCommentsForPost(data, currentPost.id);
       this.commentManager.commentStatus("success");
    }
  }
}
