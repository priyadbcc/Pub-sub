import './style.css'
import { PostController } from "./post-controller";
import { PostManager } from "./post-model";
import { PostsView } from "./posts-view";
import { CommentsManager } from './post-model';
const postView = new PostsView();
const postManager = new PostManager();

const commentManager = new CommentsManager();
const postController = new PostController(
  postView,
  postManager,commentManager

);