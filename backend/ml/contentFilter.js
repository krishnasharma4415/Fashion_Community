const tf = require('@tensorflow/tfjs');
const natural = require('natural');
const fashionWordList = require('../utils/fashionKeywords');

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const MODEL_PATH = './ml/models/fashion-classifier';
let model;
let fashionClassifier;

const FASHION_CATEGORIES = [
  'apparel', 'accessories', 'footwear', 'beauty', 'style', 'trends',
  'outfit', 'design', 'brands', 'runway', 'collection', 'seasonal'
];

async function loadModel() {
  try {
    model = await tf.loadLayersModel(`file://${MODEL_PATH}/model.json`);
    console.log('Fashion content filter model loaded');
    return true;
  } catch (error) {
    console.error('Error loading fashion model:', error);
    console.log('Using rule-based fashion classification as fallback');
    return false;
  }
}

function isRelatedToFashionRules(text, tags) {
  const normalizedText = text.toLowerCase();
  const words = tokenizer.tokenize(normalizedText);
  const stemmedWords = words.map(word => stemmer.stem(word));
  
  if (tags && tags.length > 0) {
    const normalizedTags = tags.map(tag => tag.toLowerCase().replace('#', ''));
    
    const fashionTagCount = normalizedTags.filter(tag => 
      fashionWordList.some(keyword => tag.includes(keyword)) || 
      FASHION_CATEGORIES.some(category => tag.includes(category))
    ).length;
    
    if (fashionTagCount / normalizedTags.length >= 0.4) {
      return {
        isFashionRelated: true,
        confidence: 0.7 + (0.3 * (fashionTagCount / normalizedTags.length)),
        category: detectPrimaryCategory(normalizedTags, normalizedText)
      };
    }
    
    const nonFashionTags = ['bored', 'noclass', 'politics', 'food', 'gaming'];
    const hasNonFashionTags = normalizedTags.some(tag => 
      nonFashionTags.some(nft => tag.includes(nft))
    );
    
    if (hasNonFashionTags) {
      return {
        isFashionRelated: false,
        confidence: 0.8,
        category: null
      };
    }
  }
  
  // Check text content
  const fashionWordCount = stemmedWords.filter(word => 
    fashionWordList.some(keyword => stemmer.stem(keyword) === word)
  ).length;
  
  // If more than 15% of words are fashion-related, approve
  if (fashionWordCount / stemmedWords.length >= 0.15) {
    return {
      isFashionRelated: true,
      confidence: 0.6 + (0.4 * (fashionWordCount / stemmedWords.length)),
      category: detectPrimaryCategory([], normalizedText)
    };
  }
  
  return {
    isFashionRelated: false,
    confidence: 0.6,
    category: null
  };
}

// Helper to detect primary fashion category
function detectPrimaryCategory(tags, text) {
  const combinedText = tags.join(' ') + ' ' + text;
  
  // Count mentions of each category
  const categoryCounts = FASHION_CATEGORIES.map(category => ({
    category,
    count: (combinedText.match(new RegExp(category, 'gi')) || []).length
  })).filter(item => item.count > 0);
  
  if (categoryCounts.length === 0) return 'general';
  
  // Return highest mentioned category
  categoryCounts.sort((a, b) => b.count - a.count);
  return categoryCounts[0].category;
}

// ML-based classification (when model is available)
async function isRelatedToFashionML(text, tags) {
  try {
    // Prepare input for model
    const combined = text + ' ' + tags.join(' ');
    
    // Process with model (implementation depends on your trained model)
    const prediction = await model.predict(tf.tensor([combined]));
    const result = await prediction.data();
    
    return {
      isFashionRelated: result[0] > 0.5,
      confidence: result[0],
      category: result[0] > 0.5 ? detectPrimaryCategory(tags, text) : null
    };
  } catch (error) {
    console.error('Error using ML model:', error);
    // Fallback to rule-based
    return isRelatedToFashionRules(text, tags);
  }
}

// Main function to check if content is fashion-related
exports.isFashionRelated = async function(caption, tags) {
  // Initialize model if not loaded
  if (!model && !fashionClassifier) {
    const modelLoaded = await loadModel();
    fashionClassifier = modelLoaded;
  }
  
  // Use ML model if available, otherwise use rule-based
  if (model && fashionClassifier) {
    return isRelatedToFashionML(caption, tags);
  } else {
    return isRelatedToFashionRules(caption, tags);
  }
};

// Export for testing
exports.testFashionRules = isRelatedToFashionRules;
