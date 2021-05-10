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
  - added_at: datetime
- resource
  - id: int4
  - name: varchar
  - subject_id: foreignkey
  - chapter_id: foreignkey
  - added_at: datetime
