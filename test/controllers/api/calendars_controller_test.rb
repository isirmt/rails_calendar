require "test_helper"

class Api::CalendarsControllerTest < ActionDispatch::IntegrationTest
  test "should get calendars" do
    get api_calendars_url, as: :json

    assert_response :success
    json = JSON.parse(response.body)
    assert_kind_of Array, json["calendars"]
    assert_operator json["calendars"].size, :>=, 1
  end

  test "should create calendar" do
    assert_difference("Calendar.count", 1) do
      post api_calendars_url,
        params: { calendar: { name: "API Calendar", year: 2026, month: 3 } },
        as: :json
    end

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "API Calendar", json.dig("calendar", "name")
  end
end
