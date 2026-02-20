class CreateEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :events do |t|
      t.references :calendar, null: false, foreign_key: true
      t.references :template, null: true, foreign_key: true
      t.integer :day, limit: 2, null: false
      t.text :body, null: false
      t.jsonb :variable_values, null: false, default: {}
      t.boolean :is_bigger, null: false, default: false
      t.integer :arrangement_mode_override, limit: 2

      t.timestamps
    end

    add_index :events, [ :calendar_id, :day ]
    add_check_constraint :events, "day BETWEEN 1 AND 31", name: "events_day_range"
    add_check_constraint :events, "arrangement_mode_override IS NULL OR arrangement_mode_override >= 0", name: "events_arrangement_mode_override_non_negative"
  end
end
