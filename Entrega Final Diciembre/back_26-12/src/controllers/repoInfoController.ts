import { Request, Response } from "express";
import { Octokit } from "octokit";
import Search from "../models/searchModel";

const octokit = new Octokit({
  auth: "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",
});

export async function repoInfoController(req: Request, res: Response) {
  var params = req.body;
  const repoName = params.query;
  const perPage = params.perPage;
  const page = params.page;
  console.log("RepoInfoParams")
  console.log(params)

  let updateRepoDate;
  try {
    updateRepoDate = await Search.updateOne(
      { searchType: "repos", "queryOptions.q": repoName },
      { $set: { date: new Date() } }
    );
  } catch (error) {
    console.log("ERROR!!!!, ", error);
  }
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const response = await octokit.rest.search.repos({
      q: repoName,
      per_page:perPage,
      page:page
    });

    const data = new Search({
      searchType: "repos",
      queryOptions: {
        q: repoName,
      },
    });

    if (updateRepoDate && updateRepoDate.modifiedCount === 0) {
      console.log(
        "REPOS : fecha de query creada por primera vez, ",
        updateRepoDate
      );
      const dataToSave = await data.save();
    } else {
      console.log(
        "REPOS : fecha modificada de query ya existente, ",
        updateRepoDate
      );
    }

    res.json(response.data);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
