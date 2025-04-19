// backend/ml/commentFilter.js
const natural = require('natural');
const toxicity = require('@tensorflow-models/toxicity');

let toxicityModel;
const MIN_CONFIDENCE = 0.85;
const CATEGORIES = ['identity_attack', 'insult', 'obscene', 'severe_toxicity', 'sexual_explicit', 'threat', 'toxicity'];

// List of common problematic words (simplified version)
const TOXIC_WORDS = [
  // Obscene/profane words (simplified for demonstration)
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'cunt', 'dick', 'pussy',
  // Insults
  'idiot', 'stupid', 'dumb', 'moron', 'retard', 'loser', 
  // Threats
  'kill', 'die', 'murder', 'hurt',
  // Aggression
  'getlost', 'hate', 'screw', 'stfu',
  // Derogatory terms (partial list)
  'slut', 'whore'
];

// Load toxicity model
async function loadToxicityModel() {
  try {
    if (!toxicityModel) {
      // The threshold is the minimum prediction confidence
      toxicityModel = await toxicity.load(MIN_CONFIDENCE, CATEGORIES);
      console.log('Toxicity model loaded successfully');
    }
    return true;
  } catch (error) {
    console.error('Error loading toxicity model:', error);
    return false;
  }
}

// Rule-based toxicity detection (fallback)
function isToxicRuleBased(text) {
  if (!text) return { isToxic: false, confidence: 1.0, categories: [] };
  
  // Clean the text and remove spaces to catch combined words
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  const noSpaceText = normalizedText.replace(/\s+/g, '');
  
  // Check for toxic words
  const foundToxicWords = TOXIC_WORDS.filter(word => 
    normalizedText.includes(word) || noSpaceText.includes(word)
  );
  
  if (foundToxicWords.length > 0) {
    return {
      isToxic: true,
      confidence: 0.9,
      categories: ['toxicity'],
      detectedWords: foundToxicWords
    };
  }
  
  // Check common obfuscation patterns (like f*ck, s**t)
  const obfuscationPattern = /(\w)[*$@#!?]+(\w)?/g;
  const possibleObfuscations = normalizedText.match(obfuscationPattern);
  
  if (possibleObfuscations && possibleObfuscations.length > 0) {
    // Check if these might be obfuscated toxic words
    // This is a simplistic approach - real implementation would be more sophisticated
    if (possibleObfuscations.some(word => 
      word.startsWith('f') || word.startsWith('s') || word.startsWith('b')
    )) {
      return {
        isToxic: true,
        confidence: 0.7,
        categories: ['potential_obscenity'],
        detectedPatterns: possibleObfuscations
      };
    }
  }
  
  return {
    isToxic: false,
    confidence: 0.8,
    categories: []
  };
}

// ML-based toxicity detection
async function isToxicML(text) {
  try {
    if (!text || text.trim().length < 1) {
      return { isToxic: false, confidence: 1.0, categories: [] };
    }
    
    const predictions = await toxicityModel.classify(text);
    
    // Check if any category exceeds threshold
    const toxicCategories = predictions
      .filter(prediction => prediction.results[0].match)
      .map(prediction => ({
        category: prediction.label,
        confidence: prediction.results[0].probabilities[1]
      }));
    
    return {
      isToxic: toxicCategories.length > 0,
      categories: toxicCategories.map(tc => tc.category),
      confidence: toxicCategories.length > 0 ? 
        Math.max(...toxicCategories.map(tc => tc.confidence)) : 0.0
    };
  } catch (error) {
    console.error('Error with toxicity model prediction:', error);
    // Fallback to rule-based approach
    return isToxicRuleBased(text);
  }
}

// Main function to check comment toxicity
exports.isToxicComment = async function(text) {
  // First try to use ML model
  const modelLoaded = await loadToxicityModel();
  
  if (modelLoaded && toxicityModel) {
    return await isToxicML(text);
  } else {
    // Fallback to rule-based approach
    return isToxicRuleBased(text);
  }
};

// Export for testing
exports.testRuleBased = isToxicRuleBased;