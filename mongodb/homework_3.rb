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
puts "part A:"
puts result.modified_count

#test: should return nil
#pp movies.find({rated: "NOT RATED"}).limit(1).first

#Drama example
#pp movies.find({"genres" => ["Drama"]}).limit(1).first

#part B
#insert a record from info of imdb
#if movies.find({:title => "Game of Thrones"}).limit(1).first.nil?
result = movies.insert_one({
  :title => "Game of Thrones",
  :year => 2011,
  :countries => ["USA", "UK"],
  :genres => ["Action", "Adventure", "Drama", "Fantasy", "Romance"],
  :directors => ["David Benioff", "D.B. Weiss"],
  :imdb => {"rating" => 9.5, "votes" => 1310062, "id" => 944947},
})
puts "part B:"
puts result.n
#end

# test insertion
#pp movies.find({:title => "Game of Thrones"}).limit(1).first

#part C
aggregation = movies.aggregate([
  {"$match" => {"genres" => "Drama"}},
  {"$unwind" => "$genres"},
  {"$group" => {"_id" => "$genres", "count" => {"$sum" => 1}}},
])
puts "part C:"
aggregation.each do |doc|
  if doc["_id"] == "Drama"
    puts doc
  end
end

#part D
#test a record
#pp movies.find({"countries" => {"$regex" => ".*[Cc]hina.*"}}).limit(1).first
aggregation = movies.aggregate([
  {"$match" => {"countries" => "China", "rated" => "Pending rating"}},
  {"$unwind" => "$countries"},
  {"$group" => {"_id" => {"country" => "$countries", "rating" => "Pending rating"}, "count" => {"$sum" => 1}}},
])
puts "part D:"
aggregation.each do |doc|
  if doc["_id"]["country"] == "China"
    puts doc
  end
end

#part E
inventories = client[:inventory]
orders = client[:order]
inventories.drop
orders.drop

orders.insert_many([
  {"_id" => 1, "item" => "almonds", "price" => 12, "quantity" => 2},
  {"_id" => 2, "item" => "pecans", "price" => 20, "quantity" => 1},
])

inventories.insert_many([
  {"_id" => 1, "sku" => "almonds", description: "product 1", "instock" => 120},
  {"_id" => 2, "sku" => "bread", description: "product 2", "instock" => 80},
  {"_id" => 3, "sku" => "cashews", description: "product 3", "instock" => 60},
  {"_id" => 4, "sku" => "pecans", description: "product 4", "instock" => 70},
])

aggregation = orders.aggregate([
  {"$lookup" => {
    from: "inventory",
    localField: "item",
    foreignField: "sku",
    as: "inventory_docs",
  }},
])
puts "part E:"
aggregation.each do |doc|
  puts doc
end
