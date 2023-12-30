import { Request, Response } from "express";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: "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",
});

export async function repoSearchController(req: Request, res: Response) {
  try {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();
    console.log("Hello, %s", login);

    res.status(200).json({ users: login });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
