const { NOTIFICATION_SERVICE } = require("../config");
const { PostRepository } = require("../database");
const { RPCRequest } = require("../utils");

const cloudinary = require("../utils/cloudinary");

class PostService {
  constructor() {
    this.repository = new PostRepository();
  }

  async createPost(postData, _id) {
    const { des, media } = postData;
    const result = await cloudinary.uploader.upload(media, { folder: "posts" });

    const newPost = await this.repository.createPost(
      { des, media: { public_id: result.public_id, url: result.secure_url } },
      _id
    );
    return newPost;
  }

  async getPosts({ page }) {
    const posts = await this.repository.getPosts(page);
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const userIds = posts.map((post) => post.userId);
    const users = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: userIds,
    });

    const commentsPromises = posts.map((post) =>
      this.repository.getCommentsCountWithId(post._id)
    );

    const commentsArray = await Promise.all(commentsPromises);

    const combinedData = posts.map((post, index) => {
      const user = users.find(
        (user) => user._id.toString() === post.userId.toString()
      );
      const totalComments = commentsArray[index];

      return { ...post, user, totalComments };
    });

    return combinedData;
  }

  async handleLikePost({ post_id, user_id, state }) {
    if (state === "like") {
      return await this.repository.LikePost(post_id, user_id);
    } else {
      const data = await this.repository.dislikePost(post_id, user_id);
      const payload = {
        event: "REMOVE_NOTFICATION",
        data: { sender: user_id, postId: post_id, type: "like" },
      };
      return { data, payload };
    }
  }

  async commentPost({ postId, text }, userId) {
    const data = await this.repository.commentPost(postId, userId, text);

    const post = await this.repository.getPostWithId(postId);
    const payload = {
      event: "NEW_NOTIFICATION",
      data: {
        type: "comment",
        sender: userId,
        recipient: post.userId,
        content: `commented: ${data.text}`,
        contentDetails: {
          postId: postId,
          commentId: data._id,
        },
      },
    };
    return { data, payload };
  }

  async getComments(_id) {
    const comments = await this.repository.getComments(_id);
    const userIds = comments.map((comment) => comment.userId);
    const users = await RPCRequest("USERS_RPC", {
      type: "GET_USERS_WITH_ID",
      data: userIds,
    });
    comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const combinedData = comments.map((comment) => {
      const user = users.find(
        (user) => user._id.toString() === comment.userId.toString()
      );
      return { ...comment, user };
    });

    return combinedData;
  }

  async handleLikeComment({ commentId, state }, userId) {
    if (state === "like") {
      return await this.repository.LikeComment(commentId, userId);
    } else {
      return await this.repository.dislikeComment(commentId, userId);
    }
  }

  async reportPost({ userName, reason, postId }) {
    return await this.repository.reportPost(userName, reason, postId);
  }

  async deleteComment({ commentId }, userId) {
    const data = await this.repository.deleteComment(commentId);
    const payload = {
      event: "REMOVE_NOTFICATION",
      data: { sender: userId, commentId, type: "comment" },
    };
    return { data, payload };
  }

  // RPC Response
  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "GET_POSTS":
        return this.repository.getAllPosts(data);
        break;
      case "GET_USER_POSTS":
        return this.repository.getPostByUserId(data);
        break;
      case "HANDLE_BLOCK":
        return this.repository.handleBlock(data);
        break;
      case "GET_POST_WITH_ID":
        return this.repository.getPostsWithId(data);
        break;
      case "GET_COMMENTS_WITH_ID":
        return this.repository.getCommentsWithId(data);
      default:
        break;
    }
  }
}

module.exports = PostService;
