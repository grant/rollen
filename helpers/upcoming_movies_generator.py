#!/usr/bin/env python
#coding: utf8
import urllib2
import json

NOW_PLAYING_URL = "http://api.themoviedb.org/3/movie/now_playing?api_key=89cd5483c3ac6ccbf96482f05b8ca830"
UPCOMING_URL = "http://api.themoviedb.org/3/movie/upcoming?api_key=89cd5483c3ac6ccbf96482f05b8ca830"
SUMMARY_URL = "http://api.trakt.tv/movie/summary.json/e1d030d77ab29d7fb5a18abe94b7572d/"

def get_movie_results(url, page = 1):
    response = urllib2.urlopen(url + "&page=" + str(page))
    data = json.load(response)
    return [result["id"] for result in data["results"]], data["total_pages"]


def enclose_quotes(string):
    return "\"" + str(string) + "\""


def convert_array_to_string(array):
    result = "["
    for item in array:
        result += enclose_quotes(item) + ", "

    if len(result) > 1:
        result = result[:-2] # Remove off by one

    result += "]"
    return result


def convert_data(data):
    if len(data["trailer"]) < 1:
        return None

    result_string = "{"
    result_string += "tmdb_id: " + enclose_quotes(data["tmdb_id"]) + ",\n"
    result_string += "imdb_id: " + enclose_quotes(data["imdb_id"]) + ",\n"

    genres = [str(genre) for genre in data["genres"]]
    result_string += "genres : " + convert_array_to_string(genres) + ",\n"

    result_string += "title: " + enclose_quotes(data["title"]) + ",\n"

    directors = [str(director["name"]) for director in data["people"]["directors"]]
    result_string += "directors : " + convert_array_to_string(directors) + ",\n"

    actors = [str(actor["name"]) for actor in data["people"]["actors"]]
    result_string += "actors : " + convert_array_to_string(actors) + ",\n"

    result_string += "trailer: " + enclose_quotes(data["trailer"]) + ",\n"
    result_string += "url: " + enclose_quotes(data["url"]) + ",\n"
    result_string += "tagline: " + enclose_quotes(data["tagline"]) + ",\n"
    result_string += "release_date: " + enclose_quotes(data["released"])

    result_string += "}"
    return result_string

# All of the movies
entries = []

# Get now playing movies
results, total_pages = get_movie_results(NOW_PLAYING_URL, 1)
entries += results

for i in xrange(2, total_pages + 1):
    results, total_pages = get_movie_results(NOW_PLAYING_URL, i)
    entries += results

# Get upcoming movies
results, total_pages = get_movie_results(UPCOMING_URL, 1)
entries += results

for i in xrange(2, total_pages + 1):
    results, total_pages = get_movie_results(UPCOMING_URL, i)
    entries += results

# Get the summary for every movie in this
movie_ids = set(entries)
for movie_id in movie_ids:
    try:
        response = urllib2.urlopen(SUMMARY_URL + str(movie_id))
        data = json.load(response)

        # Process the data here and transform it
        data = convert_data(data)
        if data is not None:
            data = "new UpcomingMovies(" + data + ").save(function(err, n) {});"
            print data
    except:
        continue
