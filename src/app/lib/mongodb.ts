import { MongoClient } from "mongodb";

const uri = process.env.MONGODB!;
const client = new MongoClient(uri);
const dbName = "sudoku";

export async function getRandomPuzzle() {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("puzzles");

  // Fetch a random puzzle
  const puzzle = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
  if (puzzle.length === 0) return null;

  return {
    question: puzzle[0].question,
    solution: puzzle[0].solution,
  };
}
