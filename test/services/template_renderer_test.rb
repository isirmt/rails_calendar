require "test_helper"

class TemplateRendererTest < ActiveSupport::TestCase
  test "replaces placeholders with provided values" do
    body = "{{time}}~{{topic}}\nFixed"
    values = { time: "10:00", topic: "Weekly meeting" }

    rendered = TemplateRenderer.render(body:, values:)

    assert_equal "10:00~Weekly meeting\nFixed", rendered
  end

  test "keeps non-placeholder text and spacing" do
    body = "Start {{ time }} end"
    values = { "time" => "13:30" }

    rendered = TemplateRenderer.render(body:, values:)

    assert_equal "Start 13:30 end", rendered
  end

  test "uses empty string for missing placeholders" do
    body = "{{time}}~{{topic}}"
    values = { time: "09:00" }

    rendered = TemplateRenderer.render(body:, values:)

    assert_equal "09:00~", rendered
  end

  test "handles nil body and nil values safely" do
    rendered = TemplateRenderer.render(body: nil, values: nil)

    assert_equal "", rendered
  end
end
