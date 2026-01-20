const WORDS = [
    // Short A words
    { word: "hat", emoji: "🎩", missingIndex: 1, distractors: ["E", "I", "O"] },
    { word: "cat", emoji: "🐱", missingIndex: 0, distractors: ["B", "H", "R"] },
    { word: "bat", emoji: "🦇", missingIndex: 1, distractors: ["E", "I", "O"] },
    { word: "rat", emoji: "🐀", missingIndex: 0, distractors: ["B", "C", "H"] },
    { word: "map", emoji: "🗺️", missingIndex: 2, distractors: ["D", "N", "T"] },
    { word: "pan", emoji: "🍳", missingIndex: 1, distractors: ["E", "I", "O"] },
    { word: "fan", emoji: "🪭", missingIndex: 1, distractors: ["E", "I", "U"] },
    { word: "can", emoji: "🥫", missingIndex: 0, distractors: ["F", "M", "R"] },
    { word: "ham", emoji: "🍖", missingIndex: 0, distractors: ["J", "R", "Y"] },
    { word: "jam", emoji: "🫙", missingIndex: 0, distractors: ["H", "R", "Y"] },
    { word: "van", emoji: "🚐", missingIndex: 1, distractors: ["E", "I", "O"] },
    { word: "ant", emoji: "🐜", missingIndex: 0, distractors: ["E", "I", "U"] },

    // Short E words
    { word: "bed", emoji: "🛏️", missingIndex: 0, distractors: ["F", "R", "W"] },
    { word: "hen", emoji: "🐔", missingIndex: 1, distractors: ["A", "I", "O"] },
    { word: "pen", emoji: "🖊️", missingIndex: 0, distractors: ["D", "H", "T"] },
    { word: "net", emoji: "🥅", missingIndex: 1, distractors: ["A", "I", "O"] },
    { word: "jet", emoji: "✈️", missingIndex: 2, distractors: ["G", "N", "P"] },
    { word: "wet", emoji: "💧", missingIndex: 0, distractors: ["B", "G", "P"] },
    { word: "leg", emoji: "🦵", missingIndex: 0, distractors: ["B", "K", "P"] },
    { word: "red", emoji: "🔴", missingIndex: 1, distractors: ["A", "I", "O"] },
    { word: "web", emoji: "🕸️", missingIndex: 2, distractors: ["D", "G", "T"] },
    { word: "egg", emoji: "🥚", missingIndex: 0, distractors: ["A", "I", "O"] },

    // Short I words
    { word: "pig", emoji: "🐷", missingIndex: 1, distractors: ["A", "E", "O"] },
    { word: "fin", emoji: "🦈", missingIndex: 2, distractors: ["G", "P", "T"] },
    { word: "bin", emoji: "🗑️", missingIndex: 0, distractors: ["F", "P", "W"] },
    { word: "pin", emoji: "📌", missingIndex: 0, distractors: ["B", "F", "W"] },
    { word: "win", emoji: "🏆", missingIndex: 0, distractors: ["B", "F", "P"] },
    { word: "hit", emoji: "👊", missingIndex: 1, distractors: ["A", "O", "U"] },
    { word: "sit", emoji: "🪑", missingIndex: 0, distractors: ["B", "F", "H"] },
    { word: "zip", emoji: "🤐", missingIndex: 0, distractors: ["D", "L", "R"] },
    { word: "rib", emoji: "🦴", missingIndex: 0, distractors: ["B", "F", "W"] },
    { word: "bib", emoji: "👶", missingIndex: 0, distractors: ["D", "R", "W"] },

    // Short O words
    { word: "dog", emoji: "🐕", missingIndex: 1, distractors: ["A", "I", "U"] },
    { word: "log", emoji: "🪵", missingIndex: 1, distractors: ["A", "E", "U"] },
    { word: "fog", emoji: "🌫️", missingIndex: 1, distractors: ["A", "I", "U"] },
    { word: "hot", emoji: "🔥", missingIndex: 1, distractors: ["A", "I", "U"] },
    { word: "pot", emoji: "🪴", missingIndex: 1, distractors: ["A", "E", "I"] },
    { word: "dot", emoji: "⚫", missingIndex: 0, distractors: ["G", "H", "P"] },
    { word: "cot", emoji: "🛏️", missingIndex: 0, distractors: ["D", "G", "P"] },
    { word: "fox", emoji: "🦊", missingIndex: 2, distractors: ["G", "P", "T"] },
    { word: "box", emoji: "📦", missingIndex: 0, distractors: ["F", "L", "S"] },
    { word: "top", emoji: "🔝", missingIndex: 0, distractors: ["H", "M", "P"] },

    // Short U words
    { word: "sun", emoji: "☀️", missingIndex: 2, distractors: ["B", "M", "P"] },
    { word: "cup", emoji: "🥤", missingIndex: 2, distractors: ["B", "G", "T"] },
    { word: "bus", emoji: "🚌", missingIndex: 0, distractors: ["G", "M", "P"] },
    { word: "bug", emoji: "🐛", missingIndex: 2, distractors: ["D", "N", "S"] },
    { word: "hug", emoji: "🤗", missingIndex: 2, distractors: ["B", "M", "T"] },
    { word: "mug", emoji: "☕", missingIndex: 0, distractors: ["B", "H", "J"] },
    { word: "jug", emoji: "🫗", missingIndex: 0, distractors: ["B", "H", "M"] },
    { word: "rug", emoji: "🧽", missingIndex: 0, distractors: ["B", "H", "M"] },
    { word: "nut", emoji: "🥜", missingIndex: 2, distractors: ["B", "G", "P"] },
    { word: "run", emoji: "🏃", missingIndex: 1, distractors: ["A", "I", "O"] }
];
