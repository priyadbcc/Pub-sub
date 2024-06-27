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

  currentPostIndex: number;
  currentPost: () => Post | undefined;
  status: string;
  setStatus: (status: string) => void;
}

export interface CommentsModel {
  commentStatus: (status: string) => void;
  commentsMap: Map<number, Comment[]>;
  insertCommentsForPost: (comments: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}

export class PostManager extends ActualPublisher implements PostsModel {
  public posts: Post[] = [];
  public status: string = "pending";
  private commentsManager: CommentsManager = new CommentsManager(); // Initialize CommentsManager

  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
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
}

export class CommentsManager extends ActualPublisher implements CommentsModel {
  public status: string = "pending";
  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }
  commentStatus(status: string): void {
    this.status = status;
  }
  commentsMap: Map<number, Comment[]> = new Map();
  insertCommentsForPost(comments: Comment[], postId: number): void {
    this.commentsMap.set(postId, comments);
    console.log(this.commentsMap)
  
  }
  getCommentsForPost(postId: number): Comment[] | undefined {
    return this.commentsMap.get(postId);
  }
  
}
