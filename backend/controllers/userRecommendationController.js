const userRecommendation = require('../ml/userRecommendation');

exports.getPeopleYouMayKnow = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    
    const recommendations = await userRecommendation.getPeopleYouMayKnow(userId, limit);
    
    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Error getting user recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};