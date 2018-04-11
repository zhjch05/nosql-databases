require "redis"

ONE_WEEK_IN_SECONDS = 7 * 86400
VOTE_SCORE = 432

def article_vote(redis, user, article)
  cutoff = Time.now - ONE_WEEK_IN_SECONDS

  unless Time.at(redis.zscore("time:", article)) < cutoff
    article_id = article.split(":")[-1]
    if redis.sadd("voted:" + article_id, user) ## voted set add user
      redis.zincrby("score:", VOTE_SCORE, article)   ## score zset incr score
      redis.hincrby(article, "votes", 1)             ## article hash incr votes
    end
  end
end

def article_switch_vote(redis, user, from_article, to_article)
  # HOMEWORK 2 Part I

  ## add user to new article voted set
  ## del user from old article voted set

  ## "single transaction"
  from_article_id = from_article.split(":")[-1]
  to_article_id = to_article.split(":")[-1]
  if redis.sadd("voted:" + to_article_id, user) && redis.srem("voted:" + from_article_id, user)
    ## inc score of new article in score zset
    ## decr score of old article in score zset
    redis.zincrby("score:", VOTE_SCORE, to_article)
    redis.zincrby("score:", -VOTE_SCORE, from_article)

    ## incr votes of new article hash
    ## decr votes of old article hash
    redis.hincrby(to_article, "votes", 1)
    redis.hincrby(from_article, "votes", -1)
  end
end

redis = Redis.new(host: "127.0.0.1", port: 6379, db: 0)
# user:3 up votes article:1
article_vote(redis, "user:3", "article:1")
# user:3 up votes article:3
article_vote(redis, "user:3", "article:3")
# user:2 switches their vote from article:8 to article:1
article_switch_vote(redis, "user:2", "article:8", "article:1")

# Which article's score is between 10 and 20?
# PRINT THE ARTICLE'S LINK TO STDOUT:
# HOMEWORK 2 Part II
# article = redis.?
# puts redis.?

article = redis.zrangebyscore("score", 10, 20)[0]
if article
  article_id = article.split(":")[-1]
  link = redis.hget("article:" + article_id, "link")
  puts link
end
