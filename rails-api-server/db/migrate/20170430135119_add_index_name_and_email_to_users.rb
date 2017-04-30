class AddIndexNameAndEmailToUsers < ActiveRecord::Migration[5.0]
  def change
    remove_index :users, [:name, :email]
    add_index :users, :name, :unique => true
    add_index :users, :email, :unique => true
  end

  def drop
    remove_index :users, :name, :unique => true
    remove_index :users, :email, :unique => true
    add_index :users, [:name, :email]
  end
end
