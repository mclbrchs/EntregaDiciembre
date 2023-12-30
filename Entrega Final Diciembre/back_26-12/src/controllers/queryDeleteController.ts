import { Request, Response } from "express";
import { Octokit } from "octokit";
import Search from "../models/searchModel";

const octokit = new Octokit({
  auth: "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",
});

export async function queryDeleteController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const response = await Search.deleteOne({ _id: id });

    if (response.deletedCount === 1) {
      res.send(`Query with id ${id} has been deleted`);
    } else {
      res.status(404).json({ message: "NO existe el objeto a borrar" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default queryDeleteController;
