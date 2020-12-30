# Earthy Player

<img src="https://repository-images.githubusercontent.com/287707812/80ed4300-fe90-11ea-832c-0644432922ef" width=300/>

Start with html, end up with mp3 files you can listen to.

## Motivation

I've never been a fast reader. Given a choice between a physical book and an audiobook of the same
content, I'll reach for the latter, 100 times out of 100. Whenever theres a long piece of text I am
required to read, I always look for an audio option. While these options are expanding in recent
years, the vast majority of prose online does not allow you to listen to it.

You can use your device's in-built accessibility tools to do text-to-speech. You can ask Siri "read
this article" and it **sometimes** works. But even when it does, this is far from ideal.

I've tried various text-to-speech APIs, and Google Cloud's is the best I've found. They use some
sort of machine-learning magic, and as a result, the output sounds extremely life-like. Far more
similar to a real human voice than AWS' equivalent offering ("Polly"), for example.

So I find myself writing various packages to convert HTML to an audio file I can listen to. This is
an open-source package all of my projects can import from. It can do the following things:

1. Take an html file and break it apart into "segments". This means putting pauses in the places
   where pauses should go, adding sound effects as desired, and cleaning up various abbreviations.
1. Take this "segments" file from the previous step and create a wav and/or mp3 file.

## Quickstart

You'll need to create a [Google Cloud](https://cloud.google.com/) API key. You can use
[this article](https://cloud.google.com/docs/authentication/getting-started) as instructions, but
the important part is that you end up with a file at `~/.google-api-credentials.json`. You'll need
to create a project within their console, and then enable the "Cloud Text-to-Speech API" on that
project.
