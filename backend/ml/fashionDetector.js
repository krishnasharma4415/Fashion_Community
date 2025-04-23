const tf = require('@tensorflow/tfjs');
const fashionKeywords = require('../models/fashion-keywords.json');
const { NlpManager } = require('node-nlp');

const nlpManager = new NlpManager({ languages: ['en'] });

(async function() {
  await initializeClassifier();
})();

async function initializeClassifier() {
  fashionKeywords.positive.forEach(keyword => {
    nlpManager.addDocument('en', keyword, 'fashion');
  });
  
  fashionKeywords.negative.forEach(keyword => {
    nlpManager.addDocument('en', keyword, 'non-fashion');
  });
  
  await nlpManager.train();
}

exports.validateText = async (text) => {
  const cleanedText = text.toLowerCase()
    .replace(/[^\w\s#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const hashtags = text.match(/#\w+/g) || [];
  const nonFashionHashtags = hashtags.filter(tag => {
    const cleanTag = tag.replace('#', '').toLowerCase();
    return fashionKeywords.negative_hashtags.includes(cleanTag);
  });
  
  if (nonFashionHashtags.length > 0) {
    return {
      isFashionRelated: false,
      confidence: 0.9,
      nonFashionTags: nonFashionHashtags
    };
  }
  
  const result = await nlpManager.process('en', cleanedText);
  
  const isFashion = result.intent === 'fashion' && result.score > 0.7;
  
  return {
    isFashionRelated: isFashion,
    confidence: result.score,
    analysis: result
  };
};

exports.validateImage = async (imageUrl) => {
  try {
    const model = await tf.loadLayersModel('file://./ml/models/fashion-detector/model.json');
    
    const image = await loadImage(imageUrl);
    const tensor = tf.browser.fromPixels(image).resizeBilinear([224, 224]).expandDims();
    
    const predictions = await model.predict(tensor).data();
    
    const topClasses = Array.from(predictions)
      .map((prob, i) => ({ probability: prob, className: fashionClasses[i] }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
    
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
    return { isFashionRelated: true, confidence: 0, error: true };
  }
};