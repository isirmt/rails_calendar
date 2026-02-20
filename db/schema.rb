# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_20_000003) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "calendars", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "month", limit: 2, null: false
    t.text "name", null: false
    t.datetime "updated_at", null: false
    t.integer "year", limit: 2, null: false
    t.index ["year", "month"], name: "index_calendars_on_year_and_month"
    t.check_constraint "month >= 1 AND month <= 12", name: "calendars_month_range"
  end

  create_table "events", force: :cascade do |t|
    t.integer "arrangement_mode_override", limit: 2
    t.text "body", null: false
    t.bigint "calendar_id", null: false
    t.datetime "created_at", null: false
    t.integer "day", limit: 2, null: false
    t.boolean "is_bigger", default: false, null: false
    t.bigint "template_id"
    t.datetime "updated_at", null: false
    t.jsonb "variable_values", default: {}, null: false
    t.index ["calendar_id", "day"], name: "index_events_on_calendar_id_and_day"
    t.index ["calendar_id"], name: "index_events_on_calendar_id"
    t.index ["template_id"], name: "index_events_on_template_id"
    t.check_constraint "arrangement_mode_override IS NULL OR arrangement_mode_override >= 0", name: "events_arrangement_mode_override_non_negative"
    t.check_constraint "day >= 1 AND day <= 31", name: "events_day_range"
  end

  create_table "templates", force: :cascade do |t|
    t.integer "arrangement_mode", limit: 2, default: 0, null: false
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.boolean "is_active", default: true, null: false
    t.text "name", null: false
    t.datetime "updated_at", null: false
    t.jsonb "variable_schema", default: {}, null: false
    t.index ["is_active"], name: "index_templates_on_is_active"
    t.check_constraint "arrangement_mode >= 0", name: "templates_arrangement_mode_non_negative"
  end

  add_foreign_key "events", "calendars"
  add_foreign_key "events", "templates"
end
