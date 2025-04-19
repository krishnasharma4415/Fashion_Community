// ml/fashionDetector.js
const tf = require('@tensorflow/tfjs');
const fashionKeywords = require('../models/fashion-keywords.json');
const { NlpManager } = require('node-nlp');

// Initialize NLP manager for text classification
const nlpManager = new NlpManager({ languages: ['en'] });

// Initialize manager
(async function() {
  // Train or load fashion classifier model
  await initializeClassifier();
})();

async function initializeClassifier() {
  // Load fashion keywords and train classifier
  fashionKeywords.positive.forEach(keyword => {
    nlpManager.addDocument('en', keyword, 'fashion');
  });
  
  fashionKeywords.negative.forEach(keyword => {
    nlpManager.addDocument('en', keyword, 'non-fashion');
  });
  
  await nlpManager.train();
}

// Validate text for fashion relevance
exports.validateText = async (text) => {
  // Remove common filler words
  const cleanedText = text.toLowerCase()
    .replace(/[^\w\s#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Check hashtags for non-fashion topics
  const hashtags = text.match(/#\w+/g) || [];
  const nonFashionHashtags = hashtags.filter(tag => {
    const cleanTag = tag.replace('#', '').toLowerCase();
    return fashionKeywords.negative_hashtags.includes(cleanTag);
  });
  
  // If obvious non-fashion hashtags are present
  if (nonFashionHashtags.length > 0) {
    return {
      isFashionRelated: false,
      confidence: 0.9,
      nonFashionTags: nonFashionHashtags
    };
  }
  
  // Perform NLP classification
  const result = await nlpManager.process('en', cleanedText);
  
  // Check if fashion-related with reasonable confidence
  const isFashion = result.intent === 'fashion' && result.score > 0.7;
  
  return {
    isFashionRelated: isFashion,
    confidence: result.score,
    analysis: result
  };
};

// Validate image for fashion content
exports.validateImage = async (imageUrl) => {
  try {
    // Load pre-trained model (MobileNet or custom fashion detector)
    const model = await tf.loadLayersModel('file://./ml/models/fashion-detector/model.json');
    
    // Load and preprocess image
    const image = await loadImage(imageUrl);
    const tensor = tf.browser.fromPixels(image).resizeBilinear([224, 224]).expandDims();
    
    // Run prediction
    const predictions = await model.predict(tensor).data();
    
    // Get top prediction classes
    const topClasses = Array.from(predictions)
      .map((prob, i) => ({ probability: prob, className: fashionClasses[i] }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
    
    // Check if any of the top 3 classes are fashion-related
    const fashionDetected = topClasses.some(item => 
      fashionKeywords.image_classes.includes(item.className)
    );
    
    return {
      isFashionRelated: fashionDetected,
      confidence: topClasses[0].probability,
      detectedClasses: topClasses
    };
  } catch (error) {
    console.error('Image validation error:', error);
    // Default to allowing content if model fails
    return { isFashionRelated: true, confidence: 0, error: true };
  }
};