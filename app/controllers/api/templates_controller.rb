module Api
  class TemplatesController < ActionController::API
    def index
      templates = Template.order(:id)
      render json: { templates: templates }, status: :ok
    end

    def create
      template = Template.new(template_params)

      if template.save
        render json: { template: template }, status: :created
      else
        render json: { errors: template.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      template = Template.find_by(id: params[:id])
      if template.nil?
        render json: { errors: [ "Template not found" ] }, status: :not_found
        return
      end

      if template.update(template_params)
        render json: { template: template }, status: :ok
      else
        render json: { errors: template.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def template_params
      params.require(:template).permit(
        :name,
        :body,
        :arrangement_mode,
        :is_active,
        variable_schema: {}
      )
    end
  end
end
