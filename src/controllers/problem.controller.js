import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { getJudge0LanguageId, submissionBatch, poolBatchResults } from "../libs/judge0.lib.js"

export const createProblem = async (req, res) => {
  // Logic to create a new problem
  //going to get all the data from the request body
  //going to agiain the user role once again
  //we are going through every id 
  //fetch the language id 


  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'you are not allowed to create a problem' });
  }

  try {
    for (const [langauge, solutionCode] of Object.entries(referenceSolutions)) {
      const langaugeId = getJudge0LanguageId(langauge);
      if (!langaugeId) {
        return res.status(400).json({ message: `Language ${langauge} is not supported` });
      }
      const submission = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: langaugeId,
        stdin: input,
        expected_output: output
      }));
      

      console.log("--------------------------")
      console.log("Submission", submission)
      console.log("--------------------------")

      // console.log(submission)
  //     const submission = [
  //   {
  //     "language_id": 46,
  //     "source_code": "echo hello from Bash"
  //   },
  //   {
  //     "language_id": 71,
  //     "source_code": "print(\"hello from Python\")"
  //   },
  //   {
  //     "language_id": 72,
  //     "source_code": "puts(\"hello from Ruby\")"
  //   }
  // ]

      const submissionResults = await submissionBatch(submission);

      console.log("Submission Results", submissionResults)
      const tokens = submissionResults.map((res) => res.token)

        const results = await poolBatchResults(tokens)
      
      console.log("Results", results)
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({ message: `Reference solution for language ${langauge} failed on testcase ${i + 1}` })
        }
      }


      //save the problem to the database
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        sucess: true,
        message: "Message Created Successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      "error": "Error While Creating Problem",
    });
  }
}

export const getAllProblems = (req, res) => {
  // Logic to get all problems

}

export const getProblemById = (req, res) => {
  // Logic to get a problem by ID

}
export const updateProblem = (req, res) => {
  // Logic to update a problem by ID

}
export const deleteProblem = (req, res) => {
  // Logic to delete a problem by ID

}
export const getAllProblemsSolvedByUser = (req, res) => {
  // Logic to get all problems solved by a user

}
