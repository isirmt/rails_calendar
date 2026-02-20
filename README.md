# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


## ER

```mermaid
erDiagram
    Calendar ||--o{ Event : has
    Template ||--o{ Event : hoge

    Calendar {
        bigint id PK
        text name
        smallint year
        smallint month
        timestamptz created_at
        timestamptz updated_at
    }

    Template {
        bigint id PK
        text name
        text body
        jsonb variable_schema
        smallint arrangement_mode
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    Event {
        bigint id PK
        bigint calendar_id FK
        bigint template_id FK
        smallint day
        text body
        jsonb variable_values
        boolean is_bigger
        smallint arrangement_mode_override
        timestamptz created_at
        timestamptz updated_at
    }

```