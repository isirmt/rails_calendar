class CreateCalendars < ActiveRecord::Migration[8.1]
  def change
    create_table :calendars do |t|
      t.text :name, null: false
      t.integer :year, limit: 2, null: false
      t.integer :month, limit: 2, null: false

      t.timestamps
    end

    add_index :calendars, [ :year, :month ]
    add_check_constraint :calendars, "month BETWEEN 1 AND 12", name: "calendars_month_range"
  end
end
