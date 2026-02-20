class Event < ApplicationRecord
  belongs_to :calendar
  belongs_to :template, optional: true

  validates :day, inclusion: { in: 1..31 }
  validates :body, presence: true
  validates :is_bigger, inclusion: { in: [ true, false ] }
  validates :arrangement_mode_override, inclusion: { in: 0..2 }, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validate :variable_values_is_hash

  def effective_arrangement_mode
    arrangement_mode_override || template&.arrangement_mode || 0
  end

  private

  def variable_values_is_hash
    errors.add(:variable_values, "must be a JSON object") unless variable_values.is_a?(Hash)
  end
end
