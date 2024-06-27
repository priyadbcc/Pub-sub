import './style.css'
import { PostController } from "./post-controller";
import { PostManager } from "./post-model";
import { PostsView } from "./posts-view";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
  <section>
  <nav>
   <button>< previous</button>
   <h2>Post title</h2>
   <button>next ></button>
  </nav>
  <p class="post-desc"> Post description</p>
    </section>
      <section>
      <button> View Comments </button>
      <p class="comments">Comments of current post go here</p>
  </section>
  </div>
`;
const postView = new PostsView();
const postManager = new PostManager();

const postController = new PostController(postView, postManager);
postManager
  .fetchPostsFromApi()
  .then(() => postManager.fetchCommentsForCurrentPost())
  .then(() => postView.update(postManager))
  .catch((error) => console.error("Error initializing posts:", error));