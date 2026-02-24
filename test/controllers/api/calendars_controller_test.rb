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

  test "should render calendar pdf" do
    calendar = calendars(:main_calendar)

    get pdf_api_calendar_url(calendar)

    assert_response :success
    assert_equal "application/pdf", response.media_type
    assert_includes response.headers["Content-Disposition"], "inline"
  end
end
