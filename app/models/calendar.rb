class Calendar < ApplicationRecord
  has_many :events, dependent: :destroy

  validates :name, presence: true
  validates :year, numericality: { only_integer: true }
  validates :month, inclusion: { in: 1..12 }
end
