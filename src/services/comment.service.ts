import { Data } from "../types";

class CommentService {
  private _data: Data;

  constructor(data: Data) {
    this._data = data;
  }

  getCommentById(commentId: string) {
    return this._data.comments.find(
      (comment) => comment.commentId === commentId,
    );
  }

  getCommentsByPostId(postId: string) {
    return this._data.comments.filter((comment) => comment.postId === postId);
  }

  getCommentsByUserId(userId: string) {
    return this._data.comments.filter((comment) => comment.userId === userId);
  }

  add(postId: string, userId: string, content: string) {
    const newComment = {
      commentId: `${this._data.comments.length + 1}`,
      postId,
      userId,
      content,
      createdAt: new Date().getTime(),
    };

    this._data.comments.push(newComment);
    return newComment;
  }

  remove(commentId: string) {
    const commentIndex = this._data.comments.findIndex(
      (comment) => comment.commentId === commentId,
    );

    if (commentIndex > -1) {
      this._data.comments.splice(commentIndex, 1);
      return true;
    }

    return false;
  }

  update(commentId: string, content: string) {
    const comment = this.getCommentById(commentId);
    if (comment) {
      comment.content = content;
      return comment;
    }
    return null;
  }
}

export default CommentService;
