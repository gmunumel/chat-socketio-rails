class UsersController < ActionController::API
  include Response
  include ExceptionHandler

  before_action :set_user, only: [:show, :update, :destroy]

  # GET /users
  def index
    ids = user_params[:ids] ? user_params[:ids].split(',').map(&:to_i) : nil
    @users = ids ? User.find(ids).index_by(&:id).slice(*ids).values : User.all
    json_response(@users)
  end

  # GET /users/search?name=Name&email=Email
  def search
    name = user_params[:name] ? user_params[:name].downcase : ' '
    email = user_params[:email] ? user_params[:email].downcase : ' '
    @users = User.where("lower(name) LIKE ? OR lower(email) LIKE ?", "%#{name}%", "%#{email}%").map{|x| x.as_json}
    json_response(@users)
  end

  # GET /users/fetch?name=Name&email=Email
  def fetch
    @user = User.find_by!(user_params)
    json_response(@user)
  end

  # POST /users
  def create
    @user = User.create!(user_params)
    json_response(@user, :created)
  end

  # GET /users/:id
  def show
    json_response(@user)
  end

  # PATCH/PUT /users/:id
  def update
    @user.update(user_params)
    head :no_content
  end

  # DELETE /users/:id
  def destroy
    @user.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  # Only allow a trusted parameter "white list" through.
  def user_params
    params.permit(:ids, :name, :email)
  end

  def set_user
    @user = User.find(params[:id])
  end
end