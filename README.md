# Earthy Player

<img src="https://repository-images.githubusercontent.com/287707812/2242f100-4a9f-11eb-92b5-aa7d76758c55" width=300/>

### Intelligently convert HTML to audio.

![CircleCI](https://circleci.com/gh/Arro/earthy-player.svg?style=badge)](https://circleci.com/gh/Arro/earthy-player)

## Motivation

I've never been a fast reader. When I'm given a choice between a physical book, and an audiobook of
the same content, I'll reach for the latter... 100 times out of 100. Whenever there's a long piece
of text I need to read, I always look for an audio option first. While these options are expanding
in recent years, the vast majority of online prose does not allow for listening.

You can use your device's in-built accessibility tools to do text-to-speech. You can ask Siri "read
this article" and it **sometimes** works. But even when it does, this is far from ideal.

I've tried various text-to-speech APIs, and Google Cloud's is the best I've found. They use some
sort of machine-learning magic, and as a result, the output sounds extremely lifelike. This is far
more similar to a real human voice than AWS' equivalent offering ("Polly"), for example.

So I find myself writing various packages to convert HTML to an audio file I can listen to.
Therefore, I wanted to make an npm package from which all of my _other_ projects can import. This is
that project.

## What It Does

It can do the following things:

1. Take an HTML file and pull out the actual content of the article.
1. Break this text apart into "segments". This means putting pauses in the places where pauses
   should go, adding sound effects as desired, and cleaning up various abbreviations.
1. Take this "segments" file from the previous step and create an mp3 file.

Also:

1. The Google API will not work if you give it too much text at a time. This repo abstracts away
   that problem for you, chunking it into separate requests.
1. There are other potential headaches this repo may alleviate, and I will add them to this list
   later.

## Quick Start

You'll need to create a [Google Cloud](https://cloud.google.com/) API key. You can use
[this article](https://cloud.google.com/docs/authentication/getting-started) as instructions, but
the important part is that you end up with a file at `~/.google-api-credentials.json`. You'll need
to create a project within their console, and then enable the "Cloud Text-to-Speech API" on that
project.

You'll also need `ffmpeg` installed. Install this with `brew install ffmpeg` or similar.

Let's say you want to convert
[this article](https://local.theonion.com/cat-seemed-perfectly-content-right-up-until-point-he-bo-1819575397)
to speech. First clone this repo:

`git clone https://github.com/Arro/earthy-player.git`

Next, go to the example directory:

`cd earthy-player/example`

Next, install the example:

`npm install`

Now, run it:

`npm start`

Finally, check your `~/Downloads` folder. There should be a new folder there called `readme-cat/`.

## Run the Tests

These are the commands:

1. `npm run test` to run the tests. This repo uses `ava` for testing.
1. `npm run tdd` to run the test with "--watch" enabled.
