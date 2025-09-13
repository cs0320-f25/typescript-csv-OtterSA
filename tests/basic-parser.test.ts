import { int, unknown } from "zod";
import { z } from "zod";
import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { PersonRowSchema } from "../src/schemas";
import { PersonRowLongSchema } from "../src/schemas";
import { PersonDescriptionSchema } from "../src/schemas";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const PEOPLE_LONGER_CSV_PATH = path.join(__dirname, "../data/peopleLonger.csv")
const PEOPLE_DESCRIPTION_CSV_PATH = path.join(__dirname, "../data/peopleDescription.csv")

//Assuming not using Person record objects and only arrays.
test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  for(const row of results) {
    expect(Array.isArray(row)).toBe(true);
  }
});

//Field count should be consistent between all data.
test("parseCSV is splitting into same number of fields everytime", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];

  expect(results[1]).toHaveLength(2)
  expect(results[2]).toHaveLength(2)
  expect(results[3]).toHaveLength(2)
  expect(results[4]).toHaveLength(2)
  expect(results[5]).toHaveLength(2)
  expect(results[6]).toHaveLength(2)
  expect(results[7]).toHaveLength(2)
  expect(results[8]).toHaveLength(2)
  expect(results[9]).toHaveLength(2)
  expect(results[10]).toHaveLength(2)
});

test("parseCSV is splitting with empty columns", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];
  expect(results[5]).toHaveLength(2)
  expect(results[6]).toHaveLength(2)
  expect(results[5][1]).toEqual("")
  expect(results[6][0]).toEqual("")
  
});

test("parseCSV is splitting with quoted fields", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];
  const fieldNumber = results[0].length;
  expect(results[7]).toHaveLength(fieldNumber)
  expect(results[8]).toHaveLength(fieldNumber)
  expect(results[7][0]).toEqual("Shant")
  expect(results[6][1]).toEqual("28")
  
});

test("parseCSV is splitting with quoted commas", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];
  const fieldNumber = results[0].length;
  expect(results[9]).toHaveLength(fieldNumber)
  expect(results[10]).toHaveLength(fieldNumber)
  expect(results[9][1]).toEqual("veni, vidi, vici")
  expect(results[10][0]).toEqual("Tommy, Chen")
  
});

//Currently parsing as arrays of arrays correctly.
test("parseCSV yields arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH) as string[][];
  
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

// New Test now using the schemas
test("parseCSV using the Original data with Schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, PersonRowSchema)
  expect(results).toHaveLength(11);
});

// New Test now using the schemas
test("parseCSV using more fields in schema", async () => {
  const results = await parseCSV(PEOPLE_LONGER_CSV_PATH, PersonRowLongSchema)
  expect(results).toHaveLength(3);
});

// New Test now using the schemas
test("parseCSV using arrays in schema", async () => {
  const results = await parseCSV(PEOPLE_DESCRIPTION_CSV_PATH, PersonDescriptionSchema)
  expect(results).toHaveLength(1);
});




