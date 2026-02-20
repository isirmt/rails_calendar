module Api
  class CalendarsController < ActionController::API
    def index
      calendars = Calendar.order(:year, :month, :id)
      render json: { calendars: calendars }, status: :ok
    end

    def create
      calendar = Calendar.new(calendar_params)

      if calendar.save
        render json: { calendar: calendar }, status: :created
      else
        render json: { errors: calendar.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def calendar_params
      params.require(:calendar).permit(:name, :year, :month)
    end
  end
end
