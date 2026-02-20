class Template < ApplicationRecord
  has_many :events, dependent: :nullify

  validates :name, presence: true
  validates :body, presence: true
  validates :arrangement_mode, inclusion: { in: 0..2 }, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :variable_schema_is_hash

  private

  def variable_schema_is_hash
    errors.add(:variable_schema, "must be a JSON object") unless variable_schema.is_a?(Hash)
  end
end
