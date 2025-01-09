import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { load } from "cheerio";

const getUri = (subcategory: string) => `https://langeek.co/en-JA/vocab/subcategory/${subcategory}/learn/review`;


