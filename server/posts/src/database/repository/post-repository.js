const { PostModel, CommentModel } = require("../models");
const { findByIdAndDelete } = require("../models/Post");

class PostRepository {
  async createPost({ des, media }, _id) {
    const post = new PostModel({
      userId: _id,
      des,
      media,
    });
    const postData = await post.save();
    return postData;
  }

  async getPostByUserId(user_id) {

    return await PostModel.find({ userId: user_id }).sort({ createdAt: -1 });

  }

  async getPosts(page) {
        const startIndex = (page - 1) * 5;

    return await PostModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(5)
      .lean();
  }

  async getCommentsCountWithId(postId) {
    return await CommentModel.countDocuments({ postId });
  }

  async getAllPosts({ page, perPage }) {
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(perPage)
      .lean();
    const totalCount = await PostModel.countDocuments();

    return {
      posts,
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
    };
  }

  async LikePost(post_id, user_id) {
    const data= await PostModel.findByIdAndUpdate(
      post_id,
      { $addToSet: { likes: user_id } },
      { new: true }
    );
    const post = await PostModel.findById(post_id)
     const payload = {
       event: "NEW_NOTIFICATION",
       data: {
         type: "like",
         sender: user_id,
         recipient: post.userId,
         content: `liked your photo.`,
         contentDetails: {
           postId: post_id,
         },
       },
     };
     return {data,payload}
  }
  async dislikePost(post_id, user_id) {
    return await PostModel.findByIdAndUpdate(post_id, {
      $pull: { likes: user_id },
    });
  }

  async commentPost(postId, userId, text) {
    const comment = new CommentModel({
      userId,
      postId,
      text,
    });
    const commentData = await comment.save();
    return commentData;
  }

  async getComments(_id) {
    return await CommentModel.find({ postId: _id });
  }

  async LikeComment(commentId, userId) {
    return await CommentModel.findByIdAndUpdate(
      commentId,
      { $push: { likes: userId } },
      { new: true }
    );
  }
  async dislikeComment(commentId, userId) {
    return await CommentModel.findByIdAndUpdate(
      commentId,
      { $pull: { likes: userId } },
      { new: true }
    );
  }

  async handleBlock({ postId }) {
    const post = await PostModel.findOne({ _id: postId });
    if (post.isActive) {
      return await PostModel.findOneAndUpdate(
        { _id: postId },
        { isActive: false },
        { new: true }
      );
    } else {
      return await PostModel.findOneAndUpdate(
        { _id: postId },
        { isActive: true },
        { new: true }
      );
    }
  }

  async getPostsWithId(postIds) {
    return await PostModel.find({ _id: { $in: postIds } }).lean();
  }
  async getCommentsWithId(commentIds){
    return await CommentModel.find({_id:{$in:commentIds}}).lean();
  }

  async reportPost(userName, reason, postId) {
    return await PostModel.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { reported: { reason, userName } } },
      { new: true }
    );
  }

  async deletePost({ postId }) {
    return await PostModel.findByIdAndDelete({ _id: postId },{new:true});
  }
  async editPost ({postId,des}){
    return await PostModel.findOneAndUpdate({_id:postId},{des:des},{new:true})
  }

  async deleteComment(commentId){
    return await CommentModel.findByIdAndDelete(commentId)
  }
  async getPostWithId(postId){
    return await PostModel.findById(postId)
  }
}

module.exports = PostRepository;

