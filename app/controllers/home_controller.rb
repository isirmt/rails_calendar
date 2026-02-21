class HomeController < ApplicationController
  def index
    @page = "home"
    @calendar_id = nil
  end

  def editor
    @page = "editor"
    @calendar_id = params[:id]
    render :index
  end
end
