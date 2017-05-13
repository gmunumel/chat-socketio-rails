class ChatRoomsController < ActionController::API
  include Response
  include ExceptionHandler

  before_action :set_chat_room, only: [:show, :update, :destroy]

  # GET /chat_rooms
  def index
    @chat_rooms = ChatRoom.all
    json_response(@chat_rooms)
  end

  # GET /chat_rooms/search?title=Title
  def search
    title = chat_room_params[:title] ? chat_room_params[:title].downcase : ' '
    @chat_rooms = ChatRoom.where("lower(title) LIKE ?", "%#{title}%").map{|x| x.as_json}
    json_response(@chat_rooms)
  end

  # POST /chat_rooms
  def create
    @chat_room = ChatRoom.create!(chat_room_params)
    json_response(@chat_room, :created)
  end

  # GET /chat_rooms/:id
  def show
    json_response(@chat_room)
  end

  # PATCH/PUT /chat_rooms/:id
  def update
    @chat_room.update(chat_room_params)
    head :no_content
  end

  # DELETE /chat_rooms/:id
  def destroy
    @chat_room.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  # Only allow a trusted parameter "white list" through.
  def chat_room_params
    params.permit(:title, :created_id, :sender_id, :recipient_id)
  end

  def set_chat_room
    @chat_room = ChatRoom.find(params[:id])
  end
end