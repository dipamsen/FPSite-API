// const { writeFileSync, createWriteStream } = require("fs");
const SupaBase = require("@supabase/supabase-js");
const sb = SupaBase.createClient(
  "https://rhsiawnssdarurleehpl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxOTg4Njc0MSwiZXhwIjoxOTM1NDYyNzQxfQ.hWoM814kdWNd8ElmJyHZfEtpXQ5sz6qjzXn6NbvD0wo"
);

async function main() {
  const { data: signedURL, error } = await sb.storage //.listBuckets();
    .from("main-store")
    .download("q15math.pdf");

  if (error) throw new Error(error.message);
  // @ts-ignore
}

main();
