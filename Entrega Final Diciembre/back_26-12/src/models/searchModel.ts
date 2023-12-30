import mongoose, { Schema, Document } from "mongoose";

export interface ISearch extends Document {
  searchType: string;
  queryOptions: {
    q: string;
  };
  date: Date;
}

const searchSchema: Schema = new Schema({
  searchType: { type: String, required: true },
  queryOptions: {
    q: { type: String, required: true },
  },
  date: { type: Date, default: Date.now },
});

const Search = mongoose.model<ISearch>("Search", searchSchema);

export default Search;
