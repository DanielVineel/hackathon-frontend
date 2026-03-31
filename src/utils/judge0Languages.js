import API from "../api/api";

/**
 * Default Judge0 languages (5 main ones with syntax highlighting support)
 */
export const JUDGE0_LANGUAGES = {
  54: { id: 54, name: "cpp", displayName: "C++ (g++)" },
  50: { id: 50, name: "c", displayName: "C (gcc)" },
  62: { id: 62, name: "java", displayName: "Java" },
  63: { id: 63, name: "javascript", displayName: "JavaScript (Node.js)" },
  71: { id: 71, name: "python", displayName: "Python 3" }
};

/**
 * Extended language support (common ones)
 */
const EXTENDED_LANGUAGES = {
  68: { id: 68, name: "php", displayName: "PHP" },
  60: { id: 60, name: "go", displayName: "Go" },
  73: { id: 73, name: "rust", displayName: "Rust" },
  51: { id: 51, name: "csharp", displayName: "C#" },
  74: { id: 74, name: "typescript", displayName: "TypeScript" },
  82: { id: 82, name: "sql", displayName: "SQL (MySQL)" },
  72: { id: 72, name: "bash", displayName: "Bash" },
  4: { id: 4, name: "lua", displayName: "Lua" },
  40: { id: 40, name: "objectivec", displayName: "Objective-C" },
  48: { id: 48, name: "r", displayName: "R" }
};

let cachedLanguages = null;

/**
 * Fetch all available languages from backend (or return defaults)
 */
export const fetchAllJudge0Languages = async () => {
  try {
    if (cachedLanguages) {
      return cachedLanguages;
    }

    const res = await API.get("/problems/languages/available");
    
    if (res.data?.success && Array.isArray(res.data.data)) {
      // Transform Judge0 response to our format
      const languages = {};
      res.data.data.forEach(lang => {
        languages[lang.id] = {
          id: lang.id,
          name: lang.name.toLowerCase().replace(/\s+/g, ""),
          displayName: lang.name
        };
      });
      
      cachedLanguages = languages;
      return languages;
    }
  } catch (error) {
    console.warn("Error fetching languages from backend:", error);
    // Continue with defaults
  }

  // Fallback to default languages
  return JUDGE0_LANGUAGES;
};

/**
 * Convert Judge0 language ID to code name
 */
export const getLanguageNameFromId = (id) => {
  return JUDGE0_LANGUAGES[id]?.name || EXTENDED_LANGUAGES[id]?.name || "unknown";
};

/**
 * Convert Judge0 language ID to display name
 */
export const getLanguageDisplayName = (id) => {
  return JUDGE0_LANGUAGES[id]?.displayName || 
         EXTENDED_LANGUAGES[id]?.displayName || 
         `Language ${id}`;
};

/**
 * Get all language options
 */
export const getAllLanguages = () => {
  return Object.values(JUDGE0_LANGUAGES);
};

/**
 * Get all language options including extended languages
 */
export const getAllLanguagesExtended = () => {
  return {
    ...JUDGE0_LANGUAGES,
    ...EXTENDED_LANGUAGES
  };
};

/**
 * Check if a language ID has syntax highlighting support
 */
export const hasSyntaxHighlighting = (languageId) => {
  return languageId in JUDGE0_LANGUAGES;
};

/**
 * Get syntax highlighter name for a language
 * Returns the CodeMirror extension name to use
 */
export const getSyntaxHighlighterName = (languageId) => {
  const languageName = getLanguageNameFromId(languageId);
  
  // Map language names to CodeMirror extension names or fallbacks
  const highlighterMap = {
    cpp: "cpp",
    c: "cpp",
    java: "cpp",
    javascript: "javascript",
    python: "python",
    php: "php",
    go: "go",
    rust: "rust",
    csharp: "csharp",
    typescript: "javascript",
    bash: "bash",
    sql: "sql",
    lua: "lua",
    objectivec: "cpp",
    r: "r"
  };

  return highlighterMap[languageName] || "cpp"; // Default to C++
};
