import { Request, Response } from "express";
import { Octokit } from "octokit";
import Search from "../models/searchModel";

const octokit = new Octokit({
  auth: "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",
});
export async function userInfoController(req: Request, res: Response) {
  var params = req.body;
  const userName = params.query;
  const perPage = params.perPage;
  const page = params.page;
  let updateResult;
  try {
    updateResult = await Search.updateOne(
      { searchType: "users", "queryOptions.q": userName },
      { $set: { date: new Date() } }
    );
  } catch (error) {
    console.log("ERROR!!!!, ", error);
  }

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    ("GET /search/users");
    const response = await octokit.request("GET /search/users", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      q: userName,
      page: page,
      per_page: perPage,
    });
    //const response = await octokit.rest.search.users({
    //  q: userName
    //});
    const data = new Search({
      searchType: "users",
      queryOptions: {
        q: userName,
      },
    });
    console.log("User name 🎈🎈 ", userName);
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
