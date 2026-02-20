require "test_helper"

class Api::EventsControllerTest < ActionDispatch::IntegrationTest
  test "should get events by calendar" do
    get api_events_url, params: { calendar_id: calendars(:main_calendar).id }, as: :json

    assert_response :success
    json = JSON.parse(response.body)
    ids = json.fetch("events").map { |e| e.fetch("id") }
    assert_includes ids, events(:templated_event).id
  end

  test "should create event with manual body" do
    assert_difference("Event.count", 1) do
      post api_events_url,
        params: {
          event: {
            calendar_id: calendars(:main_calendar).id,
            day: 21,
            body: "10:00~Manual event",
            variable_values: { time: "10:00" },
            is_bigger: false
          }
        },
        as: :json
    end

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "10:00~Manual event", json.dig("event", "body")
  end

  test "should return 422 when template does not exist" do
    assert_no_difference("Event.count") do
      post api_events_url,
        params: {
          event: {
            calendar_id: calendars(:main_calendar).id,
            day: 21,
            template_id: -1,
            variable_values: { time: "10:00" }
          }
        },
        as: :json
    end

    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_includes json.fetch("errors"), "Template not found"
  end
end
