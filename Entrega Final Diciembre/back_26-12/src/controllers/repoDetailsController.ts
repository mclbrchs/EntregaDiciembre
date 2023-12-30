import { Request, Response } from "express";
import { Octokit } from "octokit";
import Search from "../models/searchModel";

const octokit = new Octokit({
  auth: "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",
});
export async function repoDetailsController(req: Request, res: Response) {
  var params = req.body;
  const userName = params.query;
  const repoName = params.repo;
  console.log(params)
  let updateResult;
  try {
    updateResult = await Search.updateOne(
      { searchType: "repo-details", "queryOptions.q": userName },
      { $set: { date: new Date() } }
    );
  } catch (error) {
    console.log("ERROR!!!!, ", error);
  }

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


    const response = await octokit.request("GET /repos/{owner}/{repo}", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        owner: userName,
        repo:repoName
      });

    //const response = await octokit.rest.search.users({
    //  q: userName,
    //});
    const data = new Search({
      searchType: "users",
      queryOptions: {
        q: userName
      },
    });
    // console.log("Repo name 🎈🎈 ", userName);
    if (updateResult && updateResult.modifiedCount === 0) {
      console.log(
        "USERS : fecha de query creada por primera vez, ",
        updateResult
      );
      const dataToSave = await data.save();
    } else {
      console.log(
        "USERS : fecha modificada de query ya existente, ",
        updateResult
      );
    }

    res.json(response.data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
