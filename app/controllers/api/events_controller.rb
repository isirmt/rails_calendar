module Api
  class EventsController < ActionController::API
    def create
      template, template_error = find_template
      if template_error
        render json: { errors: [ template_error ] }, status: :unprocessable_entity
        return
      end

      values = event_params[:variable_values] || {}

      body =
        if event_params[:body].present?
          event_params[:body]
        elsif template.present?
          TemplateRenderer.render(body: template.body, values: values)
        else
          ""
        end

      event = Event.new(
        calendar_id: event_params[:calendar_id],
        day: event_params[:day],
        template: template,
        body: body,
        variable_values: values,
        is_bigger: event_params[:is_bigger],
        arrangement_mode_override: event_params[:arrangement_mode_override]
      )

      if event.save
        render json: { event: event }, status: :created
      else
        render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def event_params
      params.require(:event).permit(
        :calendar_id,
        :day,
        :template_id,
        :body,
        :is_bigger,
        :arrangement_mode_override,
        variable_values: {}
      )
    end

    def find_template
      template_id = event_params[:template_id]
      return [ nil, nil ] if template_id.blank?

      template = Template.find_by(id: template_id)
      return [ nil, "Template not found" ] if template.nil?

      [ template, nil ]
    end
  end
end
