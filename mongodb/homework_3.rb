require "mongo"
require "pp"
#config
Mongo::Logger.logger.level = Logger::FATAL

#driver client
client = Mongo::Client.new(["localhost:27017"], database: :myDB)
#database
db = client.database
#collection
movies = client[:movies]

#test find
#pp movies.find({rated: "NOT RATED"}).limit(1).first

#part A
result = movies.update_many({"rated" => "NOT RATED"}, {"$set" => {"rated" => "Pending rating"}})
puts result.modified_count

#should return nil
#pp movies.find({rated: "NOT RATED"}).limit(1).first

#Drama example
#pp movies.find({"genres" => ["Drama"]}).limit(1).first

#insert a record from info of imdb
unless movies.find({:title => "Game of Thrones"}).limit(1).first.nil?
  result = movies.insert_one({
    :title => "Game of Thrones",
    :year => 2011,
    :countries => ["USA", "UK"],
    :genres => ["Action", "Adventure", "Drama", "Fantasy", "Romance"],
    :directors => ["David Benioff", "D.B. Weiss"],
    :imdb => {"rating" => 9.5, "votes" => 1310062, "id" => 944947},
  })
  puts result.modified_count
end

pp movies.find({:title => "Game of Thrones"}).limit(1).first
