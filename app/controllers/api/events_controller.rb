module Api
  class EventsController < ApplicationController
    protect_from_forgery with: :null_session

    def create
      template = find_template
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
      return nil if event_params[:template_id].blank?
      Template.find(event_params[:template_id])
    end
  end
end
