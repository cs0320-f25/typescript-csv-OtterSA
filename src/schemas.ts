import { z } from "zod";
// Given Person Row Schema
export const PersonRowSchema = z.tuple([z.string(), z.coerce.number()]) .transform( tup => ({name: tup[0], age: tup[1]}))

// Schema with more fields
export const PersonRowLongSchema = z.tuple([z.string(), z.coerce.number(), z.string(), z.string()]) .transform( tup => ({name: tup[0], age: tup[1], name2: tup[2], name3:tup[3]}))

// Schema with different typings in fields
export const PersonDescriptionSchema = z.tuple([z.string(), z.coerce.number(), z.array(z.string())]) .transform( tup => ({name: tup[0], age: tup[1], favoriteFoods: tup[2]}))
