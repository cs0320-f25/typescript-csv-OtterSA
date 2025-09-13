import { int } from "zod";
import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");

//Assuming not using Person record objects and only arrays.
test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

//Field count should be consistent between all data.
test("parseCSV is splitting into same number of fields everytime", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const fieldNumber = results[0].length;
  expect(results[1]).toHaveLength(fieldNumber)
  expect(results[2]).toHaveLength(fieldNumber)
  expect(results[3]).toHaveLength(fieldNumber)
  expect(results[4]).toHaveLength(fieldNumber)
  expect(results[5]).toHaveLength(fieldNumber)
  expect(results[6]).toHaveLength(fieldNumber)
  expect(results[7]).toHaveLength(fieldNumber)
  expect(results[8]).toHaveLength(fieldNumber)
  expect(results[9]).toHaveLength(fieldNumber)
  expect(results[10]).toHaveLength(fieldNumber)
});

test("parseCSV is splitting with empty columns", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const fieldNumber = results[0].length;
  expect(results[5]).toHaveLength(fieldNumber)
  expect(results[6]).toHaveLength(fieldNumber)
  expect(results[5][1]).toEqual("")
  expect(results[6][0]).toEqual("")
  
});

test("parseCSV is splitting with quoted fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const fieldNumber = results[0].length;
  expect(results[7]).toHaveLength(fieldNumber)
  expect(results[8]).toHaveLength(fieldNumber)
  expect(results[7][0]).toEqual("Shant")
  expect(results[6][1]).toEqual("28")
  
});

test("parseCSV is splitting with quoted commas", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const fieldNumber = results[0].length;
  expect(results[9]).toHaveLength(fieldNumber)
  expect(results[10]).toHaveLength(fieldNumber)
  expect(results[9][1]).toEqual("veni, vidi, vici")
  expect(results[10][0]).toEqual("Tommy, Chen")
  
});

//Currently parsing as arrays of arrays correctly.
test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  
  expect(results).toHaveLength(11);
  expect(results[0]).toEqual(["name", "age"]);
  expect(results[1]).toEqual(["Alice", "23"]);
  expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
  expect(results[3]).toEqual(["Charlie", "25"]);
  expect(results[4]).toEqual(["Nim", "22"]);
  expect(results[5]).toEqual(["Timothy", ""]);
  expect(results[6]).toEqual(["", "30"]);
  expect(results[7]).toEqual(["Shant", "28"]);
  expect(results[8]).toEqual(["Shant", "28"]);
  expect(results[9]).toEqual(["Caesar", "veni, vidi, vici"]);
  expect(results[10]).toEqual(["Tommy, Chen", "19"]);
});





