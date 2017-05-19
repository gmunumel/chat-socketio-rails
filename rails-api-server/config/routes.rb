Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users do 
    collection do
      get 'search'
      get 'fetch'
    end
  end

  resources :chat_rooms do
    collection do
      get 'search'
    end
    resources :messages do
      collection do
        get 'search'
      end
    end
  end
end
