API
=====

### Get movie trailers to show

Returns top 3 movie objects

GET `/get_movies`

**Output:**

    {
      "queue": [
          {
            "tmdb_id": "13995",
            "imdb_id": "tt0103923",
            "title": "Captain America",
            "trailer": "http://youtube.com/watch?v=cs8rFsmhNTc",
            "url": "http://trakt.tv/movie/captain-america-1990",
            "release_date": "661161600",
            "tagline": "Frozen in the ice for decades, Captain America is freed to battle against arch-criminal, The Red Skull.",
            "_id": {
                "$oid": "54657afab0b373753e4b6b90"
            },
            "recommended_by": "us",
            "actors": [
                "Matt Salinger",
                "Ronny Cox",
                "Scott Paulin",
                "Ned Beatty",
                "Darren McGavin",
                "Michael Nouri",
                "Kim Gillingham",
                "Melinda Dillon",
                "Bill Mumy",
                "Francesca Neri",
                "Carla Cassola",
                "Massimilio Massimi",
                "Wayde Preston",
                "Norbert Weisser",
                "Garette Ratliff Henson"
            ],
            "directors": [
                "Albert Pyun"
            ],
            "genres": [
                "Action",
                "Science Fiction"
            ]
        },
        {
            "tmdb_id": "10193",
            "imdb_id": "tt0435761",
            "title": "Toy Story 3",
            "trailer": "http://youtube.com/watch?v=TNMpa5yBf5o",
            "url": "http://trakt.tv/movie/toy-story-3-2010",
            "release_date": "1276758000",
            "tagline": "No toy gets left behind.",
            "_id": {
                "$oid": "54657afab0b373753e4b6b8f"
            },
            "recommended_by": "us",
            "actors": [
                "Tom Hanks",
                "Tim Allen",
                "Ned Beatty",
                "Joan Cusack",
                "Michael Keaton",
                "Whoopi Goldberg",
                "Bonnie Hunt",
                "Wallace Shawn",
                "John Ratzenberger",
                "Don Rickles",
                "Estelle Harris",
                "John Morris",
                "Jodi Benson",
                "Emily Hahn",
                "Laurie Metcalf",
                "Blake Clark",
                "Teddy Newton"
            ],
            "directors": [
                "Lee Unkrich"
            ],
            "genres": [
                "Animation",
                "Family"
            ]
        },
        {
            "tmdb_id": "557",
            "imdb_id": "tt0145487",
            "title": "Spider-Man",
            "trailer": "http://youtube.com/watch?v=0KW8stZ2jSQ",
            "url": "http://trakt.tv/movie/spiderman-2002",
            "release_date": "1020322800",
            "tagline": "With great power comes great responsibility.",
            "_id": {
                "$oid": "54657afab0b373753e4b6b8e"
            },
            "recommended_by": "us",
            "actors": [
                "Tobey Maguire",
                "Willem Dafoe",
                "Kirsten Dunst",
                "James Franco",
                "Cliff Robertson",
                "J.K. Simmons",
                "Joe Manganiello",
                "Gerry Becker",
                "Rosemary Harris",
                "Bill Nunn",
                "Bruce Campbell",
                "Stanley Anderson",
                "Ron Perkins",
                "Michael Papajohn",
                "K.K. Dodds",
                "Jack Betts",
                "Elizabeth Banks",
                "Shan Omar Huey",
                "Lucy Lawless",
                "Robert Kerman",
                "Ted Raimi",
                "John Paxton",
                "Octavia Spencer",
                "Randy Savage",
                "Jayce Bartok",
                "Sara Ramirez",
                "Una Damon",
                "Stan Lee"
            ],
            "directors": [
                "Sam Raimi"
            ],
            "genres": [
                "Action",
                "Adventure",
                "Fantasy",
                "Science Fiction"
            ]
        }
      ]
    }

### Report that a user liked a movie to re-rank the queue

POST `/liked`

Body: The raw movie object that was send in the queue

**Output:**

If failure:

    {
      response: 'fail'
    }

If passes:

    {
      response: 'ok'
    }

### Get friends who have liked the given movie

GET `/friends_like_too?movie_tmdb=<tmdb_id>`

**Output:**

{
  'friends': [
    {
      fb_id: '1232',
      name: 'Hello World',
      photo: https://fb.ukcnfdf.com/fdsfds.jpg
    },
    {
      fb_id: '1232',
      name: 'Hello World',
      photo: https://fb.ukcnfdf.com/fdsfds.jpg
    },
    {
      fb_id: '1232',
      name: 'Hello World',
      photo: https://fb.ukcnfdf.com/fdsfds.jpg
    }
  ]
}

### Make an event

POST `/make_event`

Body:

title: title of the event

Response:

{
  'event': 'https://www.facebook.com/events/3242543545425425'
}

### Recommend a movie to a user

POST `/recommend`

Body:

to: fb_id of user to recommend to
movie: full movie object

**Output:**

If failure:

    {
      response: 'fail'
    }

If passes:

    {
      response: 'ok'
    }

### Search for friends matching a name

GET `/search?text=<name>`

**Output:**

{
    'results': [
        {
            name: 'Hello World',
            id: 243234
        },
        {
            name: 'Hello World',
            id: 243234
        },
        {
            name: 'Hello World',
            id: 243234
        }
    ]
}
