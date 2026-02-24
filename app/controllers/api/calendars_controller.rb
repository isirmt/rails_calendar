module Api
  class CalendarsController < ActionController::API
    WEEK_LABELS = %w[日 月 火 水 木 金 土].freeze

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

    def pdf
      calendar = Calendar.find_by(id: params[:id])
      if calendar.nil?
        render json: { errors: [ "Calendar not found" ] }, status: :not_found
        return
      end

      html = ApplicationController.render(
        template: "api/calendars/pdf",
        layout: false,
        assigns: {
          calendar: calendar,
          week_labels: WEEK_LABELS,
          month_cells: build_month_cells(calendar.year, calendar.month),
          events_by_day: calendar.events.order(:day, :id).group_by(&:day)
        }
      )

      pdf_binary = build_pdf(html)
      send_data(
        pdf_binary,
        filename: "calendar-#{calendar.id}-#{calendar.year}-#{format('%02d', calendar.month)}.pdf",
        type: "application/pdf",
        disposition: "inline",
        status: :ok
      )
    rescue Grover::DependencyError => e
      render json: {
        errors: [
          "PDF renderer dependency error: #{e.message}",
          "Install browser runtime with `pnpm exec puppeteer browsers install chrome`."
        ]
      }, status: :service_unavailable
    rescue StandardError => e
      render json: {
        errors: [
          "Failed to generate PDF: #{e.message.to_s.lines.first.to_s.strip}",
          "Set GROVER_EXECUTABLE_PATH if browser auto-detection does not work."
        ]
      }, status: :service_unavailable
    end

    private

    def calendar_params
      params.require(:calendar).permit(:name, :year, :month)
    end

    def build_month_cells(year, month)
      first_weekday = Date.new(year, month, 1).wday
      days_in_month = Date.new(year, month, -1).day

      Array.new(42) do |i|
        day = i - first_weekday + 1
        day >= 1 && day <= days_in_month ? day : nil
      end
    end

    def build_pdf(html)
      options = configured_grover_options
      executable_path = configured_chrome_executable_path
      options = options.merge(executable_path: executable_path) if executable_path.present?
      Grover.new(html, **options).to_pdf
    end

    def configured_grover_options
      options = Grover.configuration.options
      return {} unless options.is_a?(Hash)

      options.deep_dup.symbolize_keys
    end

    def configured_chrome_executable_path
      ENV["GROVER_EXECUTABLE_PATH"].presence || ENV["PUPPETEER_EXECUTABLE_PATH"].presence
    end
  end
end
