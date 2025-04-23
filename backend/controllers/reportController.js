const Report = require('../models/Report');

exports.reportPost = async (req, res) => {
  const { reason, details } = req.body;
  const { postId } = req.params;
  const reporter = req.user.id;

  await Report.create({
    type: 'post',
    target: postId,
    reporter,
    reason,
    details,
  });

  res.status(201).json({ success: true, message: 'Post reported. Thank you for helping keep the community safe.' });
};

exports.reportComment = async (req, res) => {
  const { reason, details } = req.body;
  const { commentId } = req.params;
  const reporter = req.user.id;

  await Report.create({
    type: 'comment',
    target: commentId,
    reporter,
    reason,
    details,
  });

  res.status(201).json({ success: true, message: 'Comment reported. Thank you for your feedback.' });
};

exports.reportUser = async (req, res) => {
  const { reason, details } = req.body;
  const { userId } = req.params;
  const reporter = req.user.id;

  await Report.create({
    type: 'user',
    target: userId,
    reporter,
    reason,
    details,
  });

  res.status(201).json({ success: true, message: 'User reported. We will review your report.' });
};