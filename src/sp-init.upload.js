// UPLOADS FILES (INIT ONLY)

const { createClient } = require("@supabase/supabase-js");
const { getChaptersAndResources } = require("./files.drive");
const supabase = createClient(
  "https://rhsiawnssdarurleehpl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE5ODg2NzQxLCJleHAiOjE5MzU0NjI3NDF9.KiiNeswIDiAjrMGM9--CcKEyBvsTR3aomG2-0PS2dKQ"
);

const SUBNAME = "Social Science"
const SUBID = "ssc"

async function main() {
  const { data: subjects, error } = await supabase
    .from('subject')
    .select('*')
  console.log(subjects, error)
  const ress = await getChaptersAndResources(SUBID)
  if ('error' in ress) throw new Error(ress.error)
  const engChaps = ress.map(x => x.chapterName)
  const { data: chaptersInserted, error: error2 } = await supabase.from("chapter").insert(engChaps.map((name, i) => ({
    name, subject_id: subjects.find(x => x.name == SUBNAME).id, indexer: i
  })))
  // const { data: chaptersInserted, error: error2 } = await supabase.from("chapter").select("*")
  console.log(chaptersInserted, error)
  for (const chap of ress) {
    const name = chap.chapterName;
    const resources = chap.resources
    const { data: resourcesInserted, error: error3 } = await supabase.from("resource").insert(resources.map((res, i) => ({
      name: res.name,
      chapter_id: chaptersInserted.find(x => x.name == name).id,
      drive_id: res.fileID,
      is_folder: res.link.includes("folder"),
      indexer: i,
      answers_id: res.answerID
    })))
    console.log(resourcesInserted, error3)
  }

}
main();
