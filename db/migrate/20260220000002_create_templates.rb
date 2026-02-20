class CreateTemplates < ActiveRecord::Migration[8.1]
  def change
    create_table :templates do |t|
      t.text :name, null: false
      t.text :body, null: false
      t.jsonb :variable_schema, null: false, default: {}
      t.integer :arrangement_mode, limit: 2, null: false, default: 0
      t.boolean :is_active, null: false, default: true

      t.timestamps
    end

    add_index :templates, :is_active
    add_check_constraint :templates, "arrangement_mode >= 0", name: "templates_arrangement_mode_non_negative"
  end
end
