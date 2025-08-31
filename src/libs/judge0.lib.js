import axios from "axios"

export const getJudge0LanguageId = (language) => {
   const languageMap = {
  "assembly": 45,
  "bash": 46,
  "basic": 47,
  "c_clang": 75,
  "cpp_clang": 76,
  "c_gcc7": 48,
  "cpp_gcc7": 52,
  "c_gcc8": 49,
  "cpp_gcc8": 53,
  "c": 50,              // GCC 9.2.0 (most common)
  "cpp": 54,            // GCC 9.2.0 (most common)
  "clojure": 86,
  "csharp": 51,
  "cobol": 77,
  "lisp": 55,
  "d": 56,
  "elixir": 57,
  "erlang": 58,
  "fsharp": 87,
  "fortran": 59,
  "go": 60,
  "groovy": 88,
  "haskell": 61,
  "java": 62,
  "javascript": 63,
  "kotlin": 78,
  "lua": 64,
  "objectivec": 79,
  "ocaml": 65,
  "octave": 66,
  "pascal": 67,
  "perl": 85,
  "php": 68,
  "prolog": 69,
  "python2": 70,
  "python": 71,         // Python 3.8.1
  "r": 80,
  "ruby": 72,
  "rust": 73,
  "scala": 81,
  "sql": 82,
  "swift": 83,
  "typescript": 74,
  "vbnet": 84
};


    return languageMap[language.toLowerCase()] || null;
}


export const submissionBatch = async (submissions) => {
    try {
        // console.log(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`)
        // console.log("Submissions", submissions)
        const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
            submissions
        })
        // console.log("Submission Results", data)
        return data
    } catch (error) {
        console.log("Error in submissionBatch", error)
        throw error
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const poolBatchResults = async (tokens) => {
    while (true) {
            const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: false
                }
            });

        const results = data.submissions

        const isAllDone = results.every(
            (res) => res.status.id !== 1 && res.status.id !== 2)
        if (isAllDone) {
            return results
        }
        await sleep(2000)
    }
}