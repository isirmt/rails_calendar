Rails.application.routes.draw do
  get "up", to: "rails/health#show", as: :rails_health_check

  root "home#index"
  get "calendars/:id/editor", to: "home#editor", as: :calendar_editor

  namespace :api do
    resources :calendars, only: [ :index, :create ] do
      member do
        get :pdf
      end
    end
    resources :templates, only: [ :index, :create, :update ]
    resources :events, only: [ :index, :create ]
  end
end
