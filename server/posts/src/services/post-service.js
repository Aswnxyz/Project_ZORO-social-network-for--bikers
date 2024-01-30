const {
  NOTIFICATION_SERVICE,
  ACCESS_KEY,
  BUCKET_REGION,
  SECRET_ACCESS_KEY,
  BUCKET_NAME,
} = require("../config");
const { PostRepository } = require("../database");
const { RPCRequest } = require("../utils");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// const command = new GetObjectCommand(getObjectParams);
// const url = await getSignedUrl(client, command, { expiresIn: 3600 });

const crypto = require("crypto");

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

const cloudinary = require("../utils/cloudinary");

class PostService {
  constructor() {
    this.repository = new PostRepository();
  }

  async createPost(req, _id) {
    const imageName = randomImageName();
    const params = {
      Bucket: BUCKET_NAME,
      Key: `posts/${imageName}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    // return []
    const { des } = req.body;
    // const result = await cloudinary.uploader.upload(media, { folder: "posts" });

    // const newPost = await this.repository.createPost(
    //   { des, media: { public_id: result.public_id, url: result.secure_url } },
    //   _id
    // );
    const newPostData = { des, media: imageName, userId: _id };

    // Check if communityId is present in req.body
    if (req.body.communityId) {
      newPostData.isCommunityPost = true;
      newPostData.communityId = req.body.communityId;
    }

    const newPost = await this.repository.createPost(newPostData);
    return newPost;
  }

  async getPosts({ page }) {
    const posts = await this.repository.getPosts(page);
    const communityPosts = posts.filter((post) => post.isCommunityPost);
    if (communityPosts.length > 0) {
      // Extract communityIds from community posts
      const communityIds = communityPosts.map((post) => post.communityId);

      // Fetch community data based on communityIds
      const communities = await RPCRequest("COMMUNITY_RPC", {
        type: "GET_COMMUNITIES_WITH_ID",
        data: communityIds,
      });

      // Combine community data with community posts
      posts.forEach((post) => {
        const community = communities.find(
          (comm) => comm?._id.toString() === post?.communityId?.toString()
        );
        post.community = community; // Assuming you want to add community data to each community post
      });
    }

    for (const post of posts) {
      const getObjectParams = {
        Bucket: BUCKET_NAME,
        Key: `posts/${post.media}`,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      post.mediaUrl = url;
    }
    // await posts.save()
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
        data: {
          sender: user_id,
          postId: post_id,
          recipient: data.userId,
          type: "like",
        },
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

  async getUserPosts(data) {
    const posts = await this.repository.getPostByUserId(data);

    for (const post of posts) {
      const getObjectParams = {
        Bucket: BUCKET_NAME,
        Key: `posts/${post.media}`,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      post.mediaUrl = url;
    }
    return posts;
  }
  async getPostsWithId(data) {
    const posts = await this.repository.getPostsWithId(data);

    for (const post of posts) {
      const getObjectParams = {
        Bucket: BUCKET_NAME,
        Key: `posts/${post.media}`,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      post.mediaUrl = url;
    }
    return posts;
  }

  async getCommuntiyPosts(data) {
    const posts = await this.repository.getCommunityPostsById(data);

    for (const post of posts) {
      const getObjectParams = {
        Bucket: BUCKET_NAME,
        Key: `posts/${post.media}`,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      post.mediaUrl = url;
    }
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

  async getAdminPosts(data) {
    const { posts, totalCount, totalPages } = await this.repository.getAllPosts(
      data
    );

    for (const post of posts) {
      const getObjectParams = {
        Bucket: BUCKET_NAME,
        Key: `posts/${post.media}`,
      };

      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 300 });
      post.mediaUrl = url;
    }
    return { posts, totalCount, totalPages };
  }

  
  // RPC Response
  async serveRPCRequest(payload) {
    const { type, data } = payload;
    switch (type) {
      case "GET_POSTS":
        return this.getAdminPosts(data);
        break;
      case "GET_USER_POSTS":
        return this.getUserPosts(data);
        break;
      case "HANDLE_BLOCK":
        return this.repository.handleBlock(data);
        break;
      case "GET_POST_WITH_ID":
        return this.getPostsWithId(data);
        break;
      case "GET_COMMENTS_WITH_ID":
        return this.repository.getCommentsWithId(data);
        break;
      case "GET_COMMUNITY_POSTS_BY_ID":
        return this.getCommuntiyPosts(data);
      default:
        break;
    }
  }
}

module.exports = PostService;
