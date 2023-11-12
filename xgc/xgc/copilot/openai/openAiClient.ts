import { z } from "zod";
import OpenAi from "openai";

const XGC_OPENAI_API_KEY = z.string().parse(process.env.XGC_OPENAI_API_KEY);

export const openaiClient = new OpenAi({
  apiKey: XGC_OPENAI_API_KEY,
});
