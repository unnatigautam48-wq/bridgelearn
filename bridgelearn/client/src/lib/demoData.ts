export type Language = "english" | "hindi";
export type Level = "beginner" | "standard";

export const demoLesson = {
  id: "photosynthesis",
  title: "How plants make food",
  subject: "Biology · Grade 7",
  text: "Photosynthesis is the process plants use to make food. Green leaves contain chlorophyll, a pigment that captures energy from sunlight. Plants use this energy to combine water and carbon dioxide. The process makes glucose, which is food for the plant, and releases oxygen.",
};

export const explanations = {
  english: {
    beginner: "Plants make their own food using sunlight. Their green leaves take in water and carbon dioxide. This makes glucose for the plant and releases oxygen.",
    standard: "Photosynthesis converts light energy into chemical energy. Chlorophyll captures sunlight so the plant can combine water and carbon dioxide to produce glucose and release oxygen.",
  },
  hindi: {
    beginner: "पौधे सूरज की रोशनी से अपना खाना बनाते हैं। उनकी हरी पत्तियाँ पानी और कार्बन डाइऑक्साइड का उपयोग करती हैं। इससे पौधे के लिए ग्लूकोज़ बनता है और ऑक्सीजन बाहर निकलती है।",
    standard: "प्रकाश संश्लेषण वह प्रक्रिया है जिसमें पौधे प्रकाश ऊर्जा को रासायनिक ऊर्जा में बदलते हैं। क्लोरोफिल सूर्य के प्रकाश को पकड़ता है और पानी व कार्बन डाइऑक्साइड से ग्लूकोज़ बनता है।",
  },
};

export const sourceText = "Green leaves contain chlorophyll, a pigment that captures energy from sunlight.";

export const quizQuestions = [
  {
    question: "What does chlorophyll capture?",
    options: ["Energy from sunlight", "Only rainwater", "Sound from insects"],
    correctIndex: 0,
    concept: "sunlight",
  },
  {
    question: "Which gas is released during photosynthesis?",
    options: ["Carbon dioxide", "Oxygen", "Nitrogen"],
    correctIndex: 1,
    concept: "oxygen",
  },
  {
    question: "What food does the plant make?",
    options: ["Glucose", "Salt", "Protein powder"],
    correctIndex: 0,
    concept: "glucose",
  },
];

export function practiceForConcept(concept: string) {
  const activities: Record<string, string> = {
    sunlight: "Draw an arrow from the sun to a leaf and label it light energy.",
    oxygen: "Explain why oxygen is released when a plant makes food.",
    glucose: "Write one sentence explaining why glucose is useful to a plant.",
  };

  return activities[concept] ?? "Review the lesson once more and write the idea in your own words.";
}

export const demoAnswer = {
  english: "Photosynthesis is how a plant uses sunlight, water, and carbon dioxide to make glucose. Oxygen is released as a result.",
  hindi: "प्रकाश संश्लेषण में पौधा सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके ग्लूकोज़ बनाता है। इस प्रक्रिया में ऑक्सीजन निकलती है।",
};
