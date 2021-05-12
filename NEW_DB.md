# Database Design

## Tables

- subject
  - id: int4
  - name: varchar
- chapter
  - id: int4
  - name: varchar
  - subject_id: foreignkey
  - indexer: int4
  - added_at: timestamp
- resource
  - id: int4
  - name: varchar
  - chapter_id: foreignkey
  - drive_id: varchar
  - is_folder: bool
  - added_at: timestamp
  - indexer: int2
  - ignore: bool
  - answers_id: varchar
