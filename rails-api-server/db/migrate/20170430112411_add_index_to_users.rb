class AddIndexToUsers < ActiveRecord::Migration[5.0]
  def change
    add_index :users, [:name, :email], :unique => true
  end

  def drop
    remove_index :users, [:name, :email]
  end
end
