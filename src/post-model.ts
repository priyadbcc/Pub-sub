import { ActualPublisher } from "./pub-sub";
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
export interface PostsModel {
  posts: Post[];
  currentPostIndex: number;
  currentPost: () => Post | undefined;
  status: string;
  setStatus: (status: string) => void;
  getCommentsForCurrentPost: () => Comment[] | undefined; // Method to get comments for current post
  fetchCommentsForCurrentPost: () => Promise<void>; // Method to fetch comments for current post
}

export interface CommentsModel {
  commentStatus: (status: string) => void;
  commentsMap: Map<number, Comment[]>;
  insertCommentsForPost: (comments: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}


export class PostManager extends ActualPublisher  implements PostsModel  {
 
  public currentPostIndex: number = 0;
  public posts: Post[] = [];
  public status: string = "pending";
  private commentsManager: CommentsManager = new CommentsManager(); // Initialize CommentsManager

  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }

 

  async fetchPostsFromApi(): Promise<void> {
    this.setStatus("pending");
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      this.posts = data;
      this.setStatus("success");
      this.updateSubscribers();
    } catch (error) {
      console.error("Error fetching posts:");
      this.setStatus("error");
      throw error;
    }
  }

  setStatus(status: string): void {
    this.status = status;
    this.updateSubscribers();
  }

  getCommentsForCurrentPost(): Comment[] | undefined {
    const currentPost = this.currentPost();
    if (currentPost) {
      return this.commentsManager.getCommentsForPost(currentPost.id);
    }
    return undefined;
  }

  async fetchCommentsForCurrentPost(): Promise<void> {
    const currentPost = this.currentPost();
    if (currentPost) {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/comments?postId=${currentPost.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        this.commentsManager.insertCommentsForPost(data, currentPost.id);
        this.updateSubscribers();
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }
    }
  }
  async updateCurrentPostIndex(index: number): Promise<void> {
    if (index >= 0 && index < this.posts.length) {
      this.currentPostIndex = index;
      await this.fetchCommentsForCurrentPost();
    }
  }
}

export class CommentsManager implements CommentsModel {
  public status: string = "pending";
  commentStatus(status: string): void {
    this.status = status;

  }
  commentsMap: Map<number, Comment[]> = new Map();
  insertCommentsForPost(comments: Comment[], postId: number): void {
    this.commentsMap.set(postId, comments);
  }
  getCommentsForPost(postId: number): Comment[] | undefined {
    return this.commentsMap.get(postId);
  }
}
